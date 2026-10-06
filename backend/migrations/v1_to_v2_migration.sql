-- ============================================================================
-- EDIZO DB — MIGRATION SCRIPT: v1 (production) -> v2 (secure + feature-complete)
-- Target: MySQL 8.0.29+ (uses IF NOT EXISTS / IF EXISTS on ADD/DROP COLUMN,
--         ADD/DROP INDEX — needed for idempotent re-runs. On MySQL < 8.0.29,
--         strip those clauses and run each block exactly once instead.)
--
-- HOW TO USE THIS FILE
-- 1. Take a full backup first: mysqldump --single-transaction edizo_db > backup.sql
-- 2. Run this against a STAGING copy of prod first, not prod directly.
-- 3. Run section by section (they're numbered) rather than as one blind script —
--    some sections rebuild large tables and are worth timing/monitoring
--    individually on a copy of your real data volume.
-- 4. DDL in MySQL causes an implicit commit — these statements are NOT
--    wrapped in a single rollback-able transaction. If something fails
--    partway through a section, check what applied before re-running.
-- 5. On big tables, ADD COLUMN / ADD INDEX can still take a table lock
--    depending on the change. Run during a low-traffic window, or use
--    pt-online-schema-change / gh-ost if your tables are large and this
--    is a live system that can't tolerate any lock.
-- ============================================================================

USE edizo_db;
SET NAMES utf8mb4;

-- ============================================================================
-- SECTION 1: ROLES & PERMISSIONS
-- ============================================================================

ALTER TABLE roles
  ADD COLUMN IF NOT EXISTS is_system BOOLEAN NOT NULL DEFAULT FALSE AFTER description;

-- Mark existing built-in roles as system roles so the admin UI can protect them
UPDATE roles SET is_system = TRUE WHERE name IN
  ('super_admin','admin','mentor','student','client','staff');

ALTER TABLE permissions
  ADD COLUMN IF NOT EXISTS module VARCHAR(50) NOT NULL DEFAULT 'general' AFTER code,
  ADD INDEX IF NOT EXISTS idx_perm_module (module);

-- New "sales" role for the CRM module
INSERT INTO roles (name, description, is_system)
SELECT 'sales', 'Manages leads, proposals, consultations', TRUE
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'sales');

-- ============================================================================
-- SECTION 2: USERS & AUTH SECURITY
-- ============================================================================

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMP NULL AFTER password_hash,
  ADD COLUMN IF NOT EXISTS mfa_recovery_codes JSON NULL AFTER mfa_secret,
  ADD COLUMN IF NOT EXISTS data_region VARCHAR(10) DEFAULT 'IN' AFTER mfa_recovery_codes,
  ADD INDEX IF NOT EXISTS idx_users_status_role (status, role_id);

ALTER TABLE refresh_tokens
  ADD INDEX IF NOT EXISTS idx_refresh_expiry (expires_at);

ALTER TABLE password_reset_tokens
  ADD INDEX IF NOT EXISTS idx_prt_expiry (expires_at);

ALTER TABLE otp_verifications
  ADD INDEX IF NOT EXISTS idx_otp_expiry (expires_at);

-- New session/device registry, IP rules, and rate limiting
CREATE TABLE IF NOT EXISTS user_sessions (
  id               BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id          INT NOT NULL,
  refresh_token_id BIGINT,
  device_name      VARCHAR(150),
  device_type      ENUM('web','ios','android','api') DEFAULT 'web',
  ip_address       VARCHAR(45),
  user_agent       VARCHAR(255),
  location_city    VARCHAR(100),
  is_current       BOOLEAN DEFAULT FALSE,
  last_active_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revoked_at       TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (refresh_token_id) REFERENCES refresh_tokens(id) ON DELETE SET NULL,
  INDEX idx_sessions_user_active (user_id, revoked_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ip_rules (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  ip_address    VARCHAR(45) NOT NULL,
  cidr_range    VARCHAR(50),
  rule_type     ENUM('allow','block') NOT NULL DEFAULT 'block',
  reason        VARCHAR(255),
  created_by    INT,
  expires_at    TIMESTAMP NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY uq_ip_rule (ip_address, rule_type),
  INDEX idx_ip_rules_type (rule_type)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS rate_limits (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  bucket_key    VARCHAR(150) NOT NULL,
  window_start  TIMESTAMP NOT NULL,
  request_count INT UNSIGNED NOT NULL DEFAULT 1,
  UNIQUE KEY uq_bucket_window (bucket_key, window_start),
  INDEX idx_rate_bucket (bucket_key)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- audit_logs: converting to a partitioned table.
-- ----------------------------------------------------------------------------

-- 1) Drop the existing FK on audit_logs.user_id if present
SET @fk_audit := (SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = 'edizo_db' AND TABLE_NAME = 'audit_logs' AND CONSTRAINT_TYPE = 'FOREIGN KEY' LIMIT 1);
SET @sql_audit := IF(@fk_audit IS NOT NULL, CONCAT('ALTER TABLE audit_logs DROP FOREIGN KEY ', @fk_audit), 'SELECT 1');
PREPARE stmt_audit FROM @sql_audit;
EXECUTE stmt_audit;
DEALLOCATE PREPARE stmt_audit;

-- 2) Widen primary key to include created_at
ALTER TABLE audit_logs
  DROP PRIMARY KEY,
  ADD PRIMARY KEY (id, created_at),
  ADD INDEX IF NOT EXISTS idx_audit_user (user_id, created_at);

-- 3) Partition by year
ALTER TABLE audit_logs
  PARTITION BY RANGE (YEAR(created_at)) (
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p2026 VALUES LESS THAN (2027),
    PARTITION p2027 VALUES LESS THAN (2028),
    PARTITION pmax  VALUES LESS THAN MAXVALUE
  );

-- ============================================================================
-- SECTION 3: DPDP COMPLIANCE & FILE UPLOADS
-- ============================================================================

CREATE TABLE IF NOT EXISTS data_subject_requests (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  request_type  ENUM('access','erasure','correction','portability') NOT NULL,
  status        ENUM('received','in_progress','completed','rejected') DEFAULT 'received',
  notes         TEXT,
  requested_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at   TIMESTAMP NULL,
  resolved_by   INT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

ALTER TABLE file_uploads
  ADD COLUMN IF NOT EXISTS checksum_sha256 CHAR(64) NULL AFTER file_path,
  ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT FALSE AFTER checksum_sha256,
  ADD INDEX IF NOT EXISTS idx_file_checksum (checksum_sha256);

-- ============================================================================
-- SECTION 4: SERVICE CATALOG & PORTFOLIO CMS
-- ============================================================================

ALTER TABLE services
  ADD CONSTRAINT chk_pricing_tiers_json CHECK (pricing_tiers IS NULL OR JSON_VALID(pricing_tiers)),
  ADD CONSTRAINT chk_faqs_json CHECK (faqs IS NULL OR JSON_VALID(faqs)),
  ADD INDEX IF NOT EXISTS idx_services_status (status),
  ADD FULLTEXT INDEX IF NOT EXISTS ft_services_search (title, description);

ALTER TABLE portfolio_projects
  ADD INDEX IF NOT EXISTS idx_portfolio_status (status);

-- ============================================================================
-- SECTION 5: INTERNSHIP PROGRAM & ACADEMY
-- ============================================================================

ALTER TABLE internships
  ADD CONSTRAINT chk_internship_price CHECK (price >= 0);

ALTER TABLE internship_batches
  ADD CONSTRAINT chk_batch_dates CHECK (end_date >= start_date),
  ADD INDEX IF NOT EXISTS idx_batch_status (status);

ALTER TABLE applications
  ADD INDEX IF NOT EXISTS idx_app_email (email);

ALTER TABLE internship_enrollments
  ADD INDEX IF NOT EXISTS idx_enroll_user (user_id);

ALTER TABLE certificates
  ADD INDEX IF NOT EXISTS idx_cert_verify (verification_code);

CREATE TABLE IF NOT EXISTS internship_tasks (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  batch_id      INT NOT NULL,
  title         VARCHAR(255) NOT NULL,
  description   TEXT,
  due_date      DATE,
  max_score     TINYINT UNSIGNED DEFAULT 10,
  created_by    INT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (batch_id) REFERENCES internship_batches(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_itask_batch (batch_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS daily_reports (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  enrollment_id   INT NOT NULL,
  report_date     DATE NOT NULL,
  summary         TEXT NOT NULL,
  hours_spent     DECIMAL(4,2),
  attachment_url  VARCHAR(255),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (enrollment_id) REFERENCES internship_enrollments(id) ON DELETE CASCADE,
  UNIQUE KEY uq_daily_report (enrollment_id, report_date),
  INDEX idx_daily_reports_date (report_date)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS mentor_feedback (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  enrollment_id   INT NOT NULL,
  task_id         INT,
  mentor_id       INT NOT NULL,
  score           TINYINT UNSIGNED,
  comments        TEXT,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (enrollment_id) REFERENCES internship_enrollments(id) ON DELETE CASCADE,
  FOREIGN KEY (task_id) REFERENCES internship_tasks(id) ON DELETE SET NULL,
  FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE CASCADE,
  INDEX idx_feedback_enrollment (enrollment_id)
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 6: LEAD CRM PIPELINE
-- ============================================================================

CREATE TABLE IF NOT EXISTS lead_sources (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL UNIQUE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS leads (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  uuid            CHAR(36) NOT NULL DEFAULT (UUID()) UNIQUE,
  contact_name    VARCHAR(150) NOT NULL,
  company_name    VARCHAR(150),
  email           VARCHAR(255),
  phone           VARCHAR(20),
  source_id       INT,
  service_id      INT,
  stage           ENUM('new','qualified','proposal','negotiation','won','lost') DEFAULT 'new',
  score           TINYINT UNSIGNED DEFAULT 0,
  temperature     ENUM('hot','warm','cold') DEFAULT 'cold',
  estimated_value DECIMAL(12,2),
  assigned_to     INT,
  lost_reason     VARCHAR(255),
  converted_client_id INT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at      TIMESTAMP NULL,
  FOREIGN KEY (source_id) REFERENCES lead_sources(id) ON DELETE SET NULL,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (converted_client_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_leads_stage (stage),
  INDEX idx_leads_assigned (assigned_to, stage),
  INDEX idx_leads_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS lead_notes (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  lead_id       INT NOT NULL,
  author_id     INT NOT NULL,
  note          TEXT NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_lead_notes_lead (lead_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS lead_activities (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  lead_id       INT NOT NULL,
  activity_type ENUM('call','email','meeting','stage_change','follow_up_set','other') NOT NULL,
  details       VARCHAR(500),
  performed_by  INT,
  follow_up_at  TIMESTAMP NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
  FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_lead_activities_lead (lead_id, created_at),
  INDEX idx_lead_activities_followup (follow_up_at)
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 7: PROPOSAL MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS proposals (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  uuid            CHAR(36) NOT NULL DEFAULT (UUID()) UNIQUE,
  lead_id         INT,
  service_request_id INT,
  client_id       INT,
  title           VARCHAR(255) NOT NULL,
  status          ENUM('draft','sent','viewed','approved','rejected','expired') DEFAULT 'draft',
  total_amount    DECIMAL(12,2),
  currency        CHAR(3) DEFAULT 'INR',
  valid_until     DATE,
  signed_at       TIMESTAMP NULL,
  signature_data  JSON,
  pdf_url         VARCHAR(255),
  created_by      INT,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL,
  FOREIGN KEY (service_request_id) REFERENCES service_requests(id) ON DELETE SET NULL,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT chk_signature_json CHECK (signature_data IS NULL OR JSON_VALID(signature_data)),
  INDEX idx_proposals_status (status),
  INDEX idx_proposals_client (client_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS proposal_items (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  proposal_id   INT NOT NULL,
  description   VARCHAR(255) NOT NULL,
  quantity      DECIMAL(10,2) DEFAULT 1,
  unit_price    DECIMAL(12,2) NOT NULL CHECK (unit_price >= 0),
  sort_order    SMALLINT DEFAULT 0,
  FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE CASCADE,
  INDEX idx_proposal_items_proposal (proposal_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS proposal_versions (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  proposal_id   INT NOT NULL,
  version_no    SMALLINT NOT NULL,
  snapshot      JSON NOT NULL,
  created_by    INT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT chk_snapshot_json CHECK (JSON_VALID(snapshot)),
  UNIQUE KEY uq_proposal_version (proposal_id, version_no)
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 8: PROJECTS
-- ============================================================================

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS proposal_id INT NULL AFTER service_request_id,
  ADD CONSTRAINT chk_project_dates CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date),
  ADD INDEX IF NOT EXISTS idx_projects_pm (project_manager_id, status);

-- Add foreign key constraint safely
SET @fk_p_prop := (SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = 'edizo_db' AND TABLE_NAME = 'projects' AND CONSTRAINT_NAME = 'fk_projects_proposal' LIMIT 1);
SET @sql_p_prop := IF(@fk_p_prop IS NULL, 'ALTER TABLE projects ADD CONSTRAINT fk_projects_proposal FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE SET NULL', 'SELECT 1');
PREPARE stmt_p_prop FROM @sql_p_prop;
EXECUTE stmt_p_prop;
DEALLOCATE PREPARE stmt_p_prop;

-- ============================================================================
-- SECTION 9: PROJECT TASK BOARD
-- ============================================================================

CREATE TABLE IF NOT EXISTS project_sprints (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  project_id    INT NOT NULL,
  name          VARCHAR(100) NOT NULL,
  start_date    DATE,
  end_date      DATE,
  status        ENUM('planned','active','completed') DEFAULT 'planned',
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  INDEX idx_sprint_project (project_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS project_tasks (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  project_id      INT NOT NULL,
  sprint_id       INT NULL,
  parent_task_id  INT NULL,
  title           VARCHAR(255) NOT NULL,
  description     TEXT,
  status          ENUM('backlog','todo','in_progress','in_review','done','blocked') DEFAULT 'todo',
  priority        ENUM('low','medium','high','urgent') DEFAULT 'medium',
  assigned_to     INT,
  created_by      INT,
  due_date        DATE,
  estimated_hours DECIMAL(6,2),
  position        INT DEFAULT 0,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at      TIMESTAMP NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (sprint_id) REFERENCES project_sprints(id) ON DELETE SET NULL,
  FOREIGN KEY (parent_task_id) REFERENCES project_tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_tasks_project_status (project_id, status),
  INDEX idx_tasks_assignee (assigned_to, status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS task_comments (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  task_id       INT NOT NULL,
  author_id     INT NOT NULL,
  comment       TEXT NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES project_tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_task_comments_task (task_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS task_attachments (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  task_id       INT NOT NULL,
  file_upload_id BIGINT NOT NULL,
  uploaded_by   INT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES project_tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (file_upload_id) REFERENCES file_uploads(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS time_logs (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  task_id       INT NOT NULL,
  user_id       INT NOT NULL,
  minutes_spent INT UNSIGNED NOT NULL,
  work_date     DATE NOT NULL,
  notes         VARCHAR(255),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES project_tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_timelogs_task (task_id),
  INDEX idx_timelogs_user_date (user_id, work_date)
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 10: INVOICING & PAYMENTS
-- ============================================================================

ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(12,2) NOT NULL DEFAULT 0 AFTER total_amount,
  ADD CONSTRAINT chk_invoice_subtotal CHECK (subtotal >= 0),
  ADD CONSTRAINT chk_invoice_total CHECK (total_amount >= 0),
  ADD INDEX IF NOT EXISTS idx_invoice_client (client_id, status),
  ADD INDEX IF NOT EXISTS idx_invoice_due (due_date);

CREATE TABLE IF NOT EXISTS payments (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  uuid              CHAR(36) NOT NULL DEFAULT (UUID()) UNIQUE,
  invoice_id        INT NOT NULL,
  client_id         INT NOT NULL,
  amount            DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  currency          CHAR(3) DEFAULT 'INR',
  method            ENUM('razorpay','upi','bank_transfer','card','cash','other') NOT NULL,
  gateway_payment_id VARCHAR(150),
  gateway_order_id   VARCHAR(150),
  status            ENUM('initiated','pending','success','failed','refunded') DEFAULT 'initiated',
  receipt_url       VARCHAR(255),
  paid_at           TIMESTAMP NULL,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES users(id),
  UNIQUE KEY uq_gateway_payment (gateway_payment_id),
  INDEX idx_payments_invoice (invoice_id),
  INDEX idx_payments_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payment_transactions (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  payment_id      INT NOT NULL,
  event_type      VARCHAR(100) NOT NULL,
  raw_payload     JSON,
  gateway_signature_verified BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
  CONSTRAINT chk_paytxn_json CHECK (raw_payload IS NULL OR JSON_VALID(raw_payload)),
  INDEX idx_paytxn_payment (payment_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payment_refunds (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  payment_id      INT NOT NULL,
  amount          DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  reason          VARCHAR(255),
  gateway_refund_id VARCHAR(150),
  status          ENUM('initiated','processed','failed') DEFAULT 'initiated',
  processed_by    INT,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
  FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

UPDATE invoices
SET amount_paid = total_amount
WHERE status = 'paid' AND amount_paid = 0;

-- ============================================================================
-- SECTION 11: CONSULTATION BOOKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS consultation_slots (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  host_id       INT NOT NULL,
  slot_start    DATETIME NOT NULL,
  slot_end      DATETIME NOT NULL,
  is_booked     BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (host_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_slot_time CHECK (slot_end > slot_start),
  INDEX idx_slots_host_time (host_id, slot_start),
  INDEX idx_slots_available (is_booked, slot_start)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS consultations (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  slot_id         INT NOT NULL UNIQUE,
  lead_id         INT,
  client_id       INT,
  guest_name      VARCHAR(150),
  guest_email     VARCHAR(255),
  topic           VARCHAR(255),
  meeting_link    VARCHAR(255),
  status          ENUM('scheduled','completed','cancelled','no_show') DEFAULT 'scheduled',
  reminder_sent_at TIMESTAMP NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (slot_id) REFERENCES consultation_slots(id) ON DELETE CASCADE,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_consultation_status (status)
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 12: SUPPORT TICKET SYSTEM
-- ============================================================================

CREATE TABLE IF NOT EXISTS tickets (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  uuid            CHAR(36) NOT NULL DEFAULT (UUID()) UNIQUE,
  client_id       INT,
  project_id      INT NULL,
  subject         VARCHAR(255) NOT NULL,
  description     TEXT NOT NULL,
  priority        ENUM('low','medium','high','urgent') DEFAULT 'medium',
  status          ENUM('open','in_progress','waiting_on_client','resolved','closed') DEFAULT 'open',
  assigned_to     INT,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  resolved_at     TIMESTAMP NULL,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_tickets_status_priority (status, priority),
  INDEX idx_tickets_client (client_id),
  INDEX idx_tickets_assigned (assigned_to, status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ticket_replies (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id     INT NOT NULL,
  author_id     INT NOT NULL,
  message       TEXT NOT NULL,
  is_internal_note BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_ticket_replies_ticket (ticket_id, created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS ticket_attachments (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id     INT NOT NULL,
  file_upload_id BIGINT NOT NULL,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (file_upload_id) REFERENCES file_uploads(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 13: DOCUMENT CENTER & CLIENT PORTAL
-- ============================================================================

CREATE TABLE IF NOT EXISTS document_categories (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS documents (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  category_id   INT,
  project_id    INT NULL,
  client_id     INT NULL,
  file_upload_id BIGINT NOT NULL,
  title         VARCHAR(255) NOT NULL,
  visible_to_client BOOLEAN DEFAULT TRUE,
  created_by    INT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES document_categories(id) ON DELETE SET NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (file_upload_id) REFERENCES file_uploads(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_documents_client (client_id, visible_to_client),
  INDEX idx_documents_project (project_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS client_notes (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  client_id     INT NOT NULL,
  author_id     INT NOT NULL,
  note          TEXT NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_client_notes_client (client_id)
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 14: NOTIFICATION CENTER
-- ============================================================================

CREATE TABLE IF NOT EXISTS notifications (
  id            BIGINT AUTO_INCREMENT,
  user_id       INT NOT NULL,
  channel       ENUM('in_app','email','sms','whatsapp') NOT NULL,
  title         VARCHAR(255) NOT NULL,
  body          VARCHAR(1000),
  link_url      VARCHAR(255),
  read_at       TIMESTAMP NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id, created_at),
  INDEX idx_notif_user_unread (user_id, read_at)
) ENGINE=InnoDB
PARTITION BY RANGE (YEAR(created_at)) (
  PARTITION p2025 VALUES LESS THAN (2026),
  PARTITION p2026 VALUES LESS THAN (2027),
  PARTITION p2027 VALUES LESS THAN (2028),
  PARTITION pmax  VALUES LESS THAN MAXVALUE
);

CREATE TABLE IF NOT EXISTS notification_logs (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  notification_id BIGINT,
  channel       ENUM('email','sms','whatsapp') NOT NULL,
  provider      VARCHAR(50),
  status        ENUM('queued','sent','delivered','failed') DEFAULT 'queued',
  error_message VARCHAR(500),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_notif_logs_status (status)
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 15: WEBSITE CMS BUILDER
-- ============================================================================

CREATE TABLE IF NOT EXISTS pages (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  slug          VARCHAR(150) NOT NULL UNIQUE,
  title         VARCHAR(255) NOT NULL,
  status        ENUM('draft','published') DEFAULT 'draft',
  created_by    INT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_pages_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS page_sections (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  page_id       INT NOT NULL,
  section_type  VARCHAR(50) NOT NULL,
  content       JSON NOT NULL,
  sort_order    SMALLINT DEFAULT 0,
  is_active     BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
  CONSTRAINT chk_section_content_json CHECK (JSON_VALID(content)),
  INDEX idx_sections_page (page_id, sort_order)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS seo_meta (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  page_id         INT NOT NULL UNIQUE,
  meta_title      VARCHAR(255),
  meta_description VARCHAR(500),
  og_image_url    VARCHAR(255),
  canonical_url   VARCHAR(255),
  FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS banners (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(255),
  image_url     VARCHAR(255) NOT NULL,
  link_url      VARCHAR(255),
  placement     VARCHAR(50),
  starts_at     TIMESTAMP NULL,
  ends_at       TIMESTAMP NULL,
  status        ENUM('active','inactive') DEFAULT 'active',
  INDEX idx_banners_placement_status (placement, status)
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 16: MARKETING
-- ============================================================================

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  status        ENUM('subscribed','unsubscribed') DEFAULT 'subscribed',
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS campaigns (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  channel       ENUM('email','whatsapp') NOT NULL,
  subject       VARCHAR(255),
  body          TEXT,
  status        ENUM('draft','scheduled','sending','sent') DEFAULT 'draft',
  scheduled_at  TIMESTAMP NULL,
  created_by    INT,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS campaign_logs (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  campaign_id   INT NOT NULL,
  recipient     VARCHAR(255) NOT NULL,
  status        ENUM('sent','failed','opened','clicked') DEFAULT 'sent',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
  INDEX idx_campaign_logs_campaign (campaign_id)
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 17: AI FEATURES
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_project_estimates (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  lead_id         INT,
  requested_by    INT,
  input_summary   TEXT NOT NULL,
  estimated_cost_min DECIMAL(12,2),
  estimated_cost_max DECIMAL(12,2),
  estimated_weeks TINYINT UNSIGNED,
  suggested_team  JSON,
  model_version   VARCHAR(50),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL,
  FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT chk_suggested_team_json CHECK (suggested_team IS NULL OR JSON_VALID(suggested_team))
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 18: EMPLOYEE MANAGEMENT
-- ============================================================================

CREATE TABLE IF NOT EXISTS employees (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  user_id         INT NOT NULL UNIQUE,
  employee_code   VARCHAR(30) NOT NULL UNIQUE,
  department      VARCHAR(100),
  designation     VARCHAR(100),
  date_of_joining DATE,
  reporting_to    INT,
  employment_type ENUM('full_time','part_time','contract','intern') DEFAULT 'full_time',
  status          ENUM('active','on_leave','terminated') DEFAULT 'active',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reporting_to) REFERENCES employees(id) ON DELETE SET NULL,
  INDEX idx_employees_dept (department)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS attendance (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  employee_id   INT NOT NULL,
  work_date     DATE NOT NULL,
  check_in      TIME,
  check_out     TIME,
  status        ENUM('present','absent','half_day','holiday','wfh') DEFAULT 'present',
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  UNIQUE KEY uq_attendance_day (employee_id, work_date),
  INDEX idx_attendance_date (work_date)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS leave_requests (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  employee_id   INT NOT NULL,
  leave_type    ENUM('sick','casual','earned','unpaid') NOT NULL,
  start_date    DATE NOT NULL,
  end_date      DATE NOT NULL,
  reason        VARCHAR(500),
  status        ENUM('pending','approved','rejected') DEFAULT 'pending',
  approved_by   INT,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT chk_leave_dates CHECK (end_date >= start_date),
  INDEX idx_leave_employee_status (employee_id, status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS performance_reviews (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  employee_id   INT NOT NULL,
  reviewer_id   INT NOT NULL,
  review_period VARCHAR(20) NOT NULL,
  rating        TINYINT UNSIGNED CHECK (rating BETWEEN 1 AND 5),
  strengths     TEXT,
  improvements  TEXT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY uq_review_period (employee_id, review_period)
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 19: REMAINING EXISTING-TABLE INDEXES + ANALYTICS
-- ============================================================================

ALTER TABLE testimonials
  ADD INDEX IF NOT EXISTS idx_testimonials_status (status);

ALTER TABLE contact_messages
  ADD INDEX IF NOT EXISTS idx_contact_status (status);

CREATE TABLE IF NOT EXISTS analytics_events (
  id            BIGINT AUTO_INCREMENT,
  event_type    VARCHAR(100) NOT NULL,
  entity_type   VARCHAR(100),
  entity_id     INT,
  user_id       INT NULL,
  metadata      JSON,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id, created_at),
  INDEX idx_events_type_date (event_type, created_at)
) ENGINE=InnoDB
PARTITION BY RANGE (YEAR(created_at)) (
  PARTITION p2025 VALUES LESS THAN (2026),
  PARTITION p2026 VALUES LESS THAN (2027),
  PARTITION p2027 VALUES LESS THAN (2028),
  PARTITION pmax  VALUES LESS THAN MAXVALUE
);

CREATE TABLE IF NOT EXISTS analytics_daily_summary (
  summary_date      DATE PRIMARY KEY,
  new_leads         INT UNSIGNED DEFAULT 0,
  leads_won         INT UNSIGNED DEFAULT 0,
  revenue_collected DECIMAL(14,2) DEFAULT 0,
  active_projects   INT UNSIGNED DEFAULT 0,
  new_applications  INT UNSIGNED DEFAULT 0,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

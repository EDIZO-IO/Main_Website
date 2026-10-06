-- ============================================================================
-- EDIZO DB — V2 SCHEMA (SECURE + PERFORMANT + FEATURE-COMPLETE)
-- Target: MySQL 8.0.17+ (InnoDB, utf8mb4, CHECK constraints, UUID, JSON,
--         generated columns, functional indexes, partitioning)
--
-- This file is additive/replacing relative to your current schema. It is
-- meant to be run against a NEW database, or reviewed table-by-table and
-- applied as ALTER statements against production.
-- ============================================================================

CREATE DATABASE IF NOT EXISTS edizo_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE edizo_db;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- SECTION 1: RBAC — unchanged, but permissions now scoped to modules
-- ============================================================================

CREATE TABLE IF NOT EXISTS roles (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(50) NOT NULL UNIQUE,
  description   VARCHAR(255),
  is_system     BOOLEAN NOT NULL DEFAULT FALSE,   -- prevents deletion of built-in roles from admin UI
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS permissions (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  code          VARCHAR(100) NOT NULL UNIQUE,      -- 'leads.manage', 'invoices.view', ...
  module        VARCHAR(50)  NOT NULL,             -- 'crm','billing','projects',... used for grouped UI + faster filtering
  description   VARCHAR(255),
  INDEX idx_perm_module (module)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id        INT NOT NULL,
  permission_id  INT NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 2: USERS & AUTH SECURITY (hardened)
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  uuid                CHAR(36) NOT NULL DEFAULT (UUID()) UNIQUE,
  name                VARCHAR(100) NOT NULL,
  email               VARCHAR(255) NOT NULL UNIQUE,
  phone               VARCHAR(20),
  password_hash       VARCHAR(255) NOT NULL,       -- bcrypt/argon2, never store reversible
  password_changed_at TIMESTAMP NULL,               -- lets you enforce "rotate every N days" or force-logout on change
  role_id             INT NOT NULL DEFAULT 4,
  status              ENUM('active','inactive','banned','pending') NOT NULL DEFAULT 'pending',
  email_verified_at   TIMESTAMP NULL,
  phone_verified_at   TIMESTAMP NULL,
  failed_login_count  TINYINT UNSIGNED NOT NULL DEFAULT 0,
  locked_until        TIMESTAMP NULL,
  last_login_at       TIMESTAMP NULL,
  last_login_ip       VARCHAR(45),
  mfa_enabled         BOOLEAN NOT NULL DEFAULT FALSE,
  mfa_secret          VARCHAR(255),                 -- encrypt at application layer (AES-256-GCM), never plaintext
  mfa_recovery_codes  JSON,                          -- store hashed, one-time-use
  data_region         VARCHAR(10) DEFAULT 'IN',      -- DPDP: track where the subject's data is processed
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at          TIMESTAMP NULL,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  INDEX idx_users_email (email),
  INDEX idx_users_role (role_id),
  INDEX idx_users_deleted (deleted_at),
  INDEX idx_users_status_role (status, role_id)      -- speeds up "active clients", "active staff" listing queries
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  token_hash    CHAR(64) NOT NULL,
  device_info   VARCHAR(255),
  ip_address    VARCHAR(45),
  issued_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at    TIMESTAMP NOT NULL,
  revoked_at    TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_token_hash (token_hash),
  INDEX idx_refresh_user (user_id),
  INDEX idx_refresh_expiry (expires_at)              -- lets a cron purge expired tokens without a full scan
) ENGINE=InnoDB;

-- Explicit session/device registry, separate from raw refresh tokens
CREATE TABLE IF NOT EXISTS user_sessions (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id         INT NOT NULL,
  refresh_token_id BIGINT,
  device_name     VARCHAR(150),
  device_type     ENUM('web','ios','android','api') DEFAULT 'web',
  ip_address      VARCHAR(45),
  user_agent      VARCHAR(255),
  location_city   VARCHAR(100),                      -- resolved via IP geolocation at login time
  is_current      BOOLEAN DEFAULT FALSE,
  last_active_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  revoked_at      TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (refresh_token_id) REFERENCES refresh_tokens(id) ON DELETE SET NULL,
  INDEX idx_sessions_user_active (user_id, revoked_at)
) ENGINE=InnoDB;

-- IP blocklist / allowlist for Security Center
CREATE TABLE IF NOT EXISTS ip_rules (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  ip_address    VARCHAR(45) NOT NULL,
  cidr_range    VARCHAR(50),                          -- optional, for blocking a subnet
  rule_type     ENUM('allow','block') NOT NULL DEFAULT 'block',
  reason        VARCHAR(255),
  created_by    INT,
  expires_at    TIMESTAMP NULL,                       -- temporary bans
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY uq_ip_rule (ip_address, rule_type),
  INDEX idx_ip_rules_type (rule_type)
) ENGINE=InnoDB;

-- Generic rate limiting store
CREATE TABLE IF NOT EXISTS rate_limits (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  bucket_key    VARCHAR(150) NOT NULL,                -- e.g. 'login:ip:1.2.3.4' or 'otp:email:x@y.com'
  window_start  TIMESTAMP NOT NULL,
  request_count INT UNSIGNED NOT NULL DEFAULT 1,
  UNIQUE KEY uq_bucket_window (bucket_key, window_start),
  INDEX idx_rate_bucket (bucket_key)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  token_hash    CHAR(64) NOT NULL UNIQUE,
  expires_at    TIMESTAMP NOT NULL,
  used_at       TIMESTAMP NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_prt_expiry (expires_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS otp_verifications (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NULL,
  target        VARCHAR(255) NOT NULL,
  purpose       ENUM('signup','login','password_reset','phone_verify') NOT NULL,
  otp_hash      CHAR(64) NOT NULL,
  attempts      TINYINT UNSIGNED NOT NULL DEFAULT 0,
  max_attempts  TINYINT UNSIGNED NOT NULL DEFAULT 5,
  expires_at    TIMESTAMP NOT NULL,
  verified_at   TIMESTAMP NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_otp_target (target),
  INDEX idx_otp_expiry (expires_at)
) ENGINE=InnoDB;

-- Partitioned Audit logs by year
CREATE TABLE IF NOT EXISTS audit_logs (
  id            BIGINT AUTO_INCREMENT,
  user_id       INT NULL,
  action        VARCHAR(100) NOT NULL,
  entity_type   VARCHAR(100),
  entity_id     INT,
  ip_address    VARCHAR(45),
  metadata      JSON,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id, created_at),
  INDEX idx_audit_entity (entity_type, entity_id),
  INDEX idx_audit_user (user_id, created_at)
) ENGINE=InnoDB
PARTITION BY RANGE (YEAR(created_at)) (
  PARTITION p2025 VALUES LESS THAN (2026),
  PARTITION p2026 VALUES LESS THAN (2027),
  PARTITION p2027 VALUES LESS THAN (2028),
  PARTITION pmax  VALUES LESS THAN MAXVALUE
);

-- ============================================================================
-- SECTION 3: DPDP COMPLIANCE & FILE UPLOADS
-- ============================================================================

CREATE TABLE IF NOT EXISTS consent_logs (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NULL,
  email         VARCHAR(255),
  consent_type  VARCHAR(100) NOT NULL,
  granted       BOOLEAN NOT NULL DEFAULT TRUE,
  ip_address    VARCHAR(45),
  user_agent    VARCHAR(255),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_consent_user (user_id)
) ENGINE=InnoDB;

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

CREATE TABLE IF NOT EXISTS file_uploads (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  uuid          CHAR(36) NOT NULL DEFAULT (UUID()) UNIQUE,
  user_id       INT NULL,
  filename      VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type     VARCHAR(100) NOT NULL,
  file_size     INT UNSIGNED NOT NULL,
  file_path     VARCHAR(500) NOT NULL,
  checksum_sha256 CHAR(64),                          -- integrity check + dedup detection
  is_public     BOOLEAN NOT NULL DEFAULT FALSE,       -- explicit flag
  ip_address    VARCHAR(45),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at    TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_file_user (user_id),
  INDEX idx_file_checksum (checksum_sha256)
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 4: SERVICE CATALOG & PORTFOLIO CMS
-- ============================================================================

CREATE TABLE IF NOT EXISTS service_categories (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL UNIQUE,
  slug          VARCHAR(120) NOT NULL UNIQUE,
  description   TEXT,
  status        ENUM('active','inactive') DEFAULT 'active',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS services (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  uuid              CHAR(36) NOT NULL DEFAULT (UUID()) UNIQUE,
  category_id       INT NOT NULL,
  title             VARCHAR(255) NOT NULL,
  description       TEXT,
  features          TEXT,
  price             VARCHAR(100),
  icon              VARCHAR(255),
  image_url         VARCHAR(255),
  pricing_tiers     JSON CHECK (JSON_VALID(pricing_tiers)),
  solutions         TEXT,
  technologies      TEXT,
  process           TEXT,
  benefits          TEXT,
  faqs              JSON CHECK (JSON_VALID(faqs)),
  status            ENUM('active','inactive','archived') DEFAULT 'active',
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at        TIMESTAMP NULL,
  FOREIGN KEY (category_id) REFERENCES service_categories(id),
  INDEX idx_services_category (category_id),
  INDEX idx_services_status (status),
  FULLTEXT INDEX ft_services_search (title, description)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS portfolio_projects (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  service_id    INT,
  title         VARCHAR(255) NOT NULL,
  client        VARCHAR(255),
  category      VARCHAR(255),
  description   TEXT,
  image_url     VARCHAR(255),
  color         VARCHAR(50) DEFAULT 'bg-blue-500',
  status        ENUM('active','inactive') DEFAULT 'active',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at    TIMESTAMP NULL,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
  INDEX idx_portfolio_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS service_related_projects (
  service_id            INT NOT NULL,
  portfolio_project_id  INT NOT NULL,
  PRIMARY KEY (service_id, portfolio_project_id),
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  FOREIGN KEY (portfolio_project_id) REFERENCES portfolio_projects(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 5: INTERNSHIP PROGRAM & ACADEMY
-- ============================================================================

CREATE TABLE IF NOT EXISTS internship_categories (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL UNIQUE,
  slug          VARCHAR(120) NOT NULL UNIQUE,
  description   TEXT,
  status        ENUM('active','inactive') DEFAULT 'active'
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS internships (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  uuid              CHAR(36) NOT NULL DEFAULT (UUID()) UNIQUE,
  category_id       INT NOT NULL,
  title             VARCHAR(255) NOT NULL,
  company           VARCHAR(100) NOT NULL,
  duration          VARCHAR(100),
  mode              ENUM('online','offline','hybrid') NOT NULL,
  description       TEXT,
  syllabus          TEXT,
  benefits          TEXT,
  eligibility       TEXT,
  skill_level       ENUM('beginner','intermediate','advanced') DEFAULT 'beginner',
  stipend           VARCHAR(100),
  price             DECIMAL(10,2) DEFAULT 0.00 CHECK (price >= 0),
  image             VARCHAR(255) DEFAULT '/images/internship.png',
  rating            DECIMAL(3,2) DEFAULT 5.00 CHECK (rating BETWEEN 0 AND 5),
  status            ENUM('draft','active','closed','archived') DEFAULT 'draft',
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at        TIMESTAMP NULL,
  FOREIGN KEY (category_id) REFERENCES internship_categories(id),
  INDEX idx_internships_category (category_id),
  INDEX idx_internships_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS mentors (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL UNIQUE,
  expertise     VARCHAR(255),
  bio           TEXT,
  linkedin_url  VARCHAR(255),
  status        ENUM('active','inactive') DEFAULT 'active',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS internship_batches (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  internship_id         INT NOT NULL,
  batch_name            VARCHAR(100) NOT NULL,
  start_date            DATE NOT NULL,
  end_date              DATE NOT NULL,
  application_deadline  DATE,
  capacity              SMALLINT UNSIGNED NOT NULL DEFAULT 30,
  seats_filled          SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  status                ENUM('upcoming','ongoing','completed','cancelled') DEFAULT 'upcoming',
  FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE,
  CONSTRAINT chk_seats CHECK (seats_filled <= capacity),
  CONSTRAINT chk_batch_dates CHECK (end_date >= start_date),
  INDEX idx_batch_internship (internship_id),
  INDEX idx_batch_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS applications (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  user_id         INT,
  internship_id   INT NOT NULL,
  batch_id        INT,
  first_name      VARCHAR(100) NOT NULL,
  last_name       VARCHAR(100) NOT NULL,
  email           VARCHAR(255) NOT NULL,
  linkedin        VARCHAR(255),
  why_select      TEXT,
  resume_url      VARCHAR(255),
  status          ENUM('pending','shortlisted','rejected','accepted') DEFAULT 'pending',
  reviewed_by     INT,
  reviewed_at     TIMESTAMP NULL,
  ip_address      VARCHAR(45),
  user_agent      VARCHAR(255),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE,
  FOREIGN KEY (batch_id) REFERENCES internship_batches(id) ON DELETE SET NULL,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_app_internship (internship_id),
  INDEX idx_app_status (status),
  INDEX idx_app_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS internship_enrollments (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  application_id    INT NOT NULL UNIQUE,
  user_id           INT NOT NULL,
  batch_id          INT NOT NULL,
  progress_percent  TINYINT UNSIGNED DEFAULT 0 CHECK (progress_percent <= 100),
  status            ENUM('ongoing','completed','dropped') DEFAULT 'ongoing',
  started_at        DATE,
  completed_at      DATE,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (batch_id) REFERENCES internship_batches(id) ON DELETE CASCADE,
  INDEX idx_enroll_batch (batch_id),
  INDEX idx_enroll_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS certificates (
  id                 INT AUTO_INCREMENT PRIMARY KEY,
  enrollment_id      INT NOT NULL UNIQUE,
  certificate_no     VARCHAR(50) NOT NULL UNIQUE,
  verification_code  CHAR(12) NOT NULL UNIQUE,
  file_url           VARCHAR(255),
  issued_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (enrollment_id) REFERENCES internship_enrollments(id) ON DELETE CASCADE,
  INDEX idx_cert_verify (verification_code)
) ENGINE=InnoDB;

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
  signature_data  JSON CHECK (JSON_VALID(signature_data)),
  pdf_url         VARCHAR(255),
  created_by      INT,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL,
  FOREIGN KEY (service_request_id) REFERENCES service_requests(id) ON DELETE SET NULL,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
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
  snapshot      JSON NOT NULL CHECK (JSON_VALID(snapshot)),
  created_by    INT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY uq_proposal_version (proposal_id, version_no)
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 8: CLIENT LEADS, SERVICE REQUESTS & PROJECTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS service_requests (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  user_id               INT,
  service_id            INT NOT NULL,
  project_details       TEXT,
  requirements          TEXT,
  budget                VARCHAR(100),
  status                ENUM('pending','reviewing','accepted','rejected','converted') DEFAULT 'pending',
  assigned_to           INT,
  converted_project_id  INT NULL,
  ip_address            VARCHAR(45),
  user_agent            VARCHAR(255),
  created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_sr_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS projects (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  uuid                CHAR(36) NOT NULL DEFAULT (UUID()) UNIQUE,
  client_id           INT NOT NULL,
  service_id          INT NOT NULL,
  service_category_id INT NOT NULL,
  service_request_id  INT,
  proposal_id         INT NULL,
  title               VARCHAR(255) NOT NULL,
  project_type        ENUM('fixed_price','retainer','milestone_based','hourly') DEFAULT 'fixed_price',
  status              ENUM('Discovery','Planning','In Progress','Review','Completed','On Hold','Cancelled') DEFAULT 'Discovery',
  priority            ENUM('low','medium','high','urgent') DEFAULT 'medium',
  budget              DECIMAL(12,2) CHECK (budget IS NULL OR budget >= 0),
  currency            CHAR(3) DEFAULT 'INR',
  project_manager_id  INT,
  start_date          DATE,
  end_date            DATE,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at          TIMESTAMP NULL,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id),
  FOREIGN KEY (service_category_id) REFERENCES service_categories(id),
  FOREIGN KEY (service_request_id) REFERENCES service_requests(id) ON DELETE SET NULL,
  FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE SET NULL,
  FOREIGN KEY (project_manager_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT chk_project_dates CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date),
  INDEX idx_projects_client (client_id),
  INDEX idx_projects_status (status),
  INDEX idx_projects_pm (project_manager_id, status)
) ENGINE=InnoDB;

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
-- SECTION 10: INVOICING, GST BILLING & PAYMENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS invoices (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  invoice_no      VARCHAR(50) NOT NULL UNIQUE,
  fy_year         VARCHAR(10) NOT NULL,
  project_id      INT,
  service_request_id INT,
  client_id       INT NOT NULL,
  place_of_supply    VARCHAR(100),
  gst_treatment      ENUM('registered','unregistered','sez','export') DEFAULT 'registered',
  reverse_charge     BOOLEAN DEFAULT FALSE,
  subtotal        DECIMAL(12,2) NOT NULL CHECK (subtotal >= 0),
  cgst_rate       DECIMAL(5,2) DEFAULT 0,
  sgst_rate       DECIMAL(5,2) DEFAULT 0,
  igst_rate       DECIMAL(5,2) DEFAULT 0,
  cgst_amount     DECIMAL(12,2) DEFAULT 0,
  sgst_amount     DECIMAL(12,2) DEFAULT 0,
  igst_amount     DECIMAL(12,2) DEFAULT 0,
  total_amount    DECIMAL(12,2) NOT NULL CHECK (total_amount >= 0),
  amount_paid     DECIMAL(12,2) NOT NULL DEFAULT 0,
  currency        CHAR(3) DEFAULT 'INR',
  status          ENUM('draft','sent','paid','partially_paid','overdue','cancelled') DEFAULT 'draft',
  issued_date     DATE,
  due_date        DATE,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at      TIMESTAMP NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  FOREIGN KEY (service_request_id) REFERENCES service_requests(id) ON DELETE SET NULL,
  FOREIGN KEY (client_id) REFERENCES users(id),
  INDEX idx_invoice_status (status),
  INDEX idx_invoice_client (client_id, status),
  INDEX idx_invoice_due (due_date)
) ENGINE=InnoDB;

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
  raw_payload     JSON CHECK (JSON_VALID(raw_payload)),
  gateway_signature_verified BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
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
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
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
  content       JSON NOT NULL CHECK (JSON_VALID(content)),
  sort_order    SMALLINT DEFAULT 0,
  is_active     BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE,
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
-- SECTION 16: MARKETING (newsletter/campaigns)
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
  suggested_team  JSON CHECK (JSON_VALID(suggested_team)),
  model_version   VARCHAR(50),
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL,
  FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE SET NULL
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
  reviewer_id   INT NULL,
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
-- SECTION 19: CONTENT, TEAM, TESTIMONIALS & SYSTEM SETTINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS testimonials (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT,
  project_id    INT,
  internship_id INT,
  name          VARCHAR(255) NOT NULL,
  role          VARCHAR(255),
  company       VARCHAR(255),
  content       TEXT NOT NULL,
  image_url     VARCHAR(255),
  rating        TINYINT DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  status        ENUM('pending','approved','rejected') DEFAULT 'pending',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE SET NULL,
  INDEX idx_testimonials_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS team_members (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT,
  name          VARCHAR(255) NOT NULL,
  role          VARCHAR(255) NOT NULL,
  department    VARCHAR(100),
  bio           TEXT,
  image_url     VARCHAR(255),
  linkedin_url  VARCHAR(255),
  status        ENUM('active','inactive') DEFAULT 'active',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contact_messages (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  subject       VARCHAR(255),
  message       TEXT NOT NULL,
  status        ENUM('unread','read','responded','spam') DEFAULT 'unread',
  ip_address    VARCHAR(45),
  user_agent    VARCHAR(255),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_contact_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contact_config (
  id             INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  email_1        VARCHAR(255),
  email_2        VARCHAR(255),
  phone          VARCHAR(50),
  office_hours   VARCHAR(100),
  address_title  VARCHAR(100),
  address_line1  VARCHAR(255),
  address_line2  VARCHAR(255),
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Business analytics event stream
CREATE TABLE IF NOT EXISTS analytics_events (
  id            BIGINT AUTO_INCREMENT,
  event_type    VARCHAR(100) NOT NULL,
  entity_type   VARCHAR(100),
  entity_id     INT,
  user_id       INT NULL,
  metadata      JSON,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id, created_at),
  INDEX idx_events_type_date (event_type, created_at)
) ENGINE=InnoDB
PARTITION BY RANGE (YEAR(created_at)) (
  PARTITION p2025 VALUES LESS THAN (2026),
  PARTITION p2026 VALUES LESS THAN (2027),
  PARTITION p2027 VALUES LESS THAN (2028),
  PARTITION pmax  VALUES LESS THAN MAXVALUE
);

-- Daily rollup table for Dashboard queries
CREATE TABLE IF NOT EXISTS analytics_daily_summary (
  summary_date    DATE PRIMARY KEY,
  new_leads       INT UNSIGNED DEFAULT 0,
  leads_won       INT UNSIGNED DEFAULT 0,
  revenue_collected DECIMAL(14,2) DEFAULT 0,
  active_projects INT UNSIGNED DEFAULT 0,
  new_applications INT UNSIGNED DEFAULT 0,
  updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 20: SEED DATA
-- ============================================================================

INSERT INTO roles (id, name, description, is_system) VALUES
  (1, 'super_admin', 'Full system access', TRUE),
  (2, 'admin', 'Manages content, projects, invoices', TRUE),
  (3, 'mentor', 'Manages assigned internship batches', TRUE),
  (4, 'student', 'Applies to and enrolls in internships', TRUE),
  (5, 'client', 'Requests services, views projects/invoices', TRUE),
  (6, 'staff', 'Internal employee, assigned to projects', TRUE),
  (7, 'sales', 'Manages leads, proposals, consultations', TRUE)
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO contact_config (id, email_1, email_2, phone, office_hours, address_title, address_line1, address_line2)
VALUES (1, 'contact@edizo.in', 'support@edizo.in', '+91 98765 43210', 'Mon - Sat: 9:00 AM - 6:00 PM', 'Headquarters', 'Edizo Tech Solutions', 'Bengaluru, Karnataka, India')
ON DUPLICATE KEY UPDATE email_1 = VALUES(email_1);

SET FOREIGN_KEY_CHECKS = 1;
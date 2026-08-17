-- ============================================================================
-- EDIZO DB — REDESIGNED SECURE SCHEMA (WITH DPDP & GST COMPLIANCE)
-- Target: MySQL 8.0+ (uses CHECK constraints, REGEXP, JSON, UUID())
-- Charset: utf8mb4 everywhere (emoji/rupee-symbol/Indian-language safe)
-- Engine : InnoDB everywhere (FK + transaction support)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS edizo_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE edizo_db;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- SECTION 1: RBAC (ROLES & PERMISSIONS)
-- ============================================================================

CREATE TABLE IF NOT EXISTS roles (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(50) NOT NULL UNIQUE,   -- super_admin, admin, mentor, student, client, staff
  description   VARCHAR(255),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS permissions (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  code          VARCHAR(100) NOT NULL UNIQUE,  -- e.g. 'internships.manage', 'invoices.view'
  description   VARCHAR(255)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id        INT NOT NULL,
  permission_id  INT NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 2: USERS & AUTH SECURITY
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  uuid             CHAR(36) NOT NULL DEFAULT (UUID()) UNIQUE, -- use in URLs, never expose `id`
  name             VARCHAR(100) NOT NULL,
  email            VARCHAR(255) NOT NULL UNIQUE,
  phone            VARCHAR(20),
  password_hash    VARCHAR(255) NOT NULL,       -- bcrypt/argon2id hash ONLY, never reversible
  role_id          INT NOT NULL DEFAULT 4,      -- FK to roles; seed 4 = 'student'
  status           ENUM('active','inactive','banned','pending') NOT NULL DEFAULT 'pending',
  email_verified_at   TIMESTAMP NULL,
  phone_verified_at   TIMESTAMP NULL,
  failed_login_count  TINYINT UNSIGNED NOT NULL DEFAULT 0,
  locked_until         TIMESTAMP NULL,          -- account lockout after repeated failures
  last_login_at        TIMESTAMP NULL,
  last_login_ip        VARCHAR(45),             -- IPv6-safe length
  mfa_enabled          BOOLEAN NOT NULL DEFAULT FALSE,
  mfa_secret           VARCHAR(255),            -- encrypted at application layer, never plaintext
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at       TIMESTAMP NULL,          -- Soft delete for legal/audit compliance
  FOREIGN KEY (role_id) REFERENCES roles(id),
  INDEX idx_users_email (email),
  INDEX idx_users_role (role_id),
  INDEX idx_users_deleted (deleted_at)
) ENGINE=InnoDB;

-- Refresh / session tokens — never store raw JWTs, store a hash so a DB leak
-- doesn't hand out live sessions.
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  token_hash    CHAR(64) NOT NULL,        -- SHA-256 hex of the token
  device_info   VARCHAR(255),
  ip_address    VARCHAR(45),
  issued_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at    TIMESTAMP NOT NULL,
  revoked_at    TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_token_hash (token_hash),
  INDEX idx_refresh_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  token_hash    CHAR(64) NOT NULL UNIQUE,
  expires_at    TIMESTAMP NOT NULL,
  used_at       TIMESTAMP NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS otp_verifications (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NULL,                 -- nullable: OTP can precede account creation
  target        VARCHAR(255) NOT NULL,    -- email or phone the OTP was sent to
  purpose       ENUM('signup','login','password_reset','phone_verify') NOT NULL,
  otp_hash      CHAR(64) NOT NULL,        -- never store the OTP itself
  attempts      TINYINT UNSIGNED NOT NULL DEFAULT 0,
  max_attempts  TINYINT UNSIGNED NOT NULL DEFAULT 5,
  expires_at    TIMESTAMP NOT NULL,
  verified_at   TIMESTAMP NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_otp_target (target)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS login_attempts (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NULL,
  email_tried   VARCHAR(255),
  ip_address    VARCHAR(45) NOT NULL,
  success       BOOLEAN NOT NULL,
  user_agent    VARCHAR(255),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_login_ip_time (ip_address, created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS audit_logs (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NULL,                 -- NULL = system action
  action        VARCHAR(100) NOT NULL,    -- e.g. 'invoice.create', 'user.role_change'
  entity_type   VARCHAR(100),
  entity_id     INT,
  ip_address    VARCHAR(45),
  metadata      JSON,                     -- before/after diff, extra context
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_audit_entity (entity_type, entity_id)
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 3: DPDP ACT 2023 COMPLIANCE (India Data Protection)
-- ============================================================================

CREATE TABLE IF NOT EXISTS consent_logs (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NULL,
  email         VARCHAR(255),
  consent_type  VARCHAR(100) NOT NULL,   -- e.g. 'terms_and_conditions', 'privacy_policy', 'marketing_emails'
  granted       BOOLEAN NOT NULL DEFAULT TRUE,
  ip_address    VARCHAR(45),
  user_agent    VARCHAR(255),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_consent_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS data_deletion_requests (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  status        ENUM('pending','in_review','fulfilled','rejected') DEFAULT 'pending',
  reason        TEXT,
  requested_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fulfilled_at  TIMESTAMP NULL,
  notes         TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_del_req_status (status)
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 4: FILE UPLOADS MANAGEMENT (Abuse & Storage Tracking)
-- ============================================================================

CREATE TABLE IF NOT EXISTS file_uploads (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  uuid          CHAR(36) NOT NULL DEFAULT (UUID()) UNIQUE,
  user_id       INT NULL,
  filename      VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type     VARCHAR(100) NOT NULL,
  file_size     INT UNSIGNED NOT NULL,
  file_path     VARCHAR(500) NOT NULL,
  ip_address    VARCHAR(45),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at    TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_file_user (user_id)
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 5: COMPANY & CLIENT PROFILES (GSTIN / PAN Validation)
-- ============================================================================

CREATE TABLE IF NOT EXISTS company_profile (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  legal_name       VARCHAR(255) NOT NULL,
  brand_name       VARCHAR(255),
  cin              VARCHAR(21),                 -- Corporate Identification Number
  gstin            VARCHAR(15),                 -- 15-char GSTIN
  pan              VARCHAR(10),                 -- 10-char PAN
  registered_address  VARCHAR(255),
  city             VARCHAR(100),
  state            VARCHAR(100),
  pincode          VARCHAR(10),
  email            VARCHAR(255),
  phone            VARCHAR(20),
  website          VARCHAR(255),
  updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_company_gstin CHECK (gstin IS NULL OR gstin REGEXP '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'),
  CONSTRAINT chk_company_pan CHECK (pan IS NULL OR pan REGEXP '^[A-Z]{5}[0-9]{4}[A-Z]{1}$')
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS company_bank_accounts (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  company_id       INT NOT NULL,
  bank_name        VARCHAR(150) NOT NULL,
  account_holder   VARCHAR(150) NOT NULL,
  account_number_enc  VARBINARY(255) NOT NULL,  -- encrypted at application layer, never plain
  ifsc_code        VARCHAR(11) NOT NULL,
  is_primary       BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (company_id) REFERENCES company_profile(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS client_companies (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  user_id          INT NOT NULL,            -- primary contact / account owner
  company_name     VARCHAR(255) NOT NULL,
  industry         VARCHAR(100),
  gstin            VARCHAR(15),
  pan              VARCHAR(10),
  billing_address  VARCHAR(255),
  city             VARCHAR(100),
  state            VARCHAR(100),
  pincode          VARCHAR(10),
  country          VARCHAR(100) DEFAULT 'India',
  website          VARCHAR(255),
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at       TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_client_gstin CHECK (gstin IS NULL OR gstin REGEXP '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'),
  CONSTRAINT chk_client_pan CHECK (pan IS NULL OR pan REGEXP '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'),
  INDEX idx_client_gstin (gstin)
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 6: SERVICE CATALOG (normalized categories)
-- ============================================================================

CREATE TABLE IF NOT EXISTS service_categories (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL UNIQUE,   -- e.g. 'Web Development', 'AI/ML Solutions'
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
  pricing_tiers     JSON,
  solutions         TEXT,
  technologies      TEXT,
  process           TEXT,
  benefits          TEXT,
  faqs              JSON,
  status            ENUM('active','inactive','archived') DEFAULT 'active',
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at        TIMESTAMP NULL,
  FOREIGN KEY (category_id) REFERENCES service_categories(id),
  INDEX idx_services_category (category_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS portfolio_projects (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  service_id    INT,                        -- which service this showcase belongs to
  title         VARCHAR(255) NOT NULL,
  client        VARCHAR(255),
  category      VARCHAR(255),
  description   TEXT,
  image_url     VARCHAR(255),
  color         VARCHAR(50) DEFAULT 'bg-blue-500',
  status        ENUM('active','inactive') DEFAULT 'active',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at    TIMESTAMP NULL,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
) ENGINE=InnoDB;

SET @exist_p := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'portfolio_projects' AND COLUMN_NAME = 'service_id');
SET @sqlstmt_p := IF(@exist_p = 0, 'ALTER TABLE portfolio_projects ADD COLUMN service_id INT', 'SELECT 1');
PREPARE stmt_p FROM @sqlstmt_p;
EXECUTE stmt_p;
DEALLOCATE PREPARE stmt_p;

CREATE TABLE IF NOT EXISTS service_related_projects (
  service_id            INT NOT NULL,
  portfolio_project_id  INT NOT NULL,
  PRIMARY KEY (service_id, portfolio_project_id),
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  FOREIGN KEY (portfolio_project_id) REFERENCES portfolio_projects(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 7: INTERNSHIP PROGRAM
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
  price             DECIMAL(10,2) DEFAULT 0.00,
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
  user_id       INT NOT NULL UNIQUE,      -- users.role_id must map to 'mentor'
  expertise     VARCHAR(255),
  bio           TEXT,
  linkedin_url  VARCHAR(255),
  status        ENUM('active','inactive') DEFAULT 'active',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS internship_batches (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  internship_id    INT NOT NULL,
  batch_name        VARCHAR(100) NOT NULL,   -- e.g. 'Aug 2026 Batch'
  start_date        DATE NOT NULL,
  end_date          DATE NOT NULL,
  application_deadline  DATE,
  capacity          SMALLINT UNSIGNED NOT NULL DEFAULT 30,
  seats_filled       SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  status             ENUM('upcoming','ongoing','completed','cancelled') DEFAULT 'upcoming',
  FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE,
  CONSTRAINT chk_seats CHECK (seats_filled <= capacity),
  INDEX idx_batch_internship (internship_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS internship_batch_mentors (
  batch_id      INT NOT NULL,
  mentor_id     INT NOT NULL,
  PRIMARY KEY (batch_id, mentor_id),
  FOREIGN KEY (batch_id) REFERENCES internship_batches(id) ON DELETE CASCADE,
  FOREIGN KEY (mentor_id) REFERENCES mentors(id) ON DELETE CASCADE
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
  INDEX idx_app_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS internship_enrollments (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  application_id  INT NOT NULL UNIQUE,
  user_id         INT NOT NULL,
  batch_id        INT NOT NULL,
  progress_percent  TINYINT UNSIGNED DEFAULT 0 CHECK (progress_percent <= 100),
  status          ENUM('ongoing','completed','dropped') DEFAULT 'ongoing',
  started_at      DATE,
  completed_at    DATE,
  FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (batch_id) REFERENCES internship_batches(id) ON DELETE CASCADE,
  INDEX idx_enroll_batch (batch_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS certificates (
  id                 INT AUTO_INCREMENT PRIMARY KEY,
  enrollment_id      INT NOT NULL UNIQUE,
  certificate_no     VARCHAR(50) NOT NULL UNIQUE,
  verification_code  CHAR(12) NOT NULL UNIQUE,   -- public-facing lookup code
  file_url           VARCHAR(255),
  issued_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (enrollment_id) REFERENCES internship_enrollments(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 8: SERVICE REQUESTS & PROJECTS
-- ============================================================================

-- Projects (Defined early so service_requests can reference converted_project_id)
CREATE TABLE IF NOT EXISTS projects (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  uuid                CHAR(36) NOT NULL DEFAULT (UUID()) UNIQUE,
  client_id           INT NOT NULL,
  client_company_id   INT,
  service_id          INT NOT NULL,
  service_category_id INT NOT NULL,
  service_request_id  INT,
  title               VARCHAR(255) NOT NULL,
  project_type        ENUM('fixed_price','retainer','milestone_based','hourly') DEFAULT 'fixed_price',
  status              ENUM('Discovery','Planning','In Progress','Review','Completed','On Hold','Cancelled') DEFAULT 'Discovery',
  priority            ENUM('low','medium','high','urgent') DEFAULT 'medium',
  budget              DECIMAL(12,2),
  currency            CHAR(3) DEFAULT 'INR',
  project_manager_id  INT,
  start_date          DATE,
  end_date            DATE,
  actual_end_date     DATE,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at          TIMESTAMP NULL,
  FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (client_company_id) REFERENCES client_companies(id) ON DELETE SET NULL,
  FOREIGN KEY (service_id) REFERENCES services(id),
  FOREIGN KEY (service_category_id) REFERENCES service_categories(id),
  FOREIGN KEY (project_manager_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_projects_category (service_category_id),
  INDEX idx_projects_client (client_id),
  INDEX idx_projects_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS service_requests (
  id                    INT AUTO_INCREMENT PRIMARY KEY,
  user_id               INT,
  client_company_id     INT,
  service_id            INT NOT NULL,
  project_details       TEXT,
  requirements          TEXT,
  budget                VARCHAR(100),
  status                ENUM('pending','reviewing','accepted','rejected','converted') DEFAULT 'pending',
  assigned_to           INT,
  converted_project_id  INT NULL,             -- Properly linked FK to projects table
  ip_address            VARCHAR(45),
  user_agent            VARCHAR(255),
  created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (client_company_id) REFERENCES client_companies(id) ON DELETE SET NULL,
  FOREIGN KEY (service_id) REFERENCES services(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (converted_project_id) REFERENCES projects(id) ON DELETE SET NULL,
  INDEX idx_sr_status (status)
) ENGINE=InnoDB;

-- Add self-referencing FK back from projects to service_requests after table creation
SET @exist := (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'projects' AND COLUMN_NAME = 'service_request_id');
SET @sqlstmt := IF(@exist = 0, 'ALTER TABLE projects ADD COLUMN service_request_id INT', 'SELECT 1');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @fk_exist := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS WHERE CONSTRAINT_SCHEMA = DATABASE() AND TABLE_NAME = 'projects' AND CONSTRAINT_NAME = 'fk_projects_service_request');
SET @fk_sql := IF(@fk_exist = 0, 'ALTER TABLE projects ADD CONSTRAINT fk_projects_service_request FOREIGN KEY (service_request_id) REFERENCES service_requests(id) ON DELETE SET NULL', 'SELECT 1');
PREPARE stmt2 FROM @fk_sql;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;

CREATE TABLE IF NOT EXISTS project_milestones (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  project_id    INT NOT NULL,
  title         VARCHAR(255) NOT NULL,
  description   TEXT,
  due_date      DATE,
  amount        DECIMAL(12,2),
  status        ENUM('pending','in_progress','completed','delayed') DEFAULT 'pending',
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  INDEX idx_milestone_project (project_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS project_team_members (
  project_id    INT NOT NULL,
  user_id       INT NOT NULL,
  role_in_project VARCHAR(100),
  assigned_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (project_id, user_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS project_deliverables (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  project_id    INT NOT NULL,
  milestone_id  INT,
  file_url      VARCHAR(255) NOT NULL,
  version       VARCHAR(20) DEFAULT 'v1',
  description   VARCHAR(255),
  uploaded_by   INT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (milestone_id) REFERENCES project_milestones(id) ON DELETE SET NULL,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS project_updates (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  project_id    INT NOT NULL,
  user_id       INT,
  comment       TEXT NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 9: BILLING — GST-COMPLIANT INVOICING & PAYMENTS (FY Support)
-- ============================================================================

CREATE TABLE IF NOT EXISTS invoices (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  invoice_no      VARCHAR(50) NOT NULL UNIQUE,     -- e.g. EDZ/2026-27/0001
  fy_year         VARCHAR(10) NOT NULL,            -- e.g. '2026-27' (Indian Financial Year tracking)
  project_id      INT,
  service_request_id INT,
  client_id       INT NOT NULL,
  client_company_id  INT,
  place_of_supply    VARCHAR(100),                  -- state code, decides CGST+SGST vs IGST
  gst_treatment      ENUM('registered','unregistered','sez','export') DEFAULT 'registered',
  reverse_charge     BOOLEAN DEFAULT FALSE,
  subtotal        DECIMAL(12,2) NOT NULL,
  cgst_rate       DECIMAL(5,2) DEFAULT 0,
  sgst_rate       DECIMAL(5,2) DEFAULT 0,
  igst_rate       DECIMAL(5,2) DEFAULT 0,
  cgst_amount     DECIMAL(12,2) DEFAULT 0,
  sgst_amount     DECIMAL(12,2) DEFAULT 0,
  igst_amount     DECIMAL(12,2) DEFAULT 0,
  total_amount    DECIMAL(12,2) NOT NULL,
  currency        CHAR(3) DEFAULT 'INR',
  status          ENUM('draft','sent','paid','partially_paid','overdue','cancelled') DEFAULT 'draft',
  issued_date     DATE,
  due_date        DATE,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at      TIMESTAMP NULL,                -- Mandatory retention (8 years), soft delete only
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  FOREIGN KEY (service_request_id) REFERENCES service_requests(id) ON DELETE SET NULL,
  FOREIGN KEY (client_id) REFERENCES users(id),
  FOREIGN KEY (client_company_id) REFERENCES client_companies(id) ON DELETE SET NULL,
  INDEX idx_invoice_status (status),
  INDEX idx_invoice_fy (fy_year),
  INDEX idx_invoice_client (client_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS invoice_items (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  invoice_id    INT NOT NULL,
  description   VARCHAR(255) NOT NULL,
  hsn_sac_code  VARCHAR(10),                -- HSN/SAC code, required on Indian GST invoices
  quantity      DECIMAL(10,2) DEFAULT 1,
  unit_price    DECIMAL(12,2) NOT NULL,
  amount        DECIMAL(12,2) NOT NULL,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payments (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  invoice_id        INT,
  user_id           INT NOT NULL,
  amount            DECIMAL(12,2) NOT NULL,
  currency          CHAR(3) DEFAULT 'INR',
  payment_method    ENUM('card','netbanking','upi','wallet','bank_transfer','cash') NOT NULL,
  gateway           VARCHAR(50),
  gateway_txn_id    VARCHAR(150),
  status            ENUM('initiated','success','failed','refunded') DEFAULT 'initiated',
  paid_at           TIMESTAMP NULL,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at        TIMESTAMP NULL,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY uq_gateway_txn (gateway, gateway_txn_id),
  INDEX idx_payments_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS coupons (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  code            VARCHAR(50) NOT NULL UNIQUE,
  discount_type   ENUM('percentage','flat') NOT NULL,
  discount_value  DECIMAL(10,2) NOT NULL,
  applicable_to   ENUM('internship','service','all') DEFAULT 'all',
  valid_from      DATE,
  valid_to        DATE,
  usage_limit     INT UNSIGNED,
  used_count      INT UNSIGNED DEFAULT 0,
  status          ENUM('active','inactive') DEFAULT 'active'
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 10: JOBS BOARD
-- ============================================================================

CREATE TABLE IF NOT EXISTS jobs (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  uuid           CHAR(36) NOT NULL DEFAULT (UUID()) UNIQUE,
  title          VARCHAR(255) NOT NULL,
  department     VARCHAR(100),
  company        VARCHAR(100) NOT NULL,
  location       VARCHAR(100),
  type           ENUM('Full-time','Part-time','Contract','Internship') NOT NULL,
  experience_level ENUM('entry','mid','senior','lead') DEFAULT 'entry',
  salary         VARCHAR(100),
  description    TEXT,
  requirements   TEXT,
  status         ENUM('active','closed','draft') DEFAULT 'active',
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS job_applications (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  user_id        INT,
  job_id         INT NOT NULL,
  first_name     VARCHAR(100) NOT NULL,
  last_name      VARCHAR(100) NOT NULL,
  email          VARCHAR(255) NOT NULL,
  resume_url     VARCHAR(255),
  cover_letter   TEXT,
  status         ENUM('pending','shortlisted','interviewing','rejected','hired') DEFAULT 'pending',
  ip_address     VARCHAR(45),
  user_agent     VARCHAR(255),
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 11: CONTENT & CONTACT (Singleton Guard on Config)
-- ============================================================================

CREATE TABLE IF NOT EXISTS blog_categories (
  id      INT AUTO_INCREMENT PRIMARY KEY,
  name    VARCHAR(100) NOT NULL UNIQUE,
  slug    VARCHAR(120) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS blog_posts (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  author_id         INT,
  category_id       INT,
  title             VARCHAR(255) NOT NULL,
  slug              VARCHAR(255) NOT NULL UNIQUE,
  content           MEDIUMTEXT,
  excerpt           TEXT,
  featured_image    VARCHAR(255),
  status            ENUM('draft','published','archived') DEFAULT 'draft',
  meta_title        VARCHAR(255),
  meta_description  TEXT,
  published_at      DATETIME NULL,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE SET NULL,
  INDEX idx_blog_status (status)
) ENGINE=InnoDB;

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
  FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE SET NULL
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
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Singleton guard enforcement: id MUST equal 1
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

-- ============================================================================
-- SECTION 12: NOTIFICATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS notifications (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  title         VARCHAR(255) NOT NULL,
  message       TEXT,
  type          VARCHAR(50),
  is_read       BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notif_user_read (user_id, is_read)
) ENGINE=InnoDB;

-- ============================================================================
-- SECTION 13: SEED DATA (roles + singleton contact config)
-- ============================================================================

INSERT INTO roles (id, name, description) VALUES
  (1, 'super_admin', 'Full system access'),
  (2, 'admin', 'Manages content, projects, invoices'),
  (3, 'mentor', 'Manages assigned internship batches'),
  (4, 'student', 'Applies to and enrolls in internships'),
  (5, 'client', 'Requests services, views projects/invoices'),
  (6, 'staff', 'Internal employee, assigned to projects')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO contact_config (id, email_1, email_2, phone, office_hours, address_title, address_line1, address_line2)
VALUES (1, 'contact@edizo.in', 'support@edizo.in', '+91 98765 43210', 'Mon - Sat: 9:00 AM - 6:00 PM', 'Headquarters', 'Edizo Tech Solutions', 'Bengaluru, Karnataka, India')
ON DUPLICATE KEY UPDATE email_1 = VALUES(email_1);
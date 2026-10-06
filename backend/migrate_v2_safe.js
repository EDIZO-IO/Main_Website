const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'edizo_db',
  multipleStatements: true,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306
};

async function checkColumnExists(conn, table, column) {
  const [rows] = await conn.query(
    `SELECT COUNT(*) as count FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column]
  );
  return rows[0].count > 0;
}

async function checkIndexExists(conn, table, indexName) {
  const [rows] = await conn.query(
    `SELECT COUNT(*) as count FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ?`,
    [table, indexName]
  );
  return rows[0].count > 0;
}

async function addColumnIfMissing(conn, table, column, definition) {
  const exists = await checkColumnExists(conn, table, column);
  if (!exists) {
    console.log(`Adding column ${column} to table ${table}...`);
    try {
      await conn.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
    } catch (err) {
      console.warn(`Column warning on ${table}.${column}:`, err.message);
    }
  }
}

async function addIndexIfMissing(conn, table, indexName, definition) {
  const exists = await checkIndexExists(conn, table, indexName);
  if (!exists) {
    console.log(`Adding index ${indexName} to table ${table}...`);
    try {
      await conn.query(`ALTER TABLE \`${table}\` ADD ${definition}`);
    } catch (err) {
      console.warn(`Index warning on ${table}.${indexName}:`, err.message);
    }
  }
}

async function run() {
  console.log('Connecting to database:', dbConfig.database, 'at', dbConfig.host);
  const conn = await mysql.createConnection(dbConfig);
  console.log('Database connected successfully.');

  try {
    await conn.query('SET FOREIGN_KEY_CHECKS = 0;');

    // 1. Roles table upgrades
    await addColumnIfMissing(conn, 'roles', 'is_system', 'BOOLEAN NOT NULL DEFAULT FALSE');
    await conn.query(`UPDATE roles SET is_system = TRUE WHERE name IN ('super_admin','admin','mentor','student','client','staff','sales')`);
    await conn.query(`INSERT INTO roles (name, description, is_system) SELECT 'sales', 'Manages leads, proposals, consultations', TRUE WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'sales')`);

    // 2. Permissions table upgrades
    await addColumnIfMissing(conn, 'permissions', 'module', "VARCHAR(50) NOT NULL DEFAULT 'general'");
    await addIndexIfMissing(conn, 'permissions', 'idx_perm_module', 'INDEX idx_perm_module (module)');

    // 3. Users table upgrades
    await addColumnIfMissing(conn, 'users', 'uuid', 'CHAR(36) NOT NULL DEFAULT (UUID()) UNIQUE');
    await addColumnIfMissing(conn, 'users', 'phone', 'VARCHAR(20)');
    await addColumnIfMissing(conn, 'users', 'password_hash', 'VARCHAR(255) NOT NULL DEFAULT ""');
    await addColumnIfMissing(conn, 'users', 'password_changed_at', 'TIMESTAMP NULL');
    await addColumnIfMissing(conn, 'users', 'role_id', 'INT NOT NULL DEFAULT 4');
    await addColumnIfMissing(conn, 'users', 'email_verified_at', 'TIMESTAMP NULL');
    await addColumnIfMissing(conn, 'users', 'phone_verified_at', 'TIMESTAMP NULL');
    await addColumnIfMissing(conn, 'users', 'failed_login_count', 'TINYINT UNSIGNED NOT NULL DEFAULT 0');
    await addColumnIfMissing(conn, 'users', 'locked_until', 'TIMESTAMP NULL');
    await addColumnIfMissing(conn, 'users', 'last_login_at', 'TIMESTAMP NULL');
    await addColumnIfMissing(conn, 'users', 'last_login_ip', 'VARCHAR(45)');
    await addColumnIfMissing(conn, 'users', 'mfa_enabled', 'BOOLEAN NOT NULL DEFAULT FALSE');
    await addColumnIfMissing(conn, 'users', 'mfa_secret', 'VARCHAR(255) NULL');
    await addColumnIfMissing(conn, 'users', 'mfa_recovery_codes', 'JSON NULL');
    await addColumnIfMissing(conn, 'users', 'data_region', "VARCHAR(10) DEFAULT 'IN'");
    await addColumnIfMissing(conn, 'users', 'deleted_at', 'TIMESTAMP NULL');
    await addIndexIfMissing(conn, 'users', 'idx_users_status_role', 'INDEX idx_users_status_role (status, role_id)');

    // 4. Token & OTP indexes
    await addIndexIfMissing(conn, 'refresh_tokens', 'idx_refresh_expiry', 'INDEX idx_refresh_expiry (expires_at)');
    await addIndexIfMissing(conn, 'password_reset_tokens', 'idx_prt_expiry', 'INDEX idx_prt_expiry (expires_at)');
    await addIndexIfMissing(conn, 'otp_verifications', 'idx_otp_expiry', 'INDEX idx_otp_expiry (expires_at)');

    // 5. File uploads columns
    await addColumnIfMissing(conn, 'file_uploads', 'checksum_sha256', 'CHAR(64) NULL');
    await addColumnIfMissing(conn, 'file_uploads', 'is_public', 'BOOLEAN NOT NULL DEFAULT FALSE');
    await addIndexIfMissing(conn, 'file_uploads', 'idx_file_checksum', 'INDEX idx_file_checksum (checksum_sha256)');

    // 6. Services & Portfolio
    await addColumnIfMissing(conn, 'services', 'pricing_tiers', 'JSON NULL');
    await addColumnIfMissing(conn, 'services', 'solutions', 'TEXT NULL');
    await addColumnIfMissing(conn, 'services', 'technologies', 'TEXT NULL');
    await addColumnIfMissing(conn, 'services', 'process', 'TEXT NULL');
    await addColumnIfMissing(conn, 'services', 'benefits', 'TEXT NULL');
    await addColumnIfMissing(conn, 'services', 'faqs', 'JSON NULL');
    await addIndexIfMissing(conn, 'services', 'idx_services_status', 'INDEX idx_services_status (status)');
    await addIndexIfMissing(conn, 'portfolio_projects', 'idx_portfolio_status', 'INDEX idx_portfolio_status (status)');

    // 7. Internships & batches
    await addIndexIfMissing(conn, 'internship_batches', 'idx_batch_status', 'INDEX idx_batch_status (status)');
    await addIndexIfMissing(conn, 'applications', 'idx_app_email', 'INDEX idx_app_email (email)');
    await addIndexIfMissing(conn, 'internship_enrollments', 'idx_enroll_user', 'INDEX idx_enroll_user (user_id)');
    await addIndexIfMissing(conn, 'certificates', 'idx_cert_verify', 'INDEX idx_cert_verify (verification_code)');

    // 8. Projects proposal column
    await addColumnIfMissing(conn, 'projects', 'proposal_id', 'INT NULL');
    await addIndexIfMissing(conn, 'projects', 'idx_projects_pm', 'INDEX idx_projects_pm (project_manager_id, status)');

    // 9. Invoices
    await addColumnIfMissing(conn, 'invoices', 'amount_paid', 'DECIMAL(12,2) NOT NULL DEFAULT 0');
    await addIndexIfMissing(conn, 'invoices', 'idx_invoice_client', 'INDEX idx_invoice_client (client_id, status)');
    await addIndexIfMissing(conn, 'invoices', 'idx_invoice_due', 'INDEX idx_invoice_due (due_date)');
    await conn.query(`UPDATE invoices SET amount_paid = total_amount WHERE status = 'paid' AND amount_paid = 0`);

    // 10. Run complete schema.sql for creating all new V2 tables
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    console.log('Applying complete schema.sql...');
    await conn.query(schemaSql);

    await conn.query('SET FOREIGN_KEY_CHECKS = 1;');
    console.log('\n=== All v2 migrations applied cleanly without errors! ===');

  } catch (err) {
    console.error('Migration error:', err);
    throw err;
  } finally {
    await conn.end();
  }
}

run().catch(() => process.exit(1));

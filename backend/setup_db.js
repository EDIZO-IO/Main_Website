const pool = require('./db');

async function setupDb() {
  try {
    console.log("Setting up database for Edizo...");

    // Create projects table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT NOT NULL,
        service_id VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'Discovery',
        start_date DATE,
        end_date DATE,
        FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log("Projects table created/verified.");

    // Update internships table to match PRD if missing columns
    // PRD fields: title, company, duration, mode, description, benefits, status
    // Missing in old schema: status, duration, benefits
    try { await pool.query("ALTER TABLE internships ADD COLUMN status VARCHAR(50) DEFAULT 'active'"); } catch (e) {}
    try { await pool.query("ALTER TABLE internships ADD COLUMN duration VARCHAR(100)"); } catch (e) {}
    try { await pool.query("ALTER TABLE internships ADD COLUMN benefits TEXT"); } catch (e) {}
    try { await pool.query("ALTER TABLE internships ADD COLUMN syllabus TEXT"); } catch (e) {}
    try { await pool.query("ALTER TABLE internships ADD COLUMN eligibility TEXT"); } catch (e) {}
    console.log("Internships table updated.");

    // Services table PRD fields: name, category, description, features, price, status
    try { await pool.query("ALTER TABLE services ADD COLUMN features TEXT"); } catch (e) {}
    try { await pool.query("ALTER TABLE services ADD COLUMN price VARCHAR(100)"); } catch (e) {}
    try { await pool.query("ALTER TABLE services ADD COLUMN status VARCHAR(50) DEFAULT 'active'"); } catch (e) {}
    try { await pool.query("ALTER TABLE services ADD COLUMN category VARCHAR(100)"); } catch (e) {}
    console.log("Services table updated.");

    // Users table PRD fields: phone, status
    try { await pool.query("ALTER TABLE users ADD COLUMN phone VARCHAR(20)"); } catch (e) {}
    try { await pool.query("ALTER TABLE users ADD COLUMN status VARCHAR(50) DEFAULT 'active'"); } catch (e) {}
    console.log("Users table updated.");

    // Applications table PRD fields: resume
    try { await pool.query("ALTER TABLE applications ADD COLUMN resume VARCHAR(255)"); } catch (e) {}
    console.log("Applications table updated.");

    console.log("Database update complete.");
    process.exit(0);
  } catch (error) {
    console.error("Error setting up DB:", error);
    process.exit(1);
  }
}

setupDb();

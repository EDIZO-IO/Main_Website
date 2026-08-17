const db = require('../db');

const migrate = async () => {
  const connection = await db.getConnection();
  try {
    await connection.query('START TRANSACTION');

    // 1. Create blog_posts table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        content TEXT,
        excerpt TEXT,
        featured_image VARCHAR(255),
        category VARCHAR(100),
        status VARCHAR(50) DEFAULT 'draft',
        meta_title VARCHAR(255),
        meta_description TEXT,
        published_at DATETIME NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Create testimonials table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255),
        company VARCHAR(255),
        content TEXT NOT NULL,
        image_url VARCHAR(255),
        rating INT DEFAULT 5,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Create team_members table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS team_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        bio TEXT,
        image_url VARCHAR(255),
        linkedin_url VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 4. Update services table
    // Check if icon column exists, if not add it
    const [servicesCols] = await connection.query("SHOW COLUMNS FROM services LIKE 'icon'");
    if (servicesCols.length === 0) {
      await connection.query("ALTER TABLE services ADD COLUMN icon VARCHAR(255)");
    }
    const [servicesPricingCols] = await connection.query("SHOW COLUMNS FROM services LIKE 'pricing_tiers'");
    if (servicesPricingCols.length === 0) {
      await connection.query("ALTER TABLE services ADD COLUMN pricing_tiers TEXT");
    }

    // 5. Update internships table
    const [internshipsSkillCols] = await connection.query("SHOW COLUMNS FROM internships LIKE 'skill_level'");
    if (internshipsSkillCols.length === 0) {
      await connection.query("ALTER TABLE internships ADD COLUMN skill_level VARCHAR(100) DEFAULT 'beginner'");
    }

    await connection.query('COMMIT');
    console.log('Migration 03_admin_overhaul completed successfully.');
  } catch (error) {
    await connection.query('ROLLBACK');
    console.error('Migration failed:', error);
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = migrate;

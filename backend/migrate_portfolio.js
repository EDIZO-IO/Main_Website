const db = require('./db');

async function migrate() {
  try {
    console.log("Creating portfolio_projects table...");
    await db.query(`
      CREATE TABLE IF NOT EXISTS portfolio_projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        client VARCHAR(255),
        category VARCHAR(255),
        description TEXT,
        image_url VARCHAR(255),
        color VARCHAR(50) DEFAULT 'bg-blue-500',
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Seed some data
    const [rows] = await db.query('SELECT COUNT(*) as cnt FROM portfolio_projects');
    if (rows[0].cnt === 0) {
      await db.query(`
        INSERT INTO portfolio_projects (title, client, category, description, color) VALUES 
        ('Project 1 — Brand Identity & Website', '[Client Name]', 'Graphic Design + Web Development', 'Complete rebrand and responsive website launch.', 'bg-blue-500'),
        ('Project 2 — E-commerce Store Development', '[Client Name]', 'Website + SEO', 'High-conversion online store with optimized search rankings.', 'bg-emerald-500'),
        ('Project 3 — Mobile App', '[Client Name]', 'App Development + API Integration', 'Feature-rich mobile application with seamless backend integration.', 'bg-orange')
      `);
    }

    console.log("Migration successful!");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();

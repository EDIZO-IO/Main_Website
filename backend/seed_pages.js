const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedPages() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    // Insert Home Page
    const [pageResult] = await connection.query(
      'INSERT IGNORE INTO pages (slug, title, seo_title, seo_description) VALUES (?, ?, ?, ?)',
      ['home', 'Home Page', 'EDIZO - Top IT Training & Services', 'Professional IT Services and Training in India']
    );

    let pageId = pageResult.insertId;
    if (!pageId) {
      const [rows] = await connection.query('SELECT id FROM pages WHERE slug = "home"');
      pageId = rows[0].id;
    }

    // Insert Hero Section
    const heroContent = {
      title: "Building the Next Generation of Tech Leaders",
      subtitle: "Empowering students and businesses with cutting-edge IT services and intensive training programs.",
      ctaPrimary: "Explore Internships",
      ctaSecondary: "Our Services"
    };

    await connection.query(
      'INSERT IGNORE INTO page_sections (page_id, section_key, content, sort_order) VALUES (?, ?, ?, ?)',
      [pageId, 'hero', JSON.stringify(heroContent), 1]
    );

    // Insert About Page
    const [aboutPageResult] = await connection.query(
      'INSERT IGNORE INTO pages (slug, title, seo_title, seo_description) VALUES (?, ?, ?, ?)',
      ['about', 'About Us', 'About EDIZO - Our Story', 'Learn about EDIZO, our mission, and our team.']
    );

    let aboutPageId = aboutPageResult.insertId;
    if (!aboutPageId) {
      const [rows] = await connection.query('SELECT id FROM pages WHERE slug = "about"');
      aboutPageId = rows[0].id;
    }

    const aboutHeroContent = {
      title: "Empowering the Next Generation of Tech Leaders",
      subtitle: "EDIZO was founded with a singular vision: to bridge the massive gap between academic learning and industry expectations. We are a collective of senior engineers, product designers, and growth experts dedicated to building robust digital solutions and training the developers of tomorrow."
    };

    await connection.query(
      'INSERT IGNORE INTO page_sections (page_id, section_key, content, sort_order) VALUES (?, ?, ?, ?)',
      [aboutPageId, 'hero', JSON.stringify(aboutHeroContent), 1]
    );

    console.log('Seed completed.');
  } catch (err) {
    console.error(err);
  } finally {
    await connection.end();
  }
}

seedPages();

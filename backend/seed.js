const db = require('./db');

const seed = async () => {
  try {
    // Seed Service Categories if missing
    await db.query(`
      INSERT INTO service_categories (id, name, slug, description) VALUES
      (1, 'Web Development', 'web-development', 'Custom websites and web applications'),
      (2, 'App Development', 'app-development', 'Mobile applications for iOS and Android'),
      (3, 'Graphic Design', 'graphic-design', 'Brand identity, UI/UX, and graphic design'),
      (4, 'SEO & Digital Marketing', 'seo-digital-marketing', 'Search engine optimization and growth marketing'),
      (5, 'Video Editing', 'video-editing', 'Professional video post-production')
      ON DUPLICATE KEY UPDATE name = VALUES(name);
    `);

    // Seed Internship Categories if missing
    await db.query(`
      INSERT INTO internship_categories (id, name, slug, description) VALUES
      (1, 'Development', 'development', 'Software & Web engineering programs'),
      (2, 'Design', 'design', 'UI/UX & Graphic design programs'),
      (3, 'Marketing', 'marketing', 'Digital marketing & SEO programs')
      ON DUPLICATE KEY UPDATE name = VALUES(name);
    `);

    // Seed Testimonials if empty
    const [testRows] = await db.query('SELECT COUNT(*) as count FROM testimonials');
    if (testRows[0].count === 0) {
      await db.query(`
        INSERT INTO testimonials (name, role, company, content, image_url, status) VALUES 
        ('John Doe', 'CEO', 'TechCorp', 'Incredible work by Edizo! They built our product efficiently.', '', 'approved'),
        ('Jane Smith', 'CTO', 'Innovate', 'The team delivered our product flawlessly with an amazing UI.', '', 'approved')
      `);
    }
    
    console.log('Seeded database successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    process.exit(0);
  }
};

seed();

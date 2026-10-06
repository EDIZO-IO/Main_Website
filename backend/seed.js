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

    console.log('Database base categories verified successfully');
  } catch (error) {
    console.error('Seeding check failed:', error);
  } finally {
    process.exit(0);
  }
};

seed();

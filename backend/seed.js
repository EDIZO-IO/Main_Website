const db = require('./db');

const seed = async () => {
  try {
    await db.query(`
      INSERT INTO portfolio_projects (title, client, category, description, image_url, color, status) VALUES 
      ('EduPortal', 'Edizo Academy', 'Education Platform', 'Next.js / Node', '', 'bg-[#333333]', 'active'),
      ('MarketPro', 'AgriTech', 'E-Commerce App', 'React / Node', '', 'bg-[#0B132B]', 'active'),
      ('HealthSync', 'MediCare Inc', 'Healthcare SaaS', 'React / AWS', '', 'bg-[#1C2541]', 'active')
    `);
    
    await db.query(`
      INSERT INTO testimonials (name, role, company, content, image_url, status) VALUES 
      ('John Doe', 'CEO', 'TechCorp', 'Incredible work by Edizo! They built our product efficiently.', '', 'active'),
      ('Jane Smith', 'CTO', 'Innovate', 'The team delivered our product flawlessly with an amazing UI.', '', 'active')
    `);
    
    console.log('Seeded database successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    process.exit(0);
  }
};

seed();

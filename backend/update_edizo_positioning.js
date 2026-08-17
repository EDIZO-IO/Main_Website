const mysql = require('mysql2/promise');
require('dotenv').config();

async function updatePositioning() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log("Updating services...");
    // Clear old services
    await connection.query('DELETE FROM services');
    
    // Web Development, Mobile App Development, SaaS & Custom Software, AI & Automation, UI/UX Design, Digital Solutions
    const newServices = [
      ['Web Development', 'Responsive, fast, and scalable web applications.', '["Custom Web Apps","E-commerce Platforms","Landing Pages","CMS Integration","Web Portals"]', 'Development'],
      ['Mobile App Development', 'Native and cross-platform mobile experiences.', '["iOS Development","Android Development","React Native / Flutter","App Store Deployment","Mobile UI/UX"]', 'Development'],
      ['SaaS & Custom Software', 'Tailor-made software solutions for your business.', '["SaaS Platform Development","Enterprise Software","CRM & ERP Systems","Cloud Architecture","Legacy Modernization"]', 'Development'],
      ['AI & Automation', 'Intelligent solutions to streamline operations.', '["AI Integration","Chatbots & Virtual Assistants","Workflow Automation","Data Processing","Machine Learning"]', 'Technology'],
      ['UI/UX Design', 'Intuitive and engaging user interfaces.', '["Wireframing & Prototyping","User Research","Visual Design","Interaction Design","Usability Testing"]', 'Design'],
      ['Digital Solutions', 'End-to-end digital transformation.', '["Digital Strategy","Technology Consulting","System Integration","Cloud Migration","Performance Optimization"]', 'Consulting']
    ];

    for (const s of newServices) {
      await connection.query(
        'INSERT INTO services (title, description, features, category, price) VALUES (?, ?, ?, ?, "Custom")',
        [s[0], s[1], s[2], s[3]]
      );
    }
    console.log("Services updated successfully.");

    console.log("Updating About page content...");
    const [aboutRows] = await connection.query('SELECT id FROM pages WHERE slug = "about"');
    if (aboutRows.length > 0) {
      const aboutId = aboutRows[0].id;
      
      const newHero = {
        title: "Design. Develop. Learn.",
        subtitle: "EDIZO is a software development and technology services company. We design to understand problems, develop to turn requirements into reliable software, and continuously learn to improve through technology and real-world experience."
      };
      
      await connection.query(
        'UPDATE page_sections SET content = ? WHERE page_id = ? AND section_key = "hero"',
        [JSON.stringify(newHero), aboutId]
      );
      
      const newStory = [
        "EDIZO was founded with a simple goal — to make high-quality design and development services accessible to ambitious businesses.",
        "What started as a small creative team has grown into a multi-service technology partner that helps startups, small businesses, and enterprises build meaningful digital solutions.",
        "Alongside client projects, EDIZO is passionate about nurturing new talent through structured internship programs that give students real-world, industry-ready experience."
      ];
      
      await connection.query(
        'UPDATE page_sections SET content = ? WHERE page_id = ? AND section_key = "story"',
        [JSON.stringify(newStory), aboutId]
      );
      
      const newMission = {
        mission: "To empower businesses with creative, technology-driven solutions that are scalable and reliable — while building a skilled talent pipeline through hands-on internships.",
        vision: "To become a trusted global technology partner known for designing, developing, and delivering excellence, while creating opportunities for the next generation of engineers and designers."
      };
      
      await connection.query(
        'UPDATE page_sections SET content = ? WHERE page_id = ? AND section_key = "storyMission"',
        [JSON.stringify(newMission), aboutId]
      );
      
      console.log("About page content updated.");
    }

    console.log("Positioning update complete.");
  } catch (err) {
    console.error(err);
  } finally {
    await connection.end();
  }
}

updatePositioning();

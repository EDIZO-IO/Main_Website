const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateAboutContact() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log("Updating About page content...");
    const [aboutRows] = await connection.query('SELECT id FROM pages WHERE slug = "about"');
    if (aboutRows.length > 0) {
      const aboutId = aboutRows[0].id;

      // Values
      const values = [
        { icon: "Lightbulb", title: "Creativity", desc: "We think differently to deliver unique solutions." },
        { icon: "Target", title: "Quality", desc: "We don't compromise on the standard of our work." },
        { icon: "Shield", title: "Integrity", desc: "Transparent communication and honest pricing." },
        { icon: "Users", title: "Growth", desc: "We grow with our clients and our interns." },
        { icon: "Users", title: "Collaboration", desc: "Every project is a partnership." }
      ];

      // Differentiators
      const differentiators = [
        "All services under one roof — no need for multiple vendors",
        "Combination of creative design + technical development + marketing",
        "Personal attention to every project, regardless of size",
        "Strong focus on mentoring interns into industry-ready professionals"
      ];

      // Story
      const story = [
        "EDIZO was founded with a simple goal — to make high-quality design and development services accessible to ambitious businesses.",
        "What started as a small creative team has grown into a multi-service technology partner that helps startups, small businesses, and enterprises build meaningful digital solutions.",
        "Alongside client projects, EDIZO is passionate about nurturing new talent through structured internship programs that give students real-world, industry-ready experience."
      ];

      // Story Mission
      const storyMission = {
        mission: "To empower businesses with creative, technology-driven solutions that are scalable and reliable — while building a skilled talent pipeline through hands-on internships.",
        vision: "To become a trusted global technology partner known for designing, developing, and delivering excellence, while creating opportunities for the next generation of engineers and designers."
      };

      // CTA
      const cta = {
        title: "Ready to start your journey?",
        subtitle: "Join the thousands of developers already leveling up their careers with Edizo.",
        btnPrimary: "Get Started Now",
        btnSecondary: "Browse Positions"
      };

      const sections = {
        values,
        differentiators,
        story,
        storyMission,
        cta
      };

      for (const [key, content] of Object.entries(sections)) {
        const [existing] = await connection.query('SELECT id FROM page_sections WHERE page_id = ? AND section_key = ?', [aboutId, key]);
        if (existing.length > 0) {
          await connection.query('UPDATE page_sections SET content = ? WHERE page_id = ? AND section_key = ?', [JSON.stringify(content), aboutId, key]);
        } else {
          await connection.query('INSERT INTO page_sections (page_id, section_key, content) VALUES (?, ?, ?)', [aboutId, key, JSON.stringify(content)]);
        }
      }
      console.log("About page content updated.");
    }

    console.log("Updating Contact page content...");
    const [contactRows] = await connection.query('SELECT id FROM pages WHERE slug = "contact"');
    if (contactRows.length > 0) {
      const contactId = contactRows[0].id;
      
      const hero = {
        title: "Let's Start a Conversation",
        subtitle: "Have a project in mind, a question about our services, or want to apply for an internship? Reach out to us — we'd love to hear from you."
      };

      const [existing] = await connection.query('SELECT id FROM page_sections WHERE page_id = ? AND section_key = "hero"', [contactId]);
      if (existing.length > 0) {
        await connection.query('UPDATE page_sections SET content = ? WHERE page_id = ? AND section_key = "hero"', [JSON.stringify(hero), contactId]);
      } else {
        await connection.query('INSERT INTO page_sections (page_id, section_key, content) VALUES (?, "hero", ?)', [contactId, JSON.stringify(hero)]);
      }
      console.log("Contact page content updated.");
    } else {
      // Create contact page if not exists
      const [insertRes] = await connection.query('INSERT INTO pages (slug, title, seo_title, seo_description, status) VALUES ("contact", "Contact Us", "Contact Us - EDIZO", "Get in touch with EDIZO.", "published")');
      const contactId = insertRes.insertId;
      const hero = {
        title: "Let's Start a Conversation",
        subtitle: "Have a project in mind, a question about our services, or want to apply for an internship? Reach out to us — we'd love to hear from you."
      };
      await connection.query('INSERT INTO page_sections (page_id, section_key, content) VALUES (?, "hero", ?)', [contactId, JSON.stringify(hero)]);
      console.log("Contact page created and seeded.");
    }

  } catch (err) {
    console.error("Database update error:", err);
  } finally {
    await connection.end();
  }
}

updateAboutContact();

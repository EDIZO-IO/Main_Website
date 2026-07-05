const fs = require('fs');
const path = require('path');

const internshipsText = fs.readFileSync(path.join(__dirname, '../client/src/data/internships.js'), 'utf8');
let rawJs = internshipsText.replace('export const internshipsData = ', 'const internshipsData = ');
rawJs += `\nmodule.exports = { internshipsData };\n`;
fs.writeFileSync(path.join(__dirname, 'temp_data.js'), rawJs);

const { internshipsData } = require('./temp_data');

const seedScript = `
const mysql = require('mysql2/promise');
require('dotenv').config();

const internshipsData = ${JSON.stringify(internshipsData, null, 2)};

const servicesData = [
  {
    title: "Web Development",
    category: "Development",
    description: "Custom, scalable, and secure web applications.",
    features: ["Responsive Design", "Full-Stack Development", "E-Commerce Solutions", "API Integration"],
    price: "Custom"
  },
  {
    title: "Mobile App Development",
    category: "Development",
    description: "Native and cross-platform mobile experiences.",
    features: ["iOS Development", "Android Development", "React Native / Flutter", "App Store Deployment"],
    price: "Custom"
  },
  {
    title: "UI/UX Design",
    category: "Design",
    description: "Intuitive and stunning digital interfaces.",
    features: ["Wireframing & Prototyping", "User Research", "Visual Design", "Usability Testing"],
    price: "Custom"
  },
  {
    title: "Digital Marketing",
    category: "Marketing",
    description: "Data-driven marketing to grow your brand.",
    features: ["Search Engine Optimization", "Social Media Marketing", "Pay-Per-Click Ads", "Content Strategy"],
    price: "Custom"
  }
];

async function seedDatabase() {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'remote_user',
    password: 'Ananth01@12',
    database: 'edizo_db'
  });

  console.log("Connected to database. Seeding...");

  // Seed Internships
  for (const [key, item] of Object.entries(internshipsData)) {
    const [existing] = await db.query('SELECT id FROM internships WHERE title = ?', [item.title]);
    if (existing.length === 0) {
      await db.query(
        'INSERT INTO internships (title, category, company, duration, mode, description, syllabus, benefits, rating, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [item.title, item.category, item.company, "15 Days - 3 Months", item.mode, item.description, JSON.stringify(item.syllabus), JSON.stringify(item.benefits), item.rating, 'active']
      );
      console.log(\`Inserted internship: \${item.title}\`);
    }
  }

  // Seed Services
  for (const item of servicesData) {
    const [existing] = await db.query('SELECT id FROM services WHERE title = ?', [item.title]);
    if (existing.length === 0) {
      await db.query(
        'INSERT INTO services (title, category, description, features, price, status) VALUES (?, ?, ?, ?, ?, ?)',
        [item.title, item.category, item.description, JSON.stringify(item.features), item.price, 'active']
      );
      console.log(\`Inserted service: \${item.title}\`);
    }
  }

  console.log("Database seeding completed.");
  process.exit();
}

seedDatabase().catch(err => {
  console.error("Seeding error:", err);
  process.exit(1);
});
`;

fs.writeFileSync(path.join(__dirname, 'seed.js'), seedScript);
console.log("seed.js generated successfully!");
fs.unlinkSync(path.join(__dirname, 'temp_data.js'));

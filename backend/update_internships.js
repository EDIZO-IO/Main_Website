require('dotenv').config();
const mysql = require('mysql2/promise');

async function updateInternships() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'edizo_website'
  });

  console.log("Connected to DB. Adding image column to internships...");

  try {
    await db.query(`ALTER TABLE internships ADD COLUMN image VARCHAR(255) DEFAULT '/images/internship.png'`);
    console.log("Added image column.");
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') console.log("image column already exists.");
  }

  try {
    await db.query(`ALTER TABLE internships ADD COLUMN stipend VARCHAR(100) DEFAULT NULL`);
    console.log("Added stipend column.");
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') console.log("stipend column already exists.");
  }

  try {
    await db.query(`ALTER TABLE internships ADD COLUMN price VARCHAR(100) DEFAULT '0'`);
    console.log("Added price column.");
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') console.log("price column already exists.");
  }

  try {
    await db.query(`ALTER TABLE internships ADD COLUMN skill_level VARCHAR(100) DEFAULT 'beginner'`);
    console.log("Added skill_level column.");
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') console.log("skill_level column already exists.");
  }

  try {
    await db.query(`UPDATE internships SET image = '/images/internship.png' WHERE image IS NULL`);
    console.log("Updated existing internships with image.");
  } catch(err) {
    console.error(err);
  }

  process.exit();
}

updateInternships();

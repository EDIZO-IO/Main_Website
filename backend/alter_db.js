require('dotenv').config();
const mysql = require('mysql2/promise');

async function alterDb() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'edizo_db'
  });

  const columns = ['solutions', 'technologies', 'process', 'benefits', 'faqs', 'related_projects'];
  
  for (const col of columns) {
    try {
      await db.query(`ALTER TABLE services ADD COLUMN ${col} TEXT`);
      console.log(`Added column ${col}`);
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log(`Column ${col} already exists, skipping.`);
      } else {
        console.error(`Error adding ${col}:`, e.message);
      }
    }
  }
  
  await db.end();
}

alterDb();

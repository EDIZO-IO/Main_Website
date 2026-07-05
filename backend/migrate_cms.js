const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigrations() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  });

  try {
    const sql = fs.readFileSync(__dirname + '/migrations/cms_upgrade.sql', 'utf8');
    console.log('Executing CMS upgrade migrations...');
    await connection.query(sql);
    console.log('Migrations executed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await connection.end();
  }
}

runMigrations();

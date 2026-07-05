const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  });
  const sql = fs.readFileSync('schema.sql', 'utf8');
  try {
    await connection.query(sql);
    console.log("Database updated successfully");
  } catch (err) {
    console.error(err);
  } finally {
    connection.end();
  }
}
run();

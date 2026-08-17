const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateContactInfo() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const settings = {
      phone: '+91 7092435729',
      email_1: 'edizo5491@gmail.com',
      email_2: 'edizooffical@gmail.com',
      email_3: 'edizoteam@gmail.com',
      youtube_url: 'https://youtube.com/@edizo_official?si=Yn2SUz8BfQ5pP1I9',
      instagram_url: 'https://www.instagram.com/edizo_official?igsh=amRlN2htcWxsbzh1',
      x_url: 'https://x.com/edizo_official',
      whatsapp_url: 'https://whatsapp.com/channel/0029VbAcqFjG3R3hEF6IsT2O'
    };

    for (const [key, value] of Object.entries(settings)) {
      await connection.query(
        'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, value, value]
      );
    }
    console.log('Contact info updated successfully in site_settings');
  } catch (err) {
    console.error(err);
  } finally {
    connection.end();
  }
}

updateContactInfo();

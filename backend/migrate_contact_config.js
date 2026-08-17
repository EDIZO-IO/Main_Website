const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const [rows] = await connection.query('SELECT * FROM contact_config LIMIT 1');
    if (rows.length > 0) {
      const config = rows[0];
      const settings = {
        email_1: config.email_1,
        email_2: config.email_2,
        phone: config.phone,
        office_hours: config.office_hours,
        address_title: config.address_title,
        address_line1: config.address_line1,
        address_line2: config.address_line2,
        company_name: 'EDIZO',
        site_description: 'Turning Ideas Into Digital Experiences. We build scalable software and nurture next-gen talent.',
        linkedin_url: 'https://linkedin.com/company/edizo',
        instagram_url: 'https://instagram.com/edizo',
        github_url: 'https://github.com/edizo',
        facebook_url: 'https://facebook.com/edizo'
      };

      for (const [key, value] of Object.entries(settings)) {
        if (value !== null && value !== undefined) {
          await connection.query(
            'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
            [key, value, value]
          );
        }
      }
      console.log('Migrated contact_config to site_settings');
    }
  } catch (err) {
    console.error(err);
  } finally {
    connection.end();
  }
}

migrate();

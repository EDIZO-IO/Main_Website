import paramiko

script = """
const pool = require('./db');

async function run() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_config (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email_1 VARCHAR(255),
        email_2 VARCHAR(255),
        phone VARCHAR(50),
        office_hours VARCHAR(100),
        address_title VARCHAR(100),
        address_line1 VARCHAR(255),
        address_line2 VARCHAR(255),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);
    
    // Seed default if empty
    const [rows] = await pool.query('SELECT * FROM contact_config');
    if (rows.length === 0) {
      await pool.query(`
        INSERT INTO contact_config (email_1, email_2, phone, office_hours, address_title, address_line1, address_line2)
        VALUES (
          'hello@edizo.com',
          'support@edizo.com',
          '+1 (555) 000-Edizo',
          'Mon - Fri, 9am - 6pm EST',
          'The Edizo Tower',
          '42 Innovation Way, Suite 800',
          'Silicon Alley, NY 10010'
        )
      `);
      console.log('contact_config table created and seeded.');
    } else {
      console.log('contact_config table already exists and is seeded.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}
run();
"""

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('100.110.78.25', port=55222, username='server', password='ananth01@12')

sftp = ssh.open_sftp()
with sftp.file('/home/server/My_Sites/edizo/backend/update_db.js', 'w') as f:
    f.write(script)
sftp.close()

stdin, stdout, stderr = ssh.exec_command("cd /home/server/My_Sites/edizo/backend && node update_db.js")
print(stdout.read().decode('utf-8'))
print(stderr.read().decode('utf-8'))
ssh.close()

import paramiko
import sys

HOST = "100.110.78.25"
PORT = 55222
USER = "server"
PASSWORD = "ananth01@12"

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, port=PORT, username=USER, password=PASSWORD, timeout=15)
    
    cmd = """cd /home/server/My_Sites/edizo/backend && node -e "
const mysql = require('mysql2/promise');
require('dotenv').config();
(async () => {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'edizo_db',
    port: process.env.DB_PORT || 3306
  });
  const [projects] = await pool.query('SELECT id, title, client, category FROM portfolio_projects');
  console.log('=== CURRENT PORTFOLIO PROJECTS ===');
  console.log(JSON.stringify(projects, null, 2));

  const [testimonials] = await pool.query('SELECT id, name, company FROM testimonials');
  console.log('=== CURRENT TESTIMONIALS ===');
  console.log(JSON.stringify(testimonials, null, 2));
  
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
"
"""
    stdin, stdout, stderr = ssh.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='ignore')
    err = stderr.read().decode('utf-8', errors='ignore')
    print("OUTPUT:\n", out)
    if err:
        print("STDERR:\n", err)
    ssh.close()

if __name__ == "__main__":
    main()

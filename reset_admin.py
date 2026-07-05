import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('100.110.78.25', port=55222, username='server', password='ananth01@12')

node_script = """
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function resetAdmin() {
  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'remote_user',
    password: 'Ananth01@12',
    database: 'edizo_db'
  });
  
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  await db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, 'admin@edizo.in']);
  console.log('Admin password updated successfully!');
  process.exit();
}
resetAdmin();
"""

stdin, stdout, stderr = ssh.exec_command(f"cat << 'EOF' > /home/server/My_Sites/edizo/backend/reset_admin.js\n{node_script}\nEOF\ncd /home/server/My_Sites/edizo/backend && npm install bcryptjs && node reset_admin.js")
out = stdout.read().decode('utf-8', errors='ignore')
err = stderr.read().decode('utf-8', errors='ignore')
print("OUT:", out.encode('ascii', 'ignore').decode('ascii'))
print("ERR:", err.encode('ascii', 'ignore').decode('ascii'))
ssh.close()

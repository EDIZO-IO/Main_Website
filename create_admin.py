import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('100.110.78.25', port=55222, username='server', password='ananth01@12')

cmd = "mysql -u remote_user -p'Ananth01@12' edizo_db -e \"INSERT IGNORE INTO users (name, email, password, role) VALUES ('Admin', 'admin@edizo.in', '\\$2b\\$10\\$4whRa/Crf8/F4NViQ40vG.Loo1md7eb8TXJ2DRYjdxZVi05SLg2xW', 'admin');\""
stdin, stdout, stderr = ssh.exec_command(cmd)
print(stdout.read().decode('utf-8'))
print(stderr.read().decode('utf-8'))
ssh.close()

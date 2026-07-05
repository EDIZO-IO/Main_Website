import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('100.110.78.25', port=55222, username='server', password='ananth01@12')

commands = [
    "echo 'ananth01@12' | sudo -S ufw allow 3306",
    "echo 'ananth01@12' | sudo -S sed -i 's/bind-address.*/bind-address = 0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf",
    "echo 'ananth01@12' | sudo -S systemctl restart mysql",
    "mysql -u remote_user -p'Ananth01@12' -e \"CREATE USER IF NOT EXISTS 'remote_user'@'%' IDENTIFIED BY 'Ananth01@12'; GRANT ALL PRIVILEGES ON edizo_db.* TO 'remote_user'@'%'; FLUSH PRIVILEGES;\""
]

for cmd in commands:
    print(f"Running: {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    print(stdout.read().decode('utf-8', errors='ignore'))
    print(stderr.read().decode('utf-8', errors='ignore'))

ssh.close()

import paramiko
import os

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('100.110.78.25', port=55222, username='server', password='ananth01@12')

# Let's see what PM2 processes exist
stdin, stdout, stderr = ssh.exec_command("pm2 list")
print("PM2 List:")
print(stdout.read().decode('utf-8', errors='ignore'))

# Restart PM2 using 'all' to be safe, then rebuild admin
stdin, stdout, stderr = ssh.exec_command("cd /home/server/My_Sites/edizo && pm2 restart all && cd admin && npm install && npm run build")
print("Build output:")
print(stdout.read().decode('utf-8', errors='ignore'))
print(stderr.read().decode('utf-8', errors='ignore'))

ssh.close()

import paramiko
import os

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('100.110.78.25', port=55222, username='server', password='ananth01@12')

stdin, stdout, stderr = ssh.exec_command("pm2 logs edizo-backend --lines 50 --nostream")
with open('pm2_logs.txt', 'wb') as f:
    f.write(stdout.read())
    f.write(stderr.read())

ssh.close()

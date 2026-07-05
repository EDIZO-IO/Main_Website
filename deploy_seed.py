import paramiko
import os

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('100.110.78.25', port=55222, username='server', password='ananth01@12')
sftp = ssh.open_sftp()

local_file = r"c:\Users\tech1\OneDrive\Desktop\edizo\backend\seed.js"
remote_file = "/home/server/My_Sites/edizo/backend/seed.js"
sftp.put(local_file, remote_file)
sftp.close()

stdin, stdout, stderr = ssh.exec_command("cd /home/server/My_Sites/edizo/backend && npm install dotenv && node seed.js")
print(stdout.read().decode('utf-8', errors='ignore'))
print(stderr.read().decode('utf-8', errors='ignore'))
ssh.close()

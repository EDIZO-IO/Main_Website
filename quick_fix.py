import paramiko
import os

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('100.110.78.25', port=55222, username='server', password='ananth01@12')
sftp = ssh.open_sftp()

local_job = r"c:\Users\tech1\OneDrive\Desktop\edizo\backend\routes\jobRoutes.js"
remote_job = "/home/server/My_Sites/edizo/backend/routes/jobRoutes.js"
sftp.put(local_job, remote_job)

local_contact = r"c:\Users\tech1\OneDrive\Desktop\edizo\backend\routes\contactRoutes.js"
remote_contact = "/home/server/My_Sites/edizo/backend/routes/contactRoutes.js"
sftp.put(local_contact, remote_contact)

sftp.close()

stdin, stdout, stderr = ssh.exec_command("pm2 restart edizo-backend")
print(stdout.read().decode('utf-8'))
ssh.close()

import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('100.110.78.25', port=55222, username='server', password='ananth01@12')
sftp = ssh.open_sftp()

local_internship = r"c:\Users\tech1\OneDrive\Desktop\edizo\backend\routes\internshipRoutes.js"
remote_internship = "/home/server/My_Sites/edizo/backend/routes/internshipRoutes.js"
sftp.put(local_internship, remote_internship)

local_service = r"c:\Users\tech1\OneDrive\Desktop\edizo\backend\routes\serviceRoutes.js"
remote_service = "/home/server/My_Sites/edizo/backend/routes/serviceRoutes.js"
sftp.put(local_service, remote_service)

sftp.close()

stdin, stdout, stderr = ssh.exec_command("pm2 restart edizo-backend")
out = stdout.read().decode('utf-8', errors='ignore')
print("Restarted backend")
ssh.close()

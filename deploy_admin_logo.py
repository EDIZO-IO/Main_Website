import paramiko
import os

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('100.110.78.25', port=55222, username='server', password='ananth01@12')

sftp = ssh.open_sftp()
# Ensure directory exists
try:
    sftp.stat('/home/server/My_Sites/edizo/admin/src/assets')
except IOError:
    sftp.mkdir('/home/server/My_Sites/edizo/admin/src/assets')

local_logo = r"c:\Users\tech1\OneDrive\Desktop\edizo\admin\src\assets\edizo_logo.png"
remote_logo = "/home/server/My_Sites/edizo/admin/src/assets/edizo_logo.png"
sftp.put(local_logo, remote_logo)

sftp.close()

# Rebuild admin
stdin, stdout, stderr = ssh.exec_command("cd /home/server/My_Sites/edizo/admin && npm install && npm run build")
print(stdout.read().decode('utf-8', errors='ignore'))
print(stderr.read().decode('utf-8', errors='ignore'))

ssh.close()
print("Admin logo uploaded and built successfully.")

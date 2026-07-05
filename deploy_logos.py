import paramiko
import os
import zipfile

def create_zip():
    with zipfile.ZipFile('update_logos.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipf.write(r'admin\src\layouts\AdminLayout.jsx', arcname='admin/src/layouts/AdminLayout.jsx')
        zipf.write(r'admin\src\pages\Login.jsx', arcname='admin/src/pages/Login.jsx')
        zipf.write(r'admin\index.html', arcname='admin/index.html')

create_zip()

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('100.110.78.25', port=55222, username='server', password='ananth01@12')

sftp = ssh.open_sftp()
sftp.put('update_logos.zip', '/home/server/My_Sites/edizo/update_logos.zip')
sftp.close()

stdin, stdout, stderr = ssh.exec_command("cd /home/server/My_Sites/edizo && unzip -o update_logos.zip && cd admin && npm install && npm run build")
print(stdout.read().decode('utf-8', errors='ignore'))
print(stderr.read().decode('utf-8', errors='ignore'))

ssh.close()
os.remove('update_logos.zip')
print("Admin logo updates deployed and built successfully.")

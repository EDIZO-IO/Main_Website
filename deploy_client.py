import paramiko
import os
import zipfile

def create_zip():
    with zipfile.ZipFile('update_client.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipf.write(r'client\src\pages\Home.jsx', arcname='client/src/pages/Home.jsx')
        zipf.write(r'client\src\components\Footer.jsx', arcname='client/src/components/Footer.jsx')

create_zip()

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('100.110.78.25', port=55222, username='server', password='ananth01@12')

sftp = ssh.open_sftp()
sftp.put('update_client.zip', '/home/server/My_Sites/edizo/update_client.zip')
sftp.close()

stdin, stdout, stderr = ssh.exec_command("cd /home/server/My_Sites/edizo && unzip -o update_client.zip && cd client && npm install && npm run build")
print(stdout.read().decode('utf-8', errors='ignore'))
print(stderr.read().decode('utf-8', errors='ignore'))

ssh.close()
os.remove('update_client.zip')
print("Client updates deployed and built successfully.")

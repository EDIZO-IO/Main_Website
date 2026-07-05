import paramiko
import os
import zipfile

def create_zip():
    with zipfile.ZipFile('update_app_fix.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
        # Client
        zipf.write(r'client\src\pages\InternshipApplication.jsx', arcname='client/src/pages/InternshipApplication.jsx')

create_zip()

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('100.110.78.25', port=55222, username='server', password='ananth01@12')

sftp = ssh.open_sftp()
sftp.put('update_app_fix.zip', '/home/server/My_Sites/edizo/update_app_fix.zip')
sftp.close()

# deploy
command = "cd /home/server/My_Sites/edizo && unzip -o update_app_fix.zip && cd client && npm run build > deploy_app_fix.log 2>&1"
stdin, stdout, stderr = ssh.exec_command(command)

exit_status = stdout.channel.recv_exit_status()
ssh.close()
os.remove('update_app_fix.zip')
print("Application fix deployed successfully with exit status:", exit_status)

import paramiko
import os
import zipfile

def create_zip():
    with zipfile.ZipFile('update_client_job.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipf.write(r'client\src\pages\Home.jsx', arcname='client/src/pages/Home.jsx')
        zipf.write(r'client\src\App.jsx', arcname='client/src/App.jsx')
        zipf.write(r'client\src\components\Navbar.jsx', arcname='client/src/components/Navbar.jsx')

create_zip()

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('100.110.78.25', port=55222, username='server', password='ananth01@12')

sftp = ssh.open_sftp()
sftp.put('update_client_job.zip', '/home/server/My_Sites/edizo/update_client_job.zip')
sftp.close()

# deploy
command = "cd /home/server/My_Sites/edizo && rm -f client/src/pages/JobApplication.jsx client/src/pages/JobDetails.jsx client/src/pages/JobsPage.jsx && unzip -o update_client_job.zip && cd client && npm run build > build.log 2>&1"
stdin, stdout, stderr = ssh.exec_command(command)

exit_status = stdout.channel.recv_exit_status()
ssh.close()
os.remove('update_client_job.zip')
print("Client job update deployed successfully with exit status:", exit_status)

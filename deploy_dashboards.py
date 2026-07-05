import paramiko
import os
import zipfile

def create_zip():
    with zipfile.ZipFile('update_dashboards.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
        # Backend
        zipf.write(r'backend\routes\adminRoutes.js', arcname='backend/routes/adminRoutes.js')
        # Admin
        zipf.write(r'admin\src\pages\DashboardOverview.jsx', arcname='admin/src/pages/DashboardOverview.jsx')
        # Client
        zipf.write(r'client\src\pages\Dashboard.jsx', arcname='client/src/pages/Dashboard.jsx')

create_zip()

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('100.110.78.25', port=55222, username='server', password='ananth01@12')

sftp = ssh.open_sftp()
sftp.put('update_dashboards.zip', '/home/server/My_Sites/edizo/update_dashboards.zip')
sftp.close()

# deploy
command = "cd /home/server/My_Sites/edizo && unzip -o update_dashboards.zip && pm2 restart all && cd admin && npm run build && cd ../client && npm run build > deploy_dashboards.log 2>&1"
stdin, stdout, stderr = ssh.exec_command(command)

exit_status = stdout.channel.recv_exit_status()
ssh.close()
os.remove('update_dashboards.zip')
print("Dashboards deployed successfully with exit status:", exit_status)

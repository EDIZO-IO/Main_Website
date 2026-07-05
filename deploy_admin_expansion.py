import paramiko
import os
import zipfile

def create_zip():
    with zipfile.ZipFile('update_expansion.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
        # Backend
        zipf.write(r'backend\routes\adminRoutes.js', arcname='backend/routes/adminRoutes.js')
        zipf.write(r'backend\routes\contactRoutes.js', arcname='backend/routes/contactRoutes.js')
        zipf.write(r'backend\schema.sql', arcname='backend/schema.sql')
        # Admin
        zipf.write(r'admin\src\pages\UsersView.jsx', arcname='admin/src/pages/UsersView.jsx')
        zipf.write(r'admin\src\pages\ContactMessagesView.jsx', arcname='admin/src/pages/ContactMessagesView.jsx')
        zipf.write(r'admin\src\pages\InternshipApplicationsView.jsx', arcname='admin/src/pages/InternshipApplicationsView.jsx')
        zipf.write(r'admin\src\pages\ServiceRequestsView.jsx', arcname='admin/src/pages/ServiceRequestsView.jsx')
        zipf.write(r'admin\src\pages\SettingsView.jsx', arcname='admin/src/pages/SettingsView.jsx')
        zipf.write(r'admin\src\layouts\AdminLayout.jsx', arcname='admin/src/layouts/AdminLayout.jsx')
        zipf.write(r'admin\src\App.jsx', arcname='admin/src/App.jsx')
        # Client
        zipf.write(r'client\src\pages\ContactPage.jsx', arcname='client/src/pages/ContactPage.jsx')

create_zip()

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('100.110.78.25', port=55222, username='server', password='ananth01@12')

sftp = ssh.open_sftp()
sftp.put('update_expansion.zip', '/home/server/My_Sites/edizo/update_expansion.zip')
sftp.close()

# deploy - direct to log to avoid cp1252 local crash
command = "cd /home/server/My_Sites/edizo && unzip -o update_expansion.zip && pm2 restart all && cd admin && npm run build && cd ../client && npm run build > deploy_expansion.log 2>&1"
stdin, stdout, stderr = ssh.exec_command(command)

exit_status = stdout.channel.recv_exit_status()
ssh.close()
os.remove('update_expansion.zip')
print("Expansion update deployed successfully with exit status:", exit_status)

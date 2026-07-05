import paramiko
import os
import zipfile

def create_zip():
    with zipfile.ZipFile('update_admin_crud.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipf.write(r'admin\src\App.jsx', arcname='admin/src/App.jsx')
        zipf.write(r'admin\src\pages\InternshipsView.jsx', arcname='admin/src/pages/InternshipsView.jsx')
        zipf.write(r'admin\src\pages\EditInternshipView.jsx', arcname='admin/src/pages/EditInternshipView.jsx')
        zipf.write(r'admin\src\pages\ServicesView.jsx', arcname='admin/src/pages/ServicesView.jsx')
        zipf.write(r'admin\src\pages\CreateServiceView.jsx', arcname='admin/src/pages/CreateServiceView.jsx')
        zipf.write(r'admin\src\pages\EditServiceView.jsx', arcname='admin/src/pages/EditServiceView.jsx')
        zipf.write(r'backend\routes\adminRoutes.js', arcname='backend/routes/adminRoutes.js')

create_zip()

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('100.110.78.25', port=55222, username='server', password='ananth01@12')

sftp = ssh.open_sftp()
sftp.put('update_admin_crud.zip', '/home/server/My_Sites/edizo/update_admin_crud.zip')
sftp.close()

stdin, stdout, stderr = ssh.exec_command("cd /home/server/My_Sites/edizo && unzip -o update_admin_crud.zip && pm2 restart edizo-api && cd admin && npm install && npm run build")
print(stdout.read().decode('utf-8', errors='ignore'))
print(stderr.read().decode('utf-8', errors='ignore'))

ssh.close()
os.remove('update_admin_crud.zip')
print("Admin CRUD updates deployed and built successfully.")

import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('100.110.78.25', port=55222, username='server', password='ananth01@12')

# Explicitly install packages inside backend folder
command = "cd /home/server/My_Sites/edizo/backend && npm install helmet express-rate-limit cors dotenv express && pm2 restart edizo-backend"
stdin, stdout, stderr = ssh.exec_command(command)
print("STDOUT:", stdout.read().decode('utf-8'))
print("STDERR:", stderr.read().decode('utf-8'))
ssh.close()

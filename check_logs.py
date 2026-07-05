import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('100.110.78.25', port=55222, username='server', password='ananth01@12')

stdin, stdout, stderr = ssh.exec_command('pm2 logs edizo-backend --lines 100 --nostream')
print("STDOUT:")
out = stdout.read().decode('utf-8', errors='ignore')
print(out.encode('ascii', errors='ignore').decode('ascii'))
print("STDERR:")
err = stderr.read().decode('utf-8', errors='ignore')
print(err.encode('ascii', errors='ignore').decode('ascii'))
ssh.close()

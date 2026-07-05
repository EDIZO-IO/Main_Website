import paramiko

HOST = "100.110.78.25"
PORT = 55222
USER = "server"
PASSWORD = "ananth01@12"

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(HOST, port=PORT, username=USER, password=PASSWORD)

stdin, stdout, stderr = ssh.exec_command('cat /etc/nginx/sites-available/edizo')
print(stdout.read().decode('utf-8'))
print(stderr.read().decode('utf-8'))

ssh.close()

import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('100.110.78.25', port=55222, username='server', password='ananth01@12')

# Restart PM2 and rebuild admin, outputting to a file instead of stdout so we don't crash python on Windows
command = "cd /home/server/My_Sites/edizo && pm2 restart all && cd admin && npm install && npm run build > build.log 2>&1"
stdin, stdout, stderr = ssh.exec_command(command)

# wait for command to finish
exit_status = stdout.channel.recv_exit_status()

ssh.close()
print("Final deploy finished with exit status:", exit_status)

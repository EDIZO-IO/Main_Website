import paramiko
import os
import zipfile

HOST = "100.110.78.25"
PORT = 55222
USER = "server"
PASSWORD = "ananth01@12"
REMOTE_DIR = "/home/server/My_Sites/edizo"

def run_command(ssh, cmd):
    print(f"Running: {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    exit_status = stdout.channel.recv_exit_status()
    out = stdout.read().decode('utf-8', errors='ignore')
    err = stderr.read().decode('utf-8', errors='ignore')
    if out:
        print(out.encode('ascii', errors='ignore').decode('ascii'))
    if err:
        print(f"ERROR: {err.encode('ascii', errors='ignore').decode('ascii')}")
    return exit_status

def create_deploy_archive():
    print("Creating archive...")
    with zipfile.ZipFile("deploy_package.zip", "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk("."):
            if "node_modules" in root or ".git" in root or "deploy_package.zip" in root or "dist" in root:
                continue
            for file in files:
                file_path = os.path.join(root, file)
                zipf.write(file_path, os.path.relpath(file_path, "."))

def main():
    create_deploy_archive()
    
    print("Connecting to SSH...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        ssh.connect(HOST, port=PORT, username=USER, password=PASSWORD)
        
        print("Uploading deploy_package.zip...")
        sftp = ssh.open_sftp()
        run_command(ssh, f"mkdir -p {REMOTE_DIR}")
        sftp.put("deploy_package.zip", f"{REMOTE_DIR}/deploy_package.zip")
        sftp.close()
        
        print("Extracting files on remote server...")
        run_command(ssh, f"cd {REMOTE_DIR} && unzip -o deploy_package.zip")
        run_command(ssh, f"cd {REMOTE_DIR} && rm deploy_package.zip")
        run_command(ssh, f"cd {REMOTE_DIR}/client && rm -f .env.local")
        run_command(ssh, f"cd {REMOTE_DIR}/admin && rm -f .env.local")
        
        # Build Client
        print("Building client...")
        run_command(ssh, f"cd {REMOTE_DIR}/client && npm install && npm run build")
        
        # Build Admin
        print("Building admin...")
        run_command(ssh, f"cd {REMOTE_DIR}/admin && npm install && npm run build")
        
        # Restart backend
        print("Restarting backend...")
        run_command(ssh, f"cd {REMOTE_DIR}/backend && npm install && pm2 restart edizo-backend")
        
        print("Custom Deployment completed successfully!")
        
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        ssh.close()
        if os.path.exists("deploy_package.zip"):
            os.remove("deploy_package.zip")

if __name__ == "__main__":
    main()

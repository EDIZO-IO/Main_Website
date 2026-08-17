import paramiko
import os
import zipfile
import subprocess
import shutil

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

def run_sudo_command(ssh, cmd):
    print(f"Running sudo: {cmd}")
    stdin, stdout, stderr = ssh.exec_command(f"sudo -S -p '' {cmd}")
    stdin.write(PASSWORD + "\n")
    stdin.flush()
    
    exit_status = stdout.channel.recv_exit_status()
    out = stdout.read().decode('utf-8', errors='ignore')
    err = stderr.read().decode('utf-8', errors='ignore')
    
    if out:
        print(out.encode('ascii', errors='ignore').decode('ascii'))
    if err:
        print(f"ERROR: {err.encode('ascii', errors='ignore').decode('ascii')}")
    return exit_status

def build_and_archive_all():
    print("Building client locally...")
    subprocess.run("npm install", shell=True, cwd="client")
    subprocess.run("npm run build", shell=True, cwd="client")
    
    print("Building admin locally...")
    subprocess.run("npm install", shell=True, cwd="admin")
    subprocess.run("npm run build", shell=True, cwd="admin")
    
    print("Creating archive for deployment...")
    
    IGNORE_DIRS = {'node_modules', '.wwebjs_auth', '.git', '.cache'}
    IGNORE_FILES = {'.env', '.env.local', 'deploy_package_new.zip', '.DS_Store'}

    with zipfile.ZipFile("deploy_package_new.zip", "w", zipfile.ZIP_DEFLATED) as zipf:
        # Helper function to add a directory to zip, applying ignores
        def add_dir_to_zip(dir_path):
            if os.path.exists(dir_path):
                for root, dirs, files in os.walk(dir_path):
                    # Modify dirs in-place to skip ignored directories
                    dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
                    for file in files:
                        if file in IGNORE_FILES:
                            continue
                        # If a file has a .env extension, also skip it?
                        if file.startswith('.env'):
                            continue
                            
                        file_path = os.path.join(root, file)
                        zipf.write(file_path, os.path.relpath(file_path, "."))

        # Add specific built dist folders for frontend and admin
        add_dir_to_zip(os.path.join("client", "dist"))
        add_dir_to_zip(os.path.join("admin", "dist"))
        
        # Add backend source folder
        add_dir_to_zip("backend")

def main():
    build_and_archive_all()
    
    print("Connecting to SSH...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        ssh.connect(HOST, port=PORT, username=USER, password=PASSWORD)
        
        # Delete old client and admin dist on server, and backend code (careful not to delete public/uploads)
        print("Cleaning up old files on server...")
        client_remote = f"{REMOTE_DIR}/client"
        admin_remote = f"{REMOTE_DIR}/admin"
        backend_remote = f"{REMOTE_DIR}/backend"
        
        run_command(ssh, f"mkdir -p {client_remote} {admin_remote} {backend_remote}")
        run_command(ssh, f"rm -rf {client_remote}/dist {admin_remote}/dist")
        # For backend, only delete routes, controllers, models, index.js etc. Do not delete public/uploads or node_modules
        run_command(ssh, f"cd {backend_remote} && rm -rf routes controllers models index.js package.json package-lock.json schema.sql")
        
        print("Uploading deploy_package_new.zip...")
        sftp = ssh.open_sftp()
        run_command(ssh, f"mkdir -p {REMOTE_DIR}")
        sftp.put("deploy_package_new.zip", f"{REMOTE_DIR}/deploy_package_new.zip")
        sftp.close()
        
        print("Extracting files on remote server...")
        run_command(ssh, f"cd {REMOTE_DIR} && unzip -o deploy_package_new.zip")
        run_command(ssh, f"cd {REMOTE_DIR} && rm deploy_package_new.zip")
        
        print("Installing backend dependencies and restarting backend server...")
        # using PM2 or similar, or just npm install
        run_command(ssh, f"cd {backend_remote} && npm install")
        run_command(ssh, f"pm2 restart all || (cd {backend_remote} && pm2 start index.js --name edizo-backend)")
        
        print("Website deployment completed successfully!")
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"An error occurred: {e}")
    finally:
        ssh.close()
        # Clean up local archive
        if os.path.exists("deploy_package_new.zip"):
            os.remove("deploy_package_new.zip")

if __name__ == "__main__":
    main()

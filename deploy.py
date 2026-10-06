import paramiko
import os
import zipfile
import subprocess
import shutil
import sys
import argparse

# Ensure UTF-8 output on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

HOST = "100.110.78.25"
PORT = 55222
USER = "server"
PASSWORD = "ananth01@12"
REMOTE_DIR = "/home/server/My_Sites/edizo"

IGNORE_DIRS = {'node_modules', '.wwebjs_auth', '.git', '.cache'}
IGNORE_FILES = {'.env', '.env.local', 'deploy_package.zip', '.DS_Store'}

def run_command(ssh, cmd):
    print(f"\n[REMOTE] >> {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    
    exit_status = stdout.channel.recv_exit_status()
    out = stdout.read().decode('utf-8', errors='ignore')
    err = stderr.read().decode('utf-8', errors='ignore')
    
    if out:
        print(out.strip())
    if err:
        print(f"[STDERR] {err.strip()}")
    return exit_status

def add_dir_to_zip(zipf, dir_path, archive_prefix=None):
    if not os.path.exists(dir_path):
        return
    for root, dirs, files in os.walk(dir_path):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        for file in files:
            if file in IGNORE_FILES or file.startswith('.env'):
                continue
            file_path = os.path.join(root, file)
            if archive_prefix:
                rel_path = os.path.relpath(file_path, dir_path)
                arcname = os.path.join(archive_prefix, rel_path)
            else:
                arcname = os.path.relpath(file_path, ".")
            zipf.write(file_path, arcname)

def build_client():
    print("\n==========================================")
    print("  [1/1] Building Client Frontend...")
    print("==========================================")
    if not os.path.exists(os.path.join("client", "node_modules")):
        subprocess.run("npm install", shell=True, cwd="client", check=True)
    subprocess.run("npm run build", shell=True, cwd="client", check=True)

def build_admin():
    print("\n==========================================")
    print("  [1/1] Building Admin Frontend...")
    print("==========================================")
    if not os.path.exists(os.path.join("admin", "node_modules")):
        subprocess.run("npm install", shell=True, cwd="admin", check=True)
    subprocess.run("npm run build", shell=True, cwd="admin", check=True)

def upload_and_extract_dist(ssh, zip_filename, target_subpath):
    print(f"\nUploading {zip_filename} to server...")
    sftp = ssh.open_sftp()
    remote_zip = f"{REMOTE_DIR}/{zip_filename}"
    sftp.put(zip_filename, remote_zip)
    sftp.close()
    
    print(f"Extracting {zip_filename} to {target_subpath} on remote server...")
    remote_cmd = f"cd {REMOTE_DIR} && mkdir -p {target_subpath} && rm -rf {target_subpath}/* && unzip -o {zip_filename} -d {target_subpath} && rm -f {zip_filename}"
    run_command(ssh, remote_cmd)

def upload_and_extract_root(ssh, zip_filename):
    print(f"\nUploading {zip_filename} to server...")
    sftp = ssh.open_sftp()
    remote_zip = f"{REMOTE_DIR}/{zip_filename}"
    sftp.put(zip_filename, remote_zip)
    sftp.close()
    
    print(f"Extracting {zip_filename} on remote server...")
    remote_cmd = f"cd {REMOTE_DIR} && unzip -o {zip_filename} && rm -f {zip_filename}"
    run_command(ssh, remote_cmd)

def deploy_backend(ssh):
    print("\n==========================================")
    print("  [+] DEPLOYING BACKEND")
    print("==========================================")
    zip_name = "deploy_backend.zip"
    with zipfile.ZipFile(zip_name, "w", zipfile.ZIP_DEFLATED) as zipf:
        add_dir_to_zip(zipf, "backend")
    
    try:
        backend_remote = f"{REMOTE_DIR}/backend"
        upload_and_extract_root(ssh, zip_name)
        
        print("\nInstalling backend dependencies & restarting PM2 process...")
        run_command(ssh, f"cd {backend_remote} && npm install --production")
        run_command(ssh, f"pm2 restart edizo-main-api || (cd {backend_remote} && pm2 start index.js --name edizo-main-api)")
        print("\n[OK] Backend deployment completed successfully!")
    finally:
        if os.path.exists(zip_name):
            os.remove(zip_name)

def deploy_admin(ssh):
    print("\n==========================================")
    print("  [+] DEPLOYING ADMIN PANEL")
    print("==========================================")
    dist_dir = os.path.join(os.getcwd(), "admin", "dist")
    zip_name = "admin_dist.zip"
    with zipfile.ZipFile(zip_name, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(dist_dir):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, dist_dir).replace('\\', '/')
                zipf.write(full_path, rel_path)
    
    try:
        upload_and_extract_dist(ssh, zip_name, "admin/dist")
        print("\n[OK] Admin deployment completed successfully!")
    finally:
        if os.path.exists(zip_name):
            os.remove(zip_name)

def deploy_client(ssh):
    print("\n==========================================")
    print("  [+] DEPLOYING CLIENT WEBSITE")
    print("==========================================")
    dist_dir = os.path.join(os.getcwd(), "client", "dist")
    zip_name = "client_dist.zip"
    with zipfile.ZipFile(zip_name, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(dist_dir):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, dist_dir).replace('\\', '/')
                zipf.write(full_path, rel_path)
    
    try:
        upload_and_extract_dist(ssh, zip_name, "client/dist")
        print("\n[OK] Client website deployment completed successfully!")
    finally:
        if os.path.exists(zip_name):
            os.remove(zip_name)

def deploy_all(ssh):
    print("\n==========================================")
    print("  [+] FULL DEPLOYMENT (Backend + Admin + Client)")
    print("==========================================")
    deploy_client(ssh)
    deploy_admin(ssh)
    deploy_backend(ssh)
    print("\n[OK] Full deployment completed successfully!")


def main():
    parser = argparse.ArgumentParser(description="EDIZO Multi-Target Deployment Script")
    parser.add_argument("target", nargs="?", choices=["all", "backend", "admin", "client", "frontend"], 
                        help="Select deployment target (all, backend, admin, client, frontend)")
    args = parser.parse_args()

    target = args.target

    if not target:
        print("\n==========================================")
        print("        EDIZO DEPLOYMENT MANAGER          ")
        print("==========================================")
        print(" [1] Full Deployment (Backend + Admin + Client)")
        print(" [2] Backend Only (Fast - No frontend build)")
        print(" [3] Admin Panel Only")
        print(" [4] Client Website Only")
        print(" [5] Frontend Only (Admin + Client)")
        print(" [0] Cancel")
        print("==========================================")
        
        try:
            choice = input("Select an option [1-5]: ").strip()
            if choice == "1":
                target = "all"
            elif choice == "2":
                target = "backend"
            elif choice == "3":
                target = "admin"
            elif choice == "4":
                target = "client"
            elif choice == "5":
                target = "frontend"
            else:
                print("Deployment cancelled.")
                return
        except KeyboardInterrupt:
            print("\nDeployment cancelled.")
            return

    # Build local assets before establishing SSH connection
    if target in ("all", "client", "frontend"):
        build_client()
    if target in ("all", "admin", "frontend"):
        build_admin()

    print(f"\nConnecting to SSH ({USER}@{HOST}:{PORT})...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        ssh.connect(HOST, port=PORT, username=USER, password=PASSWORD, timeout=15)
        print("[OK] SSH Connection established!")

        if target == "all":
            deploy_all(ssh)
        elif target == "backend":
            deploy_backend(ssh)
        elif target == "admin":
            deploy_admin(ssh)
        elif target == "client":
            deploy_client(ssh)
        elif target == "frontend":
            deploy_admin(ssh)
            deploy_client(ssh)
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"\n[FAIL] Deployment failed: {e}")
    finally:
        ssh.close()
        print("\nSSH connection closed.")

if __name__ == "__main__":
    main()




import paramiko
import os
import zipfile
import time

HOST = "100.110.78.25"
PORT = 55222
USER = "server"
PASSWORD = "ananth01@12"
REMOTE_DIR = "/home/server/My_Sites/edizo"

DB_USER = "remote_user"
DB_PASS = "Ananth01@12"

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
    # Use echo to pipe the password directly to sudo -S
    stdin, stdout, stderr = ssh.exec_command(f"echo '{PASSWORD}' | sudo -S {cmd}")
    
    exit_status = stdout.channel.recv_exit_status()
    out = stdout.read().decode('utf-8', errors='ignore')
    err = stderr.read().decode('utf-8', errors='ignore')
    
    if out:
        print(out.encode('ascii', errors='ignore').decode('ascii'))
    if err:
        print(f"ERROR: {err.encode('ascii', errors='ignore').decode('ascii')}")
    return exit_status

def create_deploy_archive():
    print("Creating archive for deployment (excluding node_modules)...")
    with zipfile.ZipFile("deploy_package.zip", "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk("."):
            if "node_modules" in root or ".git" in root or "deploy_package.zip" in root:
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
        # Create directory if not exists
        run_command(ssh, f"mkdir -p {REMOTE_DIR}")
        sftp.put("deploy_package.zip", f"{REMOTE_DIR}/deploy_package.zip")
        sftp.close()
        
        print("Extracting files on remote server...")
        run_command(ssh, f"cd {REMOTE_DIR} && unzip -o deploy_package.zip -x deploy_package.zip deploy.py")
        run_command(ssh, f"cd {REMOTE_DIR} && rm deploy_package.zip")
        
        print("Creating MySQL Database and initializing schema...")
        # Since remote_user is already provided, we assume it has permissions to create DB.
        run_command(ssh, f"mysql -u {DB_USER} -p'{DB_PASS}' -e 'CREATE DATABASE IF NOT EXISTS edizo_db;'")
        run_command(ssh, f"mysql -u {DB_USER} -p'{DB_PASS}' edizo_db < {REMOTE_DIR}/backend/schema.sql")
        
        print("Updating backend .env with production DB credentials...")
        env_content = f"PORT=5000\\nDB_HOST=localhost\\nDB_USER={DB_USER}\\nDB_PASSWORD={DB_PASS}\\nDB_NAME=edizo_db\\nJWT_SECRET=supersecretjwtkey_edizo"
        run_command(ssh, f"echo -e '{env_content}' > {REMOTE_DIR}/backend/.env")
        
        print("Installing dependencies and building apps via PM2...")
        # Check if pm2 is installed
        run_command(ssh, "if ! command -v pm2 &> /dev/null; then sudo npm install -g pm2; fi")
        
        # Backend
        run_command(ssh, f"cd {REMOTE_DIR}/backend && pm2 delete edizo-backend || true")
        run_command(ssh, f"cd {REMOTE_DIR}/backend && pm2 start index.js --name edizo-backend")
        
        # Update Client and Admin ENV for Production API URL
        print("Setting up Client and Admin production environments...")
        run_command(ssh, f"echo 'VITE_API_URL=https://api.edizo.co.in' > {REMOTE_DIR}/client/.env.local")
        run_command(ssh, f"echo 'VITE_API_URL=https://api.edizo.co.in' > {REMOTE_DIR}/admin/.env.local")

        # Stop old PM2 apps
        run_command(ssh, "pm2 delete edizo-client || true")
        run_command(ssh, "pm2 delete edizo-admin || true")

        # Client Build
        run_command(ssh, f"cd {REMOTE_DIR}/client && npm install && npm run build")
        
        # Admin Build
        run_command(ssh, f"cd {REMOTE_DIR}/admin && npm install && npm run build")
        
        run_command(ssh, "pm2 save")

        print("Setting up Nginx Reverse Proxy...")
        run_sudo_command(ssh, "apt-get update")
        run_sudo_command(ssh, "apt-get install -y nginx certbot python3-certbot-nginx")

        nginx_config = """
# MAIN WEBSITE
server {
    listen 80;
    server_name edizo.co.in www.edizo.co.in;

    root /home/server/My_Sites/edizo/client/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# ADMIN PANEL
server {
    listen 80;
    server_name admin.edizo.co.in;

    root /home/server/My_Sites/edizo/admin/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# API
server {
    listen 80;
    server_name api.edizo.co.in;

    location / {
        proxy_pass http://localhost:5000;

        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
"""
        # Save Nginx config
        run_command(ssh, f"echo '{nginx_config}' > {REMOTE_DIR}/nginx_edizo_temp.conf")
        run_sudo_command(ssh, f"mv {REMOTE_DIR}/nginx_edizo_temp.conf /etc/nginx/sites-available/edizo")
        run_sudo_command(ssh, "ln -sf /etc/nginx/sites-available/edizo /etc/nginx/sites-enabled/")
        run_sudo_command(ssh, "rm -f /etc/nginx/sites-enabled/default")
        run_sudo_command(ssh, "systemctl restart nginx")

        print("Setting up SSL with Certbot...")
        # Automatically register and configure SSL with Certbot
        run_sudo_command(ssh, "certbot --nginx -n --expand --agree-tos --email admin@edizo.co.in -d edizo.co.in -d www.edizo.co.in -d admin.edizo.co.in -d api.edizo.co.in --redirect")

        print("Deployment completed successfully!")
        
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        ssh.close()
        # Clean up local archive
        if os.path.exists("deploy_package.zip"):
            os.remove("deploy_package.zip")

if __name__ == "__main__":
    main()

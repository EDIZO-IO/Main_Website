import paramiko
import sys

HOST = "100.110.78.25"
PORT = 55222
USER = "server"
PASSWORD = "ananth01@12"

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        print(f"Connecting to {HOST}:{PORT}...")
        ssh.connect(HOST, port=PORT, username=USER, password=PASSWORD)
        
        cmd = "cd /home/server/My_Sites/edizo/backend && node alter_db.js && node update_services_catalog.js && node update_internships.js && node update_about_contact_seed.js"
        print(f"Running: {cmd}")
        stdin, stdout, stderr = ssh.exec_command(cmd)
        
        out_bytes = stdout.read()
        err_bytes = stderr.read()
        
        # Write directly to sys.stdout.buffer to avoid windows charmap issues
        if out_bytes:
            sys.stdout.buffer.write(out_bytes)
        if err_bytes:
            sys.stderr.buffer.write(err_bytes)
            
    except Exception as e:
        print(f"Connection failed: {e}")
    finally:
        ssh.close()

if __name__ == "__main__":
    main()

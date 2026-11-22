# Railway AMS Full Stack Runbook

This manual outlines the precise steps to run the complete AMS (Asset Management System) project on a Windows machine. Due to known Windows-to-WSL networking and port conflict issues, the most reliable way to run this stack is by running the **Database** and **Backend** inside WSL, and the **Frontend** natively on Windows.

## 📋 Prerequisites
Ensure you have the following installed:
- **Windows Subsystem for Linux (WSL)** with Ubuntu.
- **MySQL Server** installed *inside* WSL (`sudo apt install mysql-server`).
- **Java 17 (OpenJDK)** and **Maven** installed *inside* WSL (`sudo apt install openjdk-17-jdk maven`).
- **Node.js** and **npm** installed on Windows natively.

---

## 🚀 Step-by-Step Startup Guide

### 1. Start MySQL Database (in WSL)
Open a new WSL terminal (or use PowerShell and prefix with `wsl -u root`) and run:
```bash
service mysql start
```
*Verify it is running by typing `service mysql status`.*

### 2. Start the Spring Boot Backend (in WSL)
Since running Maven natively on Windows often results in `Communications link failure` when attempting to access the WSL database via localhost, run the backend from within WSL.

Open a WSL terminal, navigate to the Windows-mounted backend directory, and start Spring Boot:
```bash
# Navigate to the backend directory via the Windows mount path
cd "/mnt/c/Users/KIIT/Desktop/Railway Internship/ams/ams-backend/ams-backend"

# Run the Spring Boot application
mvn spring-boot:run
```
*Wait until you see `Started AmsApplication in X seconds` in the console. The backend will be listening on `http://127.0.0.1:8081`.*

### 3. Start the React Frontend (in Windows)
Open a standard Windows Command Prompt (CMD) or PowerShell window and navigate to the frontend directory:
```powershell
cd "C:\Users\KIIT\Desktop\Railway Internship\ams\ams-frontend"

# Install dependencies (if not already done)
npm install

# Start the Vite development server
npm run dev
```
*The frontend should now be running at `http://localhost:8082`.*

---

## ⚙️ Configuration Notes

### Frontend Proxy (Vite)
Because the backend runs in WSL, Vite needs to proxy API requests to the WSL Virtual Machine's IP address rather than Windows `localhost`.
In `ams-frontend/vite.config.ts`, the proxy target should point to the WSL IP (e.g., `172.20.75.13:8081`). 

To find your current WSL IP address, run this in PowerShell:
```powershell
wsl ip addr show eth0
```
Update your `vite.config.ts` proxy block to match that IP if you get `ECONNREFUSED` errors in the Vite terminal:
```typescript
proxy: {
  '/api': {
    target: 'http://<YOUR_WSL_IP>:8081',
    changeOrigin: true,
  }
}
```

### Backend Database (application.yml)
In `ams-backend/src/main/resources/application.yml`, the database URL should remain:
```yaml
url: jdbc:mysql://localhost:3306/ams_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
```
*(Since the backend is running inside WSL alongside MySQL, `localhost` works perfectly).*

---

## 🔑 Default Login Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@railway.com` | `Admin@123` |
| **Employee** | `sneha@railway.com` | `Admin@123` |
| **Viewer** | `priya@railway.com` | `Admin@123` |

---

## 🛠️ Troubleshooting

**1. "Port 8082 is already in use" (Frontend)**
You likely have an old Vite server running in the background. Kill it by running this in PowerShell:
```powershell
# Find the Node process ID listening on 8082
netstat -aon | findstr ":8082"
# Kill the process (Replace PID with the number from the last column)
taskkill /F /PID <PID>
```

**2. Maven Backend Build is Extremely Slow**
When you run `mvn spring-boot:run` in WSL on a `/mnt/c/` path, file system translation overhead between Windows and Linux makes compilation very slow. *This is normal.* If it becomes unbearable, consider moving the `ams-backend` folder directly into the Linux file system (e.g., `~/ams-backend`) rather than keeping it on the Windows Desktop.

**3. "Communications link failure" in Backend**
If you try to run the backend natively on Windows (via CMD or `start-ams.bat`), you may hit connection refused errors due to Windows Firewall or WSL port proxying bugs on port 3306. **Running the backend in WSL as outlined in Step 2 completely bypasses this issue.**

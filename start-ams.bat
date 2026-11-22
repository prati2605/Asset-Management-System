@echo off
title Railway AMS Launcher
echo ===================================================
echo    Railway AMS Full Stack Application Launcher
echo ===================================================
echo.

echo [0/3] Cleaning up any existing processes on ports 8081 and 8082...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8081 " 2^>nul') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8082 " 2^>nul') do (
    taskkill /F /PID %%a >nul 2>&1
)
echo Done.
echo.

echo [1/3] Starting MySQL Database in WSL...
wsl -u root service mysql start
echo MySQL started.
echo.

echo [2/3] Starting Spring Boot Backend (Port 8081 HTTP)...
powershell -Command "Start-Process cmd -ArgumentList '/k title AMS-Backend && cd /d \"%~dp0ams-backend\ams-backend\" && mvn spring-boot:run'"
echo Backend startup initiated in a new window.
echo.

echo [3/3] Starting React Frontend (Port 8082)...
powershell -Command "Start-Process cmd -ArgumentList '/k title AMS-Frontend && cd /d \"%~dp0ams-frontend\" && npm run dev'"
echo Frontend startup initiated in a new window.
echo.

echo ===================================================
echo              All Services Started!
echo ===================================================
echo  - Backend API:   http://localhost:8081
echo  - Frontend UI:   http://localhost:8082
echo  - Health Check:  http://localhost:8081/actuator/health
echo.
echo  NOTE: Backend takes ~30-40 seconds to compile.
echo  Wait for "Started AmsApplication" in its window.
echo.
echo  Login Credentials:
echo    Admin   : admin@railway.com   / Admin@123
echo    Employee: sneha@railway.com   / Admin@123
echo    Viewer  : priya@railway.com   / Admin@123
echo.
echo  Close the AMS-Backend and AMS-Frontend windows to stop.
echo.
pause

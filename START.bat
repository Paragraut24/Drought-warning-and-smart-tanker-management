@echo off
echo ========================================
echo Water Governance Platform Startup
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js: OK

echo Checking MySQL installation...
mysql --version >nul 2>&1
if errorlevel 1 (
    echo WARNING: MySQL command not found in PATH
    echo Make sure MySQL is installed and running
)

echo.
echo ========================================
echo Starting Backend Server...
echo ========================================
start cmd /k "cd backend && npm install && npm start"

timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo Starting Frontend Server...
echo ========================================
start cmd /k "cd frontend && npm install && npm run dev"

echo.
echo ========================================
echo Servers Starting...
echo ========================================
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.
echo Press any key to exit this window...
pause >nul

@echo off
echo.
echo 🚀 JalRakshak AI - Setup and Test Script
echo ========================================
echo.

REM Check if backend dependencies are installed
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    call npm install
    cd ..
) else (
    echo ✅ Backend dependencies already installed
)

REM Check if frontend dependencies are installed
if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
) else (
    echo ✅ Frontend dependencies already installed
)

echo.
echo 🗄️  Testing database connection...
cd backend
node test-connection.js

echo.
echo 🏘️  Checking villages in database...
node test-villages.js
cd ..

echo.
echo ✅ Setup complete!
echo.
echo To start the application:
echo   1. Backend:  cd backend ^&^& npm start
echo   2. Frontend: cd frontend ^&^& npm run dev
echo.
echo Then open: http://localhost:5173
echo.
pause

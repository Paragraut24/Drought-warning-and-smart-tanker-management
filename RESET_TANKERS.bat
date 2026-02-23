@echo off
echo ========================================
echo Reset Tanker Status - JalRakshak AI
echo ========================================
echo.
echo This will reset all tankers to "available" status
echo so they can be allocated again.
echo.
pause
echo.

cd backend
node reset-tankers.js

echo.
echo ========================================
echo Done! You can now use allocation again.
echo ========================================
echo.
pause

@echo off
echo ========================================
echo OD Automation System Setup
echo ========================================
echo.

echo Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo Error installing root dependencies
    pause
    exit /b 1
)

echo Installing client dependencies...
cd client
npm install
if %errorlevel% neq 0 (
    echo Error installing client dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application, run:
echo npm run dev
echo.
echo Then open: http://localhost:3000
echo.
echo Coordinator login: admin123
echo.
pause 
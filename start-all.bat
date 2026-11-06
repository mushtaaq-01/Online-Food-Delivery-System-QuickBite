@echo off
echo ===================================================
echo  Starting Food Delivery System (QuickBite)
echo ===================================================

echo [1/3] Starting Backend Server (Port 4000)...
start "QuickBite Backend (Port 4000)" cmd /k "cd backend && npm run dev"

timeout /t 2 /nobreak >nul

echo [2/3] Starting Admin Dashboard...
start "QuickBite Admin Dashboard" cmd /k "cd admin && npm run dev"

timeout /t 1 /nobreak >nul

echo [3/3] Starting Frontend Website...
start "QuickBite Frontend Website" cmd /k "cd frontend && npm run dev"

echo.
echo All services launched!
echo - Backend API:  http://localhost:4000
echo - Customer App: http://localhost:5173
echo - Admin Panel:  http://localhost:5174 (or as shown in terminal)
echo ===================================================


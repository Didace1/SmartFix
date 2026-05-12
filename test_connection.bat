@echo off
echo ========================================
echo Testing SmartFix Backend Connections
echo ========================================
echo.

echo [1/4] Testing Java Backend (Port 8080)...
curl -s http://localhost:8080/api/sales >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Java Backend is RUNNING
) else (
    echo ✗ Java Backend is NOT RUNNING
    echo    Start it with: cd smartfix ^&^& mvn spring-boot:run
)
echo.

echo [2/4] Testing AI Backend (Port 8000)...
curl -s http://localhost:8000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ AI Backend is RUNNING
) else (
    echo ✗ AI Backend is NOT RUNNING
    echo    Start it with: cd smartfix\AI_BACKEND ^&^& .venv\Scripts\activate ^&^& uvicorn app.main:app --reload --port 8000
)
echo.

echo [3/4] Testing AI-to-Java Connection...
curl -s http://localhost:8000/api/test-connection
echo.

echo [4/4] Testing Frontend (Port 3000)...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Frontend is RUNNING
) else (
    echo ✗ Frontend is NOT RUNNING
    echo    Start it with: cd smartfix-frontend ^&^& npm start
)
echo.

echo ========================================
echo Test Complete
echo ========================================
pause

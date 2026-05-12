@echo off
echo ========================================
echo Pushing Intelligent Corex to GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo Current directory: %CD%
echo.

echo Step 1: Checking git status...
git status
echo.

echo Step 2: Verifying remote URL...
git remote -v
echo.

echo Step 3: Attempting to push to GitHub...
echo This may take a few minutes for large repositories...
echo.

git push origin main --force --progress

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Repository pushed to GitHub
    echo ========================================
    echo.
    echo Visit: https://github.com/Didace1/intelligent_corex
    echo.
) else (
    echo.
    echo ========================================
    echo PUSH FAILED - Error Code: %ERRORLEVEL%
    echo ========================================
    echo.
    echo Possible solutions:
    echo 1. Check your internet connection
    echo 2. Verify GitHub credentials
    echo 3. Try using GitHub Desktop
    echo 4. Check if firewall is blocking git
    echo 5. Try using VPN if behind corporate firewall
    echo.
    echo Alternative: Use GitHub Desktop
    echo - Download from: https://desktop.github.com/
    echo - Add this repository
    echo - Click "Publish repository"
    echo.
)

pause

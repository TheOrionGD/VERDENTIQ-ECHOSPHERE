@echo off
TITLE VerdantIQ Ecosphere - Desktop Launcher (Render Cloud)
COLOR 0A

echo =======================================================================
echo          VerdantIQ Ecosphere - Desktop Application Launcher
echo =======================================================================
echo.
echo Connecting to live production cloud services on Render:
echo   - Web Client:  https://verdantiq-client.onrender.com
echo   - SB Gateway:  https://verdantiq-sb-gateway.onrender.com
echo   - ML Gateway:  https://verdantiq-ml-gateway.onrender.com
echo.
echo =======================================================================

set "ROOT_DIR=%~dp0"
set "ELECTRON_START_URL=https://verdantiq-client.onrender.com"

echo Launching VerdantIQ Desktop Window...
cd /d "%ROOT_DIR%VerdantIQCLIENT"
start "VerdantIQ - Desktop" npx electron .

echo.
echo Desktop window launched successfully!
timeout /t 4 >nul

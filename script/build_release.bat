@echo off
TITLE VerdantIQ Ecosphere - Desktop Release Builder
COLOR 0B

echo =======================================================================
echo          VerdantIQ Ecosphere - Desktop Software Release Builder
echo =======================================================================
echo.

set "CLIENT_DIR=%~dp0VerdantIQCLIENT"

echo [*] Navigating to Frontend/Electron directory: %CLIENT_DIR%
cd /d "%CLIENT_DIR%"

echo [*] Building Electron Desktop Executable binaries via electron-builder...
call npm run electron:build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Build failed with exit code %ERRORLEVEL%.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo =======================================================================
echo  Release Executables Successfully Built!
echo =======================================================================
echo.
echo  Output Location: %CLIENT_DIR%\dist\
echo.
echo  Available Artifacts:
echo    [1] Installer:  VerdantIQCLIENT\dist\VerdantIQ Setup 1.0.1.exe
echo    [2] Portable:   VerdantIQCLIENT\dist\VerdantIQ 1.0.1.exe
echo    [3] Unpacked:   VerdantIQCLIENT\dist\win-unpacked\VerdantIQ.exe
echo.
echo =======================================================================
pause

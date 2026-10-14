@echo off
TITLE VerdantIQ Ecosphere - Standalone Desktop Launcher
COLOR 0A

set "EXE_PATH=%~dp0VerdantIQCLIENT\dist\win-unpacked\VerdantIQ.exe"

if not exist "%EXE_PATH%" (
    echo.
    echo [ERROR] Standalone release executable not found at:
    echo   %EXE_PATH%
    echo.
    echo Please run build_release.bat first to build the executables.
    echo.
    pause
    exit /b 1
)

echo Launching VerdantIQ Ecosphere Desktop App...
start "" "%EXE_PATH%"

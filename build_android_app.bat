@echo off
TITLE VerdantIQ Ecosphere - Android App Builder
COLOR 0A

echo =======================================================================
echo          VerdantIQ Ecosphere - Android Mobile App Builder
echo =======================================================================
echo.

set "PROJECT_ROOT=%~dp0"
set "CLIENT_DIR=%PROJECT_ROOT%VerdantIQCLIENT"
set "ANDROID_DIR=%CLIENT_DIR%\android"

if "%ANDROID_HOME%"=="" (
    if exist "G:\AndroidSdk" (
        set "ANDROID_HOME=G:\AndroidSdk"
        set "ANDROID_SDK_ROOT=G:\AndroidSdk"
        echo [*] Auto-detected Android SDK at: G:\AndroidSdk
    )
)

echo [*] Target Android Project: %ANDROID_DIR%
echo [*] Syncing Capacitor native assets...
cd /d "%CLIENT_DIR%"
call npx cap sync android

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Capacitor sync failed with exit code %ERRORLEVEL%.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [*] Compiling Android Debug and Release APKs via Gradle...
cd /d "%ANDROID_DIR%"
call gradlew.bat assembleDebug assembleRelease

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Gradle build failed with exit code %ERRORLEVEL%.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo =======================================================================
echo  Android Mobile APKs Successfully Built!
echo =======================================================================
echo.
echo  Output Location: %ANDROID_DIR%\app\build\outputs\apk\
echo.
echo  Available Artifacts:
echo    [1] Debug APK:
echo        VerdantIQCLIENT\android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo    [2] Release APK (Unsigned):
echo        VerdantIQCLIENT\android\app\build\outputs\apk\release\app-release-unsigned.apk
echo.
echo  Install directly on connected device/emulator via ADB:
echo    adb install VerdantIQCLIENT\android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo =======================================================================
pause

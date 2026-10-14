@echo off
TITLE VerdantIQ Ecosphere - Production & Development Launcher
COLOR 0A

echo =======================================================================
echo          VerdantIQ Ecosphere - Microservice Launcher (2026)
echo =======================================================================
echo.

set "ROOT_DIR=%~dp0"

echo Select Execution Mode:
echo   [1] Production Mode  (Optimized Build & Workers - Port 3000, 8000, 8080)
echo   [2] Development Mode (Fast Reload & Dev Server - Port 3000, 8000, 8080)
echo.
set /p MODE_CHOICE="Enter choice (1 or 2, default is 1): "

if "%MODE_CHOICE%"=="2" goto DEV_MODE
goto PROD_MODE

:PROD_MODE
echo.
echo =======================================================================
echo  Launching Services in PRODUCTION Mode...
echo =======================================================================
echo [1/3] Launching FastAPI ML Gateway (Prod - Port 8000)...
start "VerdantIQ - ML Gateway [PROD]" cmd /k "cd /d "%ROOT_DIR%VerdantIQServices\ml-gateway" && if exist .venv\Scripts\activate.bat (call .venv\Scripts\activate.bat) && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak >nul

echo [2/3] Launching Spring Boot Core Gateway (Prod Profile - Port 8080)...
start "VerdantIQ - Spring Boot Gateway [PROD]" cmd /k "cd /d "%ROOT_DIR%VerdantIQServices\sb-gateway" && call .\mvnw.cmd spring-boot:run "-Dspring-boot.run.jvmArguments=-Dspring.profiles.active=prod""

timeout /t 3 /nobreak >nul

echo [3/3] Building & Launching Next.js Production Server (Port 3000)...
start "VerdantIQ - Next.js Production Client [PROD]" cmd /k "cd /d "%ROOT_DIR%VerdantIQCLIENT" && npm run build && npm run start"

goto END

:DEV_MODE
echo.
echo =======================================================================
echo  Launching Services in DEVELOPMENT Mode...
echo =======================================================================
echo [1/3] Launching ML Gateway (FastAPI Reload - Port 8000)...
start "VerdantIQ - ML Gateway [DEV]" cmd /k "cd /d "%ROOT_DIR%VerdantIQServices\ml-gateway" && if exist .venv\Scripts\activate.bat (call .venv\Scripts\activate.bat) && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak >nul

echo [2/3] Launching Spring Boot Core Gateway (Local Profile - Port 8080)...
start "VerdantIQ - Spring Boot Gateway [DEV]" cmd /k "cd /d "%ROOT_DIR%VerdantIQServices\sb-gateway" && call .\mvnw.cmd spring-boot:run "-Dspring-boot.run.jvmArguments=-Dspring.profiles.active=local""

timeout /t 3 /nobreak >nul

echo [3/3] Launching Next.js Client (Dev Server - Port 3000)...
start "VerdantIQ - Next.js Client [DEV]" cmd /k "cd /d "%ROOT_DIR%VerdantIQCLIENT" && npm run dev"

:END
echo.
echo =======================================================================
echo  All 3 services initialized in dedicated terminals!
echo.
echo   [1] ML Gateway (FastAPI):        https://verdantiq-ml-gateway.onrender.com (Local: :8000)
echo   [2] Spring Boot Gateway (Java):   https://verdantiq-sb-gateway.onrender.com (Local: :8080)
echo   [3] Frontend Client (Next.js):   https://verdantiq-client.onrender.com     (Local: :3000)
echo =======================================================================
echo.
pause


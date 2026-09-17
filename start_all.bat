@echo off
TITLE VerdantIQ Ecosphere Launcher
COLOR 0A

echo =======================================================================
echo          VerdantIQ Ecosphere - Starting System Microservices
echo =======================================================================
echo.

set "ROOT_DIR=%~dp0"

echo [1/3] Launching ML Gateway (FastAPI - Port 8000)...
start "VerdantIQ - ML Gateway (Port 8000)" cmd /k "cd /d "%ROOT_DIR%VerdantIQServices\ml-gateway" && if exist .venv\Scripts\activate.bat (call .venv\Scripts\activate.bat) && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak >nul

echo [2/3] Launching Spring Boot Core Gateway (Port 8080)...
start "VerdantIQ - Spring Boot Gateway (Port 8080)" cmd /k "cd /d "%ROOT_DIR%VerdantIQServices\sb-gateway" && mvnw.cmd spring-boot:run "-Dspring-boot.run.jvmArguments=-Dspring.profiles.active=local""

timeout /t 3 /nobreak >nul

echo [3/3] Launching Next.js Frontend Client (Port 3000)...
start "VerdantIQ - Next.js Client (Port 3000)" cmd /k "cd /d "%ROOT_DIR%VerdantIQCLIENT" && npm run dev"

echo.
echo =======================================================================
echo  All 3 services successfully launched in separate terminals!
echo   - ML Gateway:       http://localhost:8000/docs
echo   - Spring Gateway:   http://localhost:8080/actuator/health
echo   - Next.js Client:   http://localhost:3000
echo =======================================================================
echo.
pause

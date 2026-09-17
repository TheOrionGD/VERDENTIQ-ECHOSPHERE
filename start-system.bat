@echo off
setlocal

set ROOT_DIR=%~dp0
set ML_GATEWAY_DIR=%ROOT_DIR%VerdantIQServices\ml-gateway
set SB_GATEWAY_DIR=%ROOT_DIR%VerdantIQServices\sb-gateway
set CLIENT_DIR=%ROOT_DIR%VerdantIQCLIENT

cls
echo ===============================================
echo VerdantIQ Full System Startup
echo ===============================================
echo.

if not defined MONGODB_URI (
	echo ERROR: MONGODB_URI is not set in the process environment.
	echo Set MONGODB_URI before running this file.
	exit /b 1
)
if not defined INTERNAL_SERVICE_KEY (
	echo ERROR: INTERNAL_SERVICE_KEY is not set in the process environment.
	echo Set INTERNAL_SERVICE_KEY before running this file.
	exit /b 1
)

echo [1/3] Starting ML Gateway...
start "ML Gateway" cmd /k "cd /d "%ML_GATEWAY_DIR%" && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000"

ping 127.0.0.1 -n 4 > nul

echo [2/3] Starting Spring Boot Gateway...
start "Spring Boot Gateway" cmd /k "cd /d "%SB_GATEWAY_DIR%" && .\mvnw spring-boot:run"

ping 127.0.0.1 -n 4 > nul

echo [3/3] Starting Frontend Client...
start "VerdantIQ Client" cmd /k "cd /d "%CLIENT_DIR%" && npm run dev"

echo.
echo Startup commands launched in separate terminals.
echo.
echo Check these endpoints:
echo   - ML FastAPI: http://localhost:8000/docs
echo   - Gateway:    http://localhost:8080
echo   - Frontend:   http://localhost:3000
echo.
echo If the gateway does not start, verify MongoDB connectivity to the configured Atlas URI.
echo ===============================================
endlocal

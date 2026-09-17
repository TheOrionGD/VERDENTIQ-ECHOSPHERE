# VerdantIQ Ecosphere — Service Local Startup & Operational Guide

This document contains step-by-step execution commands for starting, testing, and validating all microservices in the VerdantIQ Ecosphere platform.

---

## ⚡ 1-Click Launch (All Services in Separate Terminals)

Run `start_all.bat` from the root directory or double-click it in Windows File Explorer:

```cmd
.\start_all.bat
```

This will automatically open 3 separate, labeled terminal windows for:
1. **ML Gateway** (Port 8000 - FastAPI)
2. **Spring Boot Core Gateway** (Port 8080 - Java 17/21)
3. **Frontend Client** (Port 3000 - Next.js 15)

---

## 🟢 1. ML Gateway (FastAPI & AI/ML Solver — Port 8000)

### Run Service:
```powershell
cd o:\PROJECTS\Ecosphere\VerdantIQServices\ml-gateway
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- **Interactive API Documentation**: http://localhost:8000/docs
- **Alternative OpenAPI Specification**: http://localhost:8000/redoc
- **Health Check Endpoint**: http://localhost:8000/health

### Run Test Suite:
```powershell
cd o:\PROJECTS\Ecosphere\VerdantIQServices\ml-gateway
pytest
```

---

## 🔵 2. Spring Boot Core Gateway (Java 17/21 — Port 8080)

### Run Service:
```powershell
cd o:\PROJECTS\Ecosphere\VerdantIQServices\sb-gateway
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.jvmArguments=-Dspring.profiles.active=local"
```

- **Gateway Root URL**: http://localhost:8080
- **Actuator Health Endpoint**: http://localhost:8080/actuator/health
- **SSE Push Stream**: http://localhost:8080/api/v1/notifications/stream

### Run Test Suite:
```powershell
cd o:\PROJECTS\Ecosphere\VerdantIQServices\sb-gateway
.\mvnw.cmd test
```

---

## 🟣 3. Frontend Client (Next.js 15 & React 19 — Port 3000)

### Run Service:
```powershell
cd o:\PROJECTS\Ecosphere\VerdantIQCLIENT
npm run dev
```

- **Application Web UI**: http://localhost:3000
- **Design System Showcase**: http://localhost:3000/design-system

### Validate Types & Build:
```powershell
cd o:\PROJECTS\Ecosphere\VerdantIQCLIENT
npx tsc --noEmit
npm run lint
npm run build
```

---

## 🚀 Quick Full-Stack Launch Order
1. Start **ML Gateway** (Port 8000)
2. Start **Spring Boot Gateway** (Port 8080)
3. Start **Next.js Frontend Client** (Port 3000)

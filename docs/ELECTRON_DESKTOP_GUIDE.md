# VerdantIQ Ecosphere — Electron Desktop Application Guide (2026)

This guide documents the native **Electron Desktop Application** infrastructure for VerdantIQ Ecosphere.

---

## 🚀 Quick Launch Options

### 1. Launch Standalone Release Executable (Production Mode)
Double-click `run_production_app.bat` or run:
```cmd
.\run_production_app.bat
```
This launches `VerdantIQCLIENT\dist\win-unpacked\VerdantIQ.exe` directly connected to the Render production cloud environment (`https://verdantiq-client.onrender.com`).

---

### 2. Launch Desktop Dev Mode (Local Microservices)
Double-click `start_electron_desktop.bat` or run:
```cmd
.\start_electron_desktop.bat
```
This launches all 3 local microservices (ML Gateway, Spring Boot Gateway, Next.js Dev Client) alongside the Electron desktop window loading `http://localhost:3000`.

---

## 🛠️ Build Software Release Executable

To compile and package a new `VerdantIQ.exe` standalone installer/executable:

```cmd
.\build_release.bat
```

Output binaries will be saved in:
- `VerdantIQCLIENT\dist\win-unpacked\VerdantIQ.exe` (Standalone Unpacked Release)
- `VerdantIQCLIENT\dist\VerdantIQ 1.0.1.exe` (Portable Single Executable)

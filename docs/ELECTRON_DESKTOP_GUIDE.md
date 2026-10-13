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

### 2. Launch Desktop App (Render Cloud)
Double-click `start_electron_desktop.bat` or run:
```cmd
.\start_electron_desktop.bat
```
This launches the Electron desktop application directly connected to the Render cloud deployment (`https://verdantiq-client.onrender.com`).

---

## 🛠️ Build Software Release Executable

To compile and package a new `VerdantIQ.exe` standalone installer/executable:

```cmd
.\build_release.bat
```

Output binaries will be saved in:
- `VerdantIQCLIENT\dist\VerdantIQ Setup 1.0.1.exe` (NSIS Full Windows Setup Installer)
- `VerdantIQCLIENT\dist\VerdantIQ 1.0.1.exe` (Portable Single Executable)
- `VerdantIQCLIENT\dist\win-unpacked\VerdantIQ.exe` (Standalone Unpacked Release Binary)
- `VerdantIQCLIENT\dist\VerdantIQ-1.0.1-win.zip` (Portable ZIP Distribution Package)

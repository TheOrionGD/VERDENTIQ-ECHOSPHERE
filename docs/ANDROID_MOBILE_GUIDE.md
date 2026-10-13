# VerdantIQ Ecosphere — Android Mobile Application Guide (2026)

This guide documents the native **Android Mobile Application** infrastructure for VerdantIQ Ecosphere.

---

## 📱 App Overview

- **Application Name**: VerdantIQ Ecosphere Mobile
- **Package ID**: `com.verdantiq.ecosphere`
- **Framework**: Capacitor 7 + Native Android (Gradle 8.11.1 / Android Gradle Plugin 8.7.2)
- **Target SDK**: Android 35 (Android 15)
- **Min SDK**: Android 23 (Android 6.0 Marshmallow)
- **Runtime Architecture**: Native WebView container with offline fallback and real-time synchronization to VerdantIQ Cloud / Microservices.

---

## 📦 Built APK Artifacts

The Android application has been compiled and is ready for installation:

| Build Type | File Path | File Size | Use Case |
|---|---|---|---|
| **Debug APK** | `VerdantIQCLIENT\android\app\build\outputs\apk\debug\app-debug.apk` | **~8.75 MB** | Testing, USB debugging, emulator install |
| **Release APK** | `VerdantIQCLIENT\android\app\build\outputs\apk\release\app-release-unsigned.apk` | **~7.80 MB** | Production distribution (pre-signing) |

---

## 🚀 1-Click Build & Launch

### 1. Build All APKs with Batch Script
Double-click `build_android_app.bat` in the repository root or run from PowerShell/CMD:

```cmd
.\build_android_app.bat
```

This automatically:
1. Detects Android SDK (`ANDROID_HOME` or `G:\AndroidSdk`).
2. Syncs frontend web assets into native Android project.
3. Compiles both `app-debug.apk` and `app-release-unsigned.apk`.

---

### 2. Build via NPM Scripts
From `VerdantIQCLIENT`:

```bash
# Sync web assets to Android
npm run android:sync

# Build Debug APK
npm run android:build

# Build Release APK
npm run android:build:release

# Open in Android Studio
npm run android:open
```

---

### 3. Build via Gradle Directly
From `VerdantIQCLIENT\android`:

```powershell
# Compile debug APK
.\gradlew.bat assembleDebug

# Compile release APK
.\gradlew.bat assembleRelease

# Compile Android App Bundle (.aab) for Google Play
.\gradlew.bat bundleRelease
```

---

## 📲 Installing on Device or Emulator

### Option A: Install via ADB (Command Line)
Connect your Android phone via USB with USB Debugging enabled, or launch an Android Virtual Device (AVD):

```powershell
# Verify connected devices
adb devices

# Install Debug APK
adb install -r "o:\PROJECTS\Ecosphere\VerdantIQCLIENT\android\app\build\outputs\apk\debug\app-debug.apk"
```

### Option B: Direct Device Sideloading
1. Copy `app-debug.apk` to your phone storage (Google Drive, WhatsApp, USB file transfer).
2. Open the file on your device and tap **Install**.
3. Allow "Install unknown apps" if prompted.

---

## 🌐 Cloud & Backend Endpoints

The mobile application is pre-configured in `VerdantIQCLIENT/capacitor.config.ts`:

- **Production Cloud Web URL**: `https://verdantiq-client.onrender.com`
- **Spring Boot API Gateway**: `https://verdantiq-gateway.onrender.com`
- **FastAPI ML Intelligence Gateway**: `https://verdantiq-ml.onrender.com`

### Switching to Local Development
To point the mobile app to your local machine during development:
1. In `VerdantIQCLIENT/capacitor.config.ts`, update `server.url`:
   - For Android Emulator: `http://10.0.2.2:3000`
   - For Physical Device on Wi-Fi: `http://<YOUR_LOCAL_PC_IP>:3000`
2. Run `npm run android:sync`.
3. Rebuild with `npm run android:build`.

---

## 🔐 Signing Release APK for Google Play Store

To sign the release APK for production distribution:

```powershell
# 1. Generate keystore if you don't already have one
keytool -genkey -v -keystore verdantiq-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias verdantiq

# 2. Align the APK
zipalign -v -p 4 app-release-unsigned.apk app-release-aligned.apk

# 3. Sign the APK with apksigner
apksigner sign --ks verdantiq-release.jks --out app-release-signed.apk app-release-aligned.apk
```

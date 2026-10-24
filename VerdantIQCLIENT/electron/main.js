const { app, BrowserWindow, shell, ipcMain, Notification } = require('electron');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

let mainWindow;

function getSystemMetrics() {
  const cpus = os.cpus();
  let totalIdle = 0;
  let totalTick = 0;
  cpus.forEach((cpu) => {
    for (const type in cpu.times) {
      totalTick += cpu.times[type];
    }
    totalIdle += cpu.times.idle;
  });
  const cpuLoad = totalTick > 0 ? ((1 - totalIdle / totalTick) * 100) : 12.5;

  const totalMemMb = Math.round(os.totalmem() / (1024 * 1024));
  const freeMemMb = Math.round(os.freemem() / (1024 * 1024));
  const usedMemMb = totalMemMb - freeMemMb;
  const memoryPercentage = Math.round((usedMemMb / totalMemMb) * 100 * 10) / 10;

  return {
    cpu_usage: Math.round(cpuLoad * 10) / 10,
    total_memory_mb: totalMemMb,
    used_memory_mb: usedMemMb,
    free_memory_mb: freeMemMb,
    memory_percentage: memoryPercentage,
    os_name: `${os.type()} ${os.release()}`,
    os_version: os.release(),
    host_name: os.hostname(),
  };
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    frame: false,
    titleBarStyle: 'hidden',
    title: 'VerdantIQ Ecosphere Desktop',
    icon: path.join(__dirname, 'icon.png'),
    backgroundColor: '#0a0f1d',
    show: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const appUrl = process.env.ELECTRON_START_URL || process.env.APP_URL || 'https://verdantiq-client.onrender.com';

  mainWindow.loadURL(appUrl).catch((err) => {
    console.error('Failed to load initial URL:', err);
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Handle load failures gracefully (e.g. cold start on free hosting, offline, network drops)
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    // Net error -3 is net::ERR_ABORTED (happens when Next.js router cancels previous route or in-flight transitions)
    // isMainFrame === false means it was a subresource/iframe, not the main page
    if (errorCode === -3 || isMainFrame === false) {
      return;
    }
    // Prevent fallback loop if data URI triggered
    if (validatedURL && validatedURL.startsWith('data:')) {
      return;
    }

    console.warn(`Failed to load ${validatedURL}: ${errorDescription} (${errorCode})`);
    const targetRetryUrl = validatedURL || appUrl;
    
    // Fallback HTML page with custom styling & auto-retry
    const fallbackHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>VerdantIQ Ecosphere Desktop</title>
        <style>
          body {
            background-color: #0a0f1d;
            color: #f3f4f6;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            text-align: center;
          }
          .card {
            background: rgba(17, 24, 39, 0.8);
            border: 1px solid rgba(59, 130, 246, 0.2);
            border-radius: 16px;
            padding: 40px;
            max-width: 480px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
          }
          h1 { color: #10b981; margin-bottom: 12px; font-size: 24px; }
          p { color: #9ca3af; line-height: 1.5; margin-bottom: 24px; }
          .btn {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff;
            border: none;
            padding: 12px 28px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            font-size: 14px;
            transition: opacity 0.2s;
          }
          .btn:hover { opacity: 0.9; }
          .subtext { font-size: 12px; color: #6b7280; margin-top: 16px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>VerdantIQ Ecosphere</h1>
          <p>Connecting to Cloud Services...<br>If the server is waking up from a cold start, this may take up to 30 seconds.</p>
          <button class="btn" onclick="window.location.href='${targetRetryUrl}'">Retry Connection</button>
          <div class="subtext">Auto-retrying in 5 seconds...</div>
        </div>
        <script>
          setTimeout(() => {
            window.location.href = '${targetRetryUrl}';
          }, 5000);
        </script>
      </body>
      </html>
    `;
    mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(fallbackHTML));
  });

  // Keep internal app navigation within the electron window, and open external links in browser
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    try {
      const parsedTarget = new URL(navigationUrl);
      const parsedApp = new URL(appUrl);
      const isAppOrigin =
        parsedTarget.origin === parsedApp.origin ||
        parsedTarget.hostname === 'localhost' ||
        parsedTarget.hostname === '127.0.0.1';

      if (!isAppOrigin && (navigationUrl.startsWith('http:') || navigationUrl.startsWith('https:'))) {
        event.preventDefault();
        shell.openExternal(navigationUrl);
      }
    } catch {
      // allow relative/local route navigation
    }
  });

  // Open external links in default web browser, keep in-app links in the electron window
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    try {
      const parsedTarget = new URL(url);
      const parsedApp = new URL(appUrl);
      const isAppOrigin =
        parsedTarget.origin === parsedApp.origin ||
        parsedTarget.hostname === 'localhost' ||
        parsedTarget.hostname === '127.0.0.1';

      if (isAppOrigin) {
        mainWindow.loadURL(url);
        return { action: 'deny' };
      }
    } catch {
      // fallback
    }

    if (url.startsWith('http:') || url.startsWith('https:') || url.startsWith('mailto:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers for native Windows desktop features
ipcMain.handle('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
  return true;
});

ipcMain.handle('window-maximize', () => {
  if (!mainWindow) return false;
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
    return false;
  } else {
    mainWindow.maximize();
    return true;
  }
});

ipcMain.handle('window-is-maximized', () => {
  return mainWindow ? mainWindow.isMaximized() : false;
});

ipcMain.handle('window-close', () => {
  if (mainWindow) mainWindow.close();
  return true;
});

ipcMain.handle('get-system-metrics', async () => {
  return getSystemMetrics();
});

ipcMain.handle('send-notification', async (event, { title, body }) => {
  if (Notification.isSupported()) {
    new Notification({
      title: title || 'VerdantIQ Desktop',
      body: body || '',
      icon: path.join(__dirname, 'icon.png'),
    }).show();
    return true;
  }
  return false;
});

ipcMain.handle('launch-service-stack', async () => {
  try {
    const scriptPath = path.resolve(__dirname, '..', '..', 'script', 'run_services.bat');
    spawn('cmd.exe', ['/c', 'start', '', scriptPath], {
      detached: true,
      stdio: 'ignore',
    }).unref();
    return 'Services launch initiated successfully';
  } catch (err) {
    return `Failed to launch services: ${err.message}`;
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


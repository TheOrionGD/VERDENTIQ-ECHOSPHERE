import { app, BrowserWindow, shell, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'VerdantIQ Ecosphere Desktop',
    icon: path.join(__dirname, 'icon.png'),
    backgroundColor: '#0a0f1d',
    show: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  const startUrl = process.env.ELECTRON_START_URL || (isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, '../dist/index.html')}`);

  mainWindow.loadURL(startUrl).catch((err) => {
    console.error('Failed to load initial URL:', err);
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Handle load failures gracefully with auto-retry
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    if (errorCode === -3 || isMainFrame === false) return;
    if (validatedURL && validatedURL.startsWith('data:')) return;

    console.warn(`Failed to load ${validatedURL}: ${errorDescription} (${errorCode})`);
    const targetRetryUrl = validatedURL || startUrl;

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
            background: rgba(17, 24, 39, 0.85);
            border: 1px solid rgba(16, 185, 129, 0.3);
            border-radius: 16px;
            padding: 40px;
            max-width: 480px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
          }
          h1 { color: #10b981; margin-bottom: 12px; font-size: 22px; font-weight: 700; }
          p { color: #9ca3af; line-height: 1.5; margin-bottom: 24px; font-size: 13px; }
          .btn {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: #ffffff;
            border: none;
            padding: 10px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            font-size: 13px;
          }
          .subtext { font-size: 11px; color: #6b7280; margin-top: 16px; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>VerdantIQ Ecosphere</h1>
          <p>Connecting to Ecosphere Local & Cloud Services...<br>Please ensure the backend server or Vite dev server is running.</p>
          <button class="btn" onclick="window.location.href='${targetRetryUrl}'">Retry Connection</button>
          <div class="subtext">Auto-retrying in 4 seconds...</div>
        </div>
        <script>
          setTimeout(() => {
            window.location.href = '${targetRetryUrl}';
          }, 4000);
        </script>
      </body>
      </html>
    `;
    mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(fallbackHTML));
  });

  // Keep internal app navigation within window, open external links in browser
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    try {
      const parsedTarget = new URL(navigationUrl);
      const isLocal = parsedTarget.hostname === 'localhost' || parsedTarget.hostname === '127.0.0.1';

      if (!isLocal && (navigationUrl.startsWith('http:') || navigationUrl.startsWith('https:'))) {
        event.preventDefault();
        shell.openExternal(navigationUrl);
      }
    } catch {
      // Allow local file routing
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    try {
      const parsedTarget = new URL(url);
      const isLocal = parsedTarget.hostname === 'localhost' || parsedTarget.hostname === '127.0.0.1';

      if (isLocal) {
        mainWindow.loadURL(url);
        return { action: 'deny' };
      }
    } catch {
      // fallback
    }

    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC Handlers
ipcMain.handle('get-app-version', () => app.getVersion());
ipcMain.handle('get-app-path', () => app.getAppPath());

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

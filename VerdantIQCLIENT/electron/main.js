const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

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
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.warn(`Failed to load ${validatedURL}: ${errorDescription} (${errorCode})`);
    
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
          <button class="btn" onclick="window.location.href='${appUrl}'">Retry Connection</button>
          <div class="subtext">Auto-retrying in 5 seconds...</div>
        </div>
        <script>
          setTimeout(() => {
            window.location.href = '${appUrl}';
          }, 5000);
        </script>
      </body>
      </html>
    `;
    mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(fallbackHTML));
  });

  // Open external links in default web browser instead of electron window
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

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

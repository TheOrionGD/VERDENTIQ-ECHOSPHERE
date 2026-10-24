const { contextBridge, ipcRenderer } = require('electron');

// Expose IPC methods to the renderer process for communication with main process
contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,

  // Windows Window Management Controls
  minimizeWindow: () => ipcRenderer.invoke('window-minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window-maximize'),
  isWindowMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  closeWindow: () => ipcRenderer.invoke('window-close'),

  // Hardware Telemetry & Metrics
  getSystemMetrics: () => ipcRenderer.invoke('get-system-metrics'),

  // Native Windows Desktop Notifications
  sendNotification: (title, body) => ipcRenderer.invoke('send-notification', { title, body }),

  // Service Stack Launcher
  launchServiceStack: () => ipcRenderer.invoke('launch-service-stack'),

  // Path utilities
  getConfigPath: () => ipcRenderer.invoke('get-config-path'),
  getDatabasePath: () => ipcRenderer.invoke('get-database-path'),
  getDocumentsPath: () => ipcRenderer.invoke('get-documents-path'),
  getCachePath: () => ipcRenderer.invoke('get-cache-path'),
  getLogsPath: () => ipcRenderer.invoke('get-logs-path'),

  // Send methods
  log: (level, message) => ipcRenderer.send('log', level, message),

  // IPC event listeners
  onUpdateConfig: (callback) => {
    const subscription = (event, config) => callback(config);
    ipcRenderer.on('update-config', subscription);
    return () => ipcRenderer.removeListener('update-config', subscription);
  },

  onLogMessage: (callback) => {
    const subscription = (event, level, message, timestamp) => callback(level, message, timestamp);
    ipcRenderer.on('log-message', subscription);
    return () => ipcRenderer.removeListener('log-message', subscription);
  },
});


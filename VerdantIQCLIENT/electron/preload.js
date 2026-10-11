const { contextBridge, ipcRenderer } = require('electron');

// Expose IPC methods to the renderer process for communication with main process
contextBridge.exposeInMainWorld('electronAPI', {
  // Invoke (synchronous) methods
  getConfigPath: () => ipcRenderer.invoke('get-config-path'),
  getDatabasePath: () => ipcRenderer.invoke('get-database-path'),
  getDocumentsPath: () => ipcRenderer.invoke('get-documents-path'),
  getCachePath: () => ipcRenderer.invoke('get-cache-path'),
  getLogsPath: () => ipcRenderer.invoke('get-logs-path'),

  // Send (asynchronous) methods
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

// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  performSearch: (query) => ipcRenderer.send('perform-search', query),
  receiveSearchResults: (func) => ipcRenderer.on('search-results', (event, ...args) => func(...args)),
});

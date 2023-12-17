// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  performSearch: (query) => ipcRenderer.send('perform-search', query),
  receiveSearchResults: (func) => ipcRenderer.on('search-results', (event, ...args) => func(...args)),
  performTextToSpeech: (query) => ipcRenderer.send('convert-text-to-speech', query),
  receiveTextToSpeechResult: (func) => ipcRenderer.on('tts-response', (event, ...args) => func(...args)),
});



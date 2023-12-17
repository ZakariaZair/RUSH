const { app, BrowserWindow } = require('electron');
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const { ipcMain } = require('electron');
const axios = require('axios');

ipcMain.on('perform-search', async (event, query) => {
  try {
    const response = await axios.get(`https://api.pexels.com/videos/search`, {
      headers: {
        Authorization: 'XUhiKU1hyYJlVG540JuA5iKZ7IIhvbThi55PsxtZDbKrSa9LdG7Um6Ox'
      },
      params: { query: query }
    });
    event.sender.send('search-results', response.data.videos);
  } catch (error) {
    console.error('Search API error:', error);
    event.sender.send('search-results', []);
  }
});

ipcMain.on('convert-text-to-speech', async (event, text) => {
  const options = {
    method: 'POST',
    url: 'https://voicerss-text-to-speech.p.rapidapi.com/',
    params: {
      key: 'aa6a5e93f5874dae81e7e4b350a8f194', // Replace with your API key
      src: text,
      hl: 'en-us',
      v: 'Linda',
      c: 'mp3',
      f: '8khz_8bit_mono'
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': 'f50cd19a15mshba7964e64c809dbp1c895cjsn24f9d7399b75', // Replace with your RapidAPI key
      'X-RapidAPI-Host': 'voicerss-text-to-speech.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    event.reply('tts-response', response.data); // Sends the audio file back to the renderer
  } catch (error) {
    console.error('API request failed:', error);
    event.reply('tts-response', null); // Sends an error response back
  }
});

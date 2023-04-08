require('update-electron-app')()
if(require('electron-squirrel-startup')) return;

const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#2f3241',
      symbolColor: '#74b1be',
      height: 10
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webPreferences: { nodeIntegration : false, devTools: false }
    },
  });

  const handleUrlOpen = (e, url)=>{
    if( url.match(/^http/)){
      e.preventDefault()
      shell.openExternal(url)
    }
  }
  win.webContents.on('will-navigate', handleUrlOpen);
  win.webContents.on('new-window', handleUrlOpen);

  ipcMain.handle('ping', () => 'pong')
  win.setMenuBarVisibility(false);
  win.loadFile('index.html');
};

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
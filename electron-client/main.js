const { app, BrowserWindow, remote } = require('electron');
const path = require('path');

app.commandLine.appendSwitch('--enable-experimental-web-platform-features');
function createWindow () {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    transparent: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
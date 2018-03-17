const { app, Tray, globalShortcut, Menu, BrowserWindow } = require('electron')
const path = require('path')
const URL = require('url')
const createServer = require('./server.js')

const assetsDir = path.join(__dirname, 'assets')
let tray = null
let win = null

app.dock.hide()

app.on('ready', () => {
  createTray()
  registerHotkey()
  authorize()
})

// Prevent app from closing when all windows are closed
app.on('window-all-closed', () => {
  return false
})

createTray = () => {
  tray = new Tray(path.join(assetsDir, 'spotifyIcon.png')) // Icon made by Elegant Themes

  const contextMenu = Menu.buildFromTemplate([
    {label: 'Quit', role: 'quit', accelerator: 'CommandOrControl+Q'}
  ])

  tray.setContextMenu(contextMenu)
}

registerHotkey = () => {
  globalShortcut.register('CommandOrControl+=', () => {
    addSong()
  })
}

addSong = () => {

}

createWindow = () => {
  win = new BrowserWindow({width: 800, height: 600, center: true, minimizable: false, maximizable: false})

  win.on('closed', (event) => {
    win = null
  })
}

async function authorize() {
  await startServer()

  if (!win) {
    createWindow()
  }

  requestAuthUrl = URL.parse('https://accounts.spotify.com/authorize')

  requestAuthUrl.query = {
    'client_id': '5b98cc21e5e7422ea1b631ea53246baa',
    'response_type': 'code',
    'redirect_uri': 'http://127.0.0.1:5070/authorize_callback',
    'scope': 'user-library-modify user-read-currently-playing'
  }

  win.loadURL(require('url').format(requestAuthUrl))
}

startServer = () => {
  app.server = createServer(app)
}

app.closeWindow = () => {
  win.close()
}

app.on('will-quit', () => {
  globalShortcut.unregisterAll() // Unregister all hotkeys
})

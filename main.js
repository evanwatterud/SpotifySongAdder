const { app, Tray, globalShortcut, Menu } = require('electron');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets')
let tray = null

app.dock.hide()

app.on('ready', () => {
  createTray()
  registerHotkey()
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
    console.log('CommandOrControl+= is pressed')
  })
}

app.on('will-quit', () => {
  globalShortcut.unregisterAll() // Unregister all hotkeys
})

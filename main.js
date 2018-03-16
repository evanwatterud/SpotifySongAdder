const { app, Tray, Menu } = require('electron');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets')
let tray = null

app.dock.hide()

app.on('ready', () => {
  tray = new Tray(path.join(assetsDir, 'spotifyIcon.png')) // Icon made by Elegant Themes

  const contextMenu = Menu.buildFromTemplate(
    
  )
})

const { app, Tray, globalShortcut, Menu, BrowserWindow } = require('electron')
const path = require('path')
const URL = require('url')
const createServer = require('./server.js')
var request = require('request')
var keys = require('./keys')

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

async function addSong() {
  if (keys.access_token) {
    await refreshAccessToken()
  } else {
    await refreshAccessToken()
  }

  await getCurrentSong()
}

getCurrentSong = () => {
  request.get('https://api.spotify.com/v1/me/player/currently-playing', {
    'auth': {
      'bearer': keys.access_token
    }
  }, (err, res, body) => {
    jsonBody = JSON.parse(body);
    addCurrentSong(jsonBody.item.id)
  })
}

addCurrentSong = (songId) => {
  request.put('https://api.spotify.com/v1/me/tracks', {
    'auth': {
      'bearer': keys.access_token
    },
    json: true,
    qs: {
      ids: songId
    }
  }, (err, res, body) => {
    if (err) {
      console.log(err);
    }
  })
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

refreshAccessToken = () => {
  return request.post({
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'refresh_token',
      refresh_token: keys.refresh_token,
      client_id: keys.client_id,
      client_secret: keys.client_secret
    }
  }, (err, res, body) => {
    jsonBody = JSON.parse(body);
    keys.access_token = jsonBody.access_token
    return true
  })
}

app.getAccessToken = (code) => {
  request.post({
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'http://127.0.0.1:5070/authorize_callback',
      client_id: keys.client_id,
      client_secret: keys.client_secret
    }
  }, (err, res, body) => {
    jsonBody = JSON.parse(body);
    keys.access_token = jsonBody.access_token
    keys.refresh_token = jsonBody.refresh_token
  })
}

app.closeWindow = () => {
  win.close()
}

app.on('will-quit', () => {
  globalShortcut.unregisterAll() // Unregister all hotkeys
})

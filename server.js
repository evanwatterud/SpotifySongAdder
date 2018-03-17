const express = require('express')
const remote = require('electron').remote

function createServer(app) {
  const server = express()

  server.get('/authorize_callback', (req, res) => {
    if (req.url.error) {
      console.log('Auth Error: ' + req.url.error);
      res.end('Authorization Denied')
      port.close()
    } else {
      res.end('Success')
      app.closeWindow()
      port.close()
    }
  })

  port = server.listen(5070, () => console.log('listening on port 5070'))
}

module.exports = createServer

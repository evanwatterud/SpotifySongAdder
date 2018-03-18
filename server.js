const express = require('express')
const remote = require('electron').remote
const URL = require('url')
var keys = require('./keys.js')

function createServer(app) {
  const server = express()

  server.get('/authorize_callback', (req, res) => {
    parsedReq = URL.parse(req.url, true)
    if (parsedReq.error) {
      console.log('Auth Error: ' + parsedReq.error);
      res.end('Authorization Denied')
      port.close()
    } else {
      handleSuccess(parsedReq.query.code)
    }
  })

  async function handleSuccess(code) {
    keys.code = code
    await app.getAccessToken(keys.code)
    app.closeWindow()
    port.close()
  }

  port = server.listen(5070, () => console.log('listening on port 5070'))
}

module.exports = createServer

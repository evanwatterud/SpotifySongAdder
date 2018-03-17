const express = require('express')

function createServer(app) {
  const server = express()

  server.get('/authorize_callback', (req, res) => {
    console.log('got request');
  })

  server.listen(5070, () => console.log('listening on port 5070'))
}

module.exports = createServer

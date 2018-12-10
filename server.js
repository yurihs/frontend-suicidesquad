const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')

const port = process.env.PORT || 80

var app = express()
app.use('/static', serveStatic(path.join(__dirname, 'dist/static')))

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/static/index.html'))
})

app.listen(port)

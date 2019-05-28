const express = require('express')
const app = express()

const nunjucks = require('nunjucks')

nunjucks.configure('views', {
  autoescape: true,
  express: app
})

app.get('/', (req, res) => {
  res.send('Works')
})

module.exports = app

const express = require('express')
const app = express()

const nunjucks = require('nunjucks')
nunjucks.configure('views', {
  express: app
})

app.get('/', (req, res) => {
  res.render('index.nj')
})

module.exports = app

const express = require('express')
const app = express()

const nunjucks = require('nunjucks')
const config = require('./config')

nunjucks.configure('views', {
  express: app
})

app.get('/', (req, res) => {
  res.render('index.nj', { imageUrl: `${config.bucketUrl}/images` })
})

module.exports = app

const express = require('express')
const app = express()

//Templating
const nunjucks = require('nunjucks')
nunjucks.configure('views', {
  autoescape: true,
  express: app
})
//Middleware
app.use(express.static('./static'))

app.get('/', (req, res) => {
  res.render('home.nj')
})

module.exports = app

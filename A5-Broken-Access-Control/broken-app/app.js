const express = require('express')
const path = require('path')
const nunjucks = require('./nunjucks')

const app = express()

nunjucks({
  express: app
})

app.set('view engine', 'nj')

app.use(express.static(path.join(__dirname, 'static')))

app.get('/', (req, res) => res.render('index'))
app.get('/register', (req, res) => res.render('register'))
app.get('/login', (req, res) => res.render('login'))
app.get('/tables', (req, res) => res.render('tables'))
app.get('/blank', (req, res) => res.render('blank'))
app.get('*', (req, res) => res.render('404'))

module.exports = app

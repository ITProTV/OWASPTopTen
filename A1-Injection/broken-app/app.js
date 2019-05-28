const express = require('express')
const app = express()

//Templating
const nunjucks = require('nunjucks')
nunjucks.configure('views', {
  autoescape: true,
  express: app
})
//Middleware
app.use('/', express.static('./static'))

app.get('/', (req, res) => {
  //TODO: Make this a database call
  const items = require('./data/items.json')
  res.render('home.nj', { items })
})

app.get('/items/:id', (req, res) => {
  //TODO: Make this a database call
  const items = require('./data/items.json')
  const { id } = req.params
  const item = items.find(item => item.id === id)
  res.render('item.nj', { item })
})

app.get('/search', (req, res) => {
  //TODO: Make this a database call
  const rows = require('./data/items.json')
  const query = req.query
  const hasQuery = Object.keys(query).length > 0
  if (hasQuery) {
    let statement = `SELECT * FROM ${query.type}` 
    if(query.filter) {
      statement = `${statement} WHERE ${query.filter}` 
    }
    global.console.log(statement)
    res.render('search.nj', { rows })
  } else {
    res.render('search.nj')
  }
})

module.exports = app

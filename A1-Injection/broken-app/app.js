const express = require('express')
const app = express()

//Templating
const nunjucks = require('nunjucks')
nunjucks.configure('views', {
  autoescape: true,
  express: app
})
//Database
const db = require('./db')({
  host: 'db',
  user: 'owasper',
  password: 'password',
  database: 'things_and_stuff'
})
//Middleware
app.use('/', express.static('./static'))

app.get('/', (req, res, next) => {
  db.query('SELECT * FROM items').then(
    items => res.render('home.nj', { items }),
    err => next(err)
  )
})

app.get('/items/:id', (req, res, next) => {
  const { id } = req.params
  db.query(`SELECT * FROM items WHERE id=${id}`).then(
    item => res.render('item.nj', { item }),
    err => next(err)
  )
})

app.get('/search', (req, res, next) => {
  const query = req.query
  if (query.search) {
    let statement = `SELECT * FROM items item WHERE item.name LIKE '%${
      query.search
    }%'`
    db.query(statement).then(
      rows => {
        res.render('search.nj', { rows })
      },
      err => next(err)
    )
  } else {
    res.render('search.nj')
  }
})

module.exports = app

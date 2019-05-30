const express = require('express')
const app = express()
const db = require('./db')({ directory: 'db' })

//Templating
const nunjucks = require('nunjucks')
nunjucks.configure('views', {
  autoescape: false,
  express: app
})

//Middlewares
const bodyParser = require('body-parser')
app.use(express.static('static'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res, next) => {
  res.render('index.nj')
})
app.get('/posts', (req, res, next) => {
  db.posts.find({}, (err, posts) => {
    if (err) return next(err)
    return res.render('post-list.nj', { posts })
  })
})

app.get('/posts/:id', async (req, res, next) => {
  const { id } = req.params
  db.posts.findOne({ _id: id }, (err, post) => {
    post.body = post.body.split('\n \r')
    const authorId = post.userId
    if (err) return next(err)
    db.users.find(
      { _id: { $in: post.comments.map(c => c.userId) } },
      (err, authors) => {
        if (err) return next(err)
        post.comments.forEach((c, i) => {
          const author = authors.find(a => a._id === c.userId)
          c.author = author
        })
        db.users.findOne({ _id: authorId }, (err, user) => {
          if (err) return next(err)
          post.author = user
          return res.render('post.nj', { post })
        })
      }
    )
  })
})

app.post('/posts/:id/comments', (req, res, next) => {
  const { body } = req.body
  const { id } = req.params
  db.users.find({}, (err, users) => {
    if (err) return next(err)
    const userId = users[Math.floor(Math.random() * users.length)]._id
    db.posts.update(
      { _id: id },
      { $push: { comments: { userId, body } } },
      {},
      (err, ...args) => {
        console.log({ args })
        if (err) return next(err)
        return res.redirect(`/posts/${id}`)
      }
    )
  })
})

module.exports = app

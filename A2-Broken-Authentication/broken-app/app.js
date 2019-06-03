const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const { Strategy: LocalStrategy } = require('passport-local')

const nunjucks = require('nunjucks')

nunjucks.configure('views', {
  express: app
})
const db = require('./db')({
  directory: 'db'
})
const { Users } = require('./utils')
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {}
  })
)
app.use(bodyParser.urlencoded({ extended: true }))

passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    (email, password, done) => {
      db.users.findOne({ email }, (err, user) => {
        if (err) return done(err)
        if (!user) return done(null, false, { message: 'Incorrect username.' })
        if (!Users.verifyPassword(user, password))
          return done(null, false, { message: 'Incorrect password.' })
        return done(null, user)
      })
    }
  )
)
//Middlewares

app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((user, done) => done(null, user._id))
passport.deserializeUser((id, done) =>
  db.users.findOne({ _id: id }, (err, user) => done(err, user))
)
app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})

//Routes
app.get('/', (req, res) => res.render('index.nj'))
app.get('/secrets', (req, res) => {
  if (req.isAuthenticated()) return res.render('secrets.nj')
  return res.redirect('/login')
})
app.get('/signup', (req, res) => res.render('signup.nj'))
app.get('/login', (req, res) => res.render('login.nj'))
app.post('/signup', async (req, res) => {
  const { email, password } = req.body
  const user = Users.create(email, password)
  try {
    await Users.save(user)
    res.redirect('/login')
  } catch (error) {
    res.redirect('/signup')
  }
})
app.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/secrets'
  })
)
app.get('/logout', (req, res) => {
  if(req.session) req.session.destroy()
  res.redirect('/')
})

module.exports = app

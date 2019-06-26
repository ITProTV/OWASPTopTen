const express = require('express')
const app = express()
const path = require('path')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const { Strategy: LocalStrategy } = require('passport-local')
const db = require('./db')({
  directory: 'db'
})
const { Users } = require('./utils')
const routes = require('./routes')
const nunjucks = require('./nunjucks')
nunjucks({ express: app  })

app.set('view engine', 'nj')
app.use(express.static(path.join(__dirname, 'static')))
// app.use(helmet())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {}
  })
)

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
app.use(bodyParser.urlencoded({ extended: true }))
app.use(helmet())

passport.serializeUser((user, done) => done(null, user._id))
passport.deserializeUser((id, done) =>
  db.users.findOne({ _id: id }, (err, user) => done(err, user))
)

app.post('/signup', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = Users.create(email, password)
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
    successRedirect: '/'
  })
)

app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})
app.get('/', (req, res, next) => res.render('index'))
app.get('/logout', (req, res) => {
  if (req.session) req.session.destroy()
  res.redirect('/')
})
routes.forEach(route =>
  app[route.method](route.path, (req, res) =>
    res.render(route.template, route.data ? route.data(req) : {})
  )
)

module.exports = app

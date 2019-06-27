const express = require('express')
const path = require('path')
const nunjucks = require('./nunjucks')
const helmet = require('helmet')
const logger = require('morgan')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const { Strategy: LocalStrategy } = require('passport-local')
const { pbkdf2Sync, randomBytes } = require('crypto')
const methodOverride = require('method-override')

const db = require('./db')

const app = express()

nunjucks({
  express: app
})

app.set('view engine', 'nj')

app.use(express.static(path.join(__dirname, 'static')))
app.use(helmet())
app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  session({
    secret: 'awesome super secret session secret',
    resave: false,
    saveUninitialized: true,
    cookie: {}
  })
)
app.use(
  methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      var method = req.body._method
      delete req.body._method
      return method
    }
  })
)
passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    (email, password, done) => {
      db('users')
        .where({ email })
        .first()
        .then(
          user => {
            if (!user)
              return done(null, false, { message: 'Incorrect username.' })
            const { salt, hash } = user
            const attempt = pbkdf2Sync(
              password,
              salt,
              10000,
              256,
              'sha256'
            ).toString('hex')
            if (attempt !== hash)
              return done(null, false, { message: 'Incorrect password.' })
            return done(null, user)
          },
          err => done(err)
        )
    }
  )
)
app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) =>
  db('users')
    .join('roles', function() {
      this.on('users.id', '=', 'roles.user_id')
    })
    .where({ 'users.id': id })
    .select('users.*', db.ref('roles.type').as('role'))
    .first()
    .then(user => done(null, user), err => done(err))
)
app.use((req, res, next) => {
  const { user } = req
  res.locals.user = user
    ? {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        email: user.email
      }
    : null
  next()
})

app.get('/', (req, res) => res.render('index'))
app.get('/register', (req, res) => res.render('register'))
app.post('/register', (req, res, next) => {
  const {
    email,
    password,
    'first-name': first_name,
    'last-name': last_name
  } = req.body
  const salt = randomBytes(16).toString('hex')
  const hash = pbkdf2Sync(password, salt, 10000, 256, 'sha256').toString('hex')
  db('users')
    .insert({
      email,
      first_name,
      last_name,
      salt,
      hash
    })
    .then(([user_id]) => {
      return db('roles').insert({ type: 'user', user_id })
    })
    .then(
      roles => {
        res.redirect('/login')
      },
      err => next(err)
    )
})
app.get('/login', (req, res) => res.render('login'))
app.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/users'
  })
)
app.get('/logout', (req, res) => {
  if (req.session) req.session.destroy()
  res.redirect('/')
})
app.get('/users', (req, res, next) => {
  db('users')
    .join('roles', function() {
      this.on('users.id', '=', 'roles.user_id')
    })
    .select('*', db.ref('type').as('role'))
    .then(users => res.render('users', { users }), err => next(err))
})
app.get('/modify/:userId', (req, res, next) => {
  db('users')
    .where({ 'users.id': req.params.userId })
    .join('roles', function() {
      this.on('users.id', '=', 'roles.user_id')
    })
    .select('*', db.ref('type').as('role'))
    .first()
    .then(
      account => {
        res.render('modify', { account })
      },
      err => next(err)
    )
})
app.put('/modify/:userId', (req, res, next) => {
  const { body } = req
  const user = db('users').where({ 'users.id': req.params.userId })
  const userRole = db('roles').where({ 'roles.user_id': req.params.userId })
  if (body['first-name']) user.update({ first_name: body['first-name'] })
  if (body['last-name']) user.update({ last_name: body['last-name'] })
  if (body['email']) user.update({ email: body['email'] })
  if (body['role']) userRole.update({ type: body['role'] })
  Promise.all([user, userRole]).then(
    ([user, role]) => {
      res.redirect(`/modify/${req.params.userId}`)
    },
    err => next(err)
  )
})
app.get('*', (req, res) => res.render('404'))

app.use(function errorHandler(err, req, res, next) {
  console.log({ err })
  res.render('error')
})

module.exports = app

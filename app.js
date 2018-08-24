'use strict'

// dependencies import
require('dotenv').config();
let path = require('path')
let express = require('express')
let bodyParser = require('body-parser')
let methodOverride = require('method-override')
let expressSession = require('express-session')
let expressValidator = require('express-validator')
let passport = require('passport')
let flash = require('connect-flash')

// middlewares import
let auth = require('./middlewares/auth')

// routes import
let usersRouter = require('./routes/users')
let studentsRouter = require('./routes/students')
let apiRouter = require('./routes/api')

const app = express()

// view setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// middlewares
app.use(expressSession({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(expressValidator());
app.use(methodOverride('_method'))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

// middlewares
app.use((req, res, next) => {
  res.locals.info = 'some info'
  next()
})

// dashboard
app.get('/', auth.isLoggedIn, (req, res) => {
  console.log(req.isAuthenticated())
  console.log(req.session.passport)
  res.render('dashboard/dashboard')
})

// other routes
app.use('/users', usersRouter)
app.use('/students', studentsRouter)
app.use('/api', apiRouter)

// not found routes
app.get('*', auth.isLoggedIn, (req, res) => {
  res.send('404 not found')
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log()
  console.log(`App listening on port ${PORT}`)
  console.log('Press CTRL+C to exit.')
  console.log()
})

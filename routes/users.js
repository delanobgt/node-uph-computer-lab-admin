let express = require('express')
let router = express.Router()
let bcrypt = require('bcrypt')
let passport = require('passport')
let LocalStrategy = require('passport-local').Strategy

let db = require('../models/index')

passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser((user, done) => {
  done(null, user)
})
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      let foundUser = await db.User.findOne({ where: {email} })
      if (!foundUser) done(null, false)
      else if (bcrypt.compareSync(password, foundUser.password)) done(null, foundUser)
      else done(null, false)
    } catch (err) {
      done(null, false)
      throw err
    }
  }
))

router.get('/login', (req, res) => {
  res.render('users/login')
})
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/new', (req, res) => {
  res.render('users/register')
})
router.post('/new', async(req, res) => {
  let username = req.body.username
  let email = req.body.email
  let password = req.body.password
  let confirmPassword = req.body.confirmPassword
  
  try {
    let hashedPassword = await bcrypt.hash(password, parseInt(process.env.USER_SALT_ROUNDS))
    let createdUser = await db.User.create({ username, email, password:hashedPassword })
    req.login(createdUser.dataValues, (err) => {
      res.redirect('/')
    })
  } catch (err) {
    res.redirect('back')
    throw err
  }
})

module.exports = router

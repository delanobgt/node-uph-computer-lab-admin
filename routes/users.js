let express = require('express')
let router = express.Router()
let bcrypt = require('bcrypt')
let passport = require('passport')
let LocalStrategy = require('passport-local').Strategy

let db = require('../models/index')

// middlewares import
let auth = require('../middlewares/auth')

passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser((user, done) => {
  done(null, user)
})
passport.use(new LocalStrategy({
    usernameField: 'login_email',
    passwordField: 'login_password'
  },
  async (email, password, done) => {
    console.log('start')
    try {
      let foundUser = await db.User.findOne({ where: {email} })
      if (!foundUser) done(null, false)
      else if (bcrypt.compareSync(password, foundUser.password)) done(null, foundUser.dataValues)
      else done(null, false)
      console.log('udah')
    } catch (err) {
      done(null, false)
      console.log(err)
    }
  }
))

router.get('/auth', (req, res) => {
  res.render('users/auth')
})
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/auth'
}))
router.post('/new', async(req, res) => {
  let username = req.body.username
  let email = req.body.email
  let password = req.body.password
  let confirmPassword = req.body.confirmPassword
  
  try {
    let foundToken = await db.UserToken.findOne({
      where: {token: req.body.token}
    })
    if (!foundToken) {
      req.flash('tokenError', 'Token Invalid')
      return res.redirect('/users/auth')
    }

    let hashedPassword = await bcrypt.hash(password, parseInt(process.env.USER_SALT_ROUNDS))
    let createdUser = await db.User.create(
      { username, email, password: hashedPassword, privilege: 'ADMIN;STUDENTS_VIEW;STUDENTS_MODIFY;LABRECORDS_VIEW;DASHBOARD_VIEW' })
    await foundToken.destroy()
    req.login(createdUser.dataValues, (err) => {
      res.redirect('/')
    })
  } catch (err) {
    res.redirect('back')
    console.log(err)
  }
})
router.get('/logout', async (req, res) => {
  req.logout()
  req.session.destroy()
  res.redirect('/users/auth')
})

router.get('/profile', auth.isLoggedIn, async (req, res) => {
  console.log(req.session.passport.user)
  res.render('users/profile', {user: req.session.passport.user})
})

router.get('/admin', auth.havePermission('ADMIN'), async (req, res) => {
  let tokens, mappedTokens
  try {
    tokens = await db.UserToken.findAll()
    mappedTokens = 
      tokens
        .map(token => token.dataValues)
        .map(token => token.token)
  } catch (err) {
    console.log(err)
  } finally {
    res.render('users/admin', {tokens: mappedTokens || []})
  }
})

router.get('/api', auth.havePermission('ADMIN'), async (req, res) => {
try {
let users = await db.User.findAll()
let mappedUsers = 
  users
    .map(user => user.dataValues)
    .map(user => {
      return { username: user.username, email: user.email, privilege: user.privilege }
    })
    res.json(mappedUsers)
  } catch (err) {
    console.log(err)
    res.status(404).json({ msg: 'Cannot get Users data' })
  }
})

router.delete('/api/:username', auth.havePermission('ADMIN'), async (req, res) => {
  try {
    await db.User.destroy({
      where: { username: req.params.username }
    })
    res.json({success: true})
  } catch (err) {
    console.log(err)
    res.status(404).json({ msg: 'Failed to delete' })
  }
})

router.put('/api/:username/privilege', auth.havePermission('ADMIN'), async (req, res) => {
  try {
    let user = await db.User.findOne({
        where: { username: req.params.username }
      })
    await user.set('privilege', req.body.privilege)
    await user.save()
    res.json({
      username: user.dataValues.username,
      email: user.dataValues.email,
      privilege: user.dataValues.privilege
    })
  } catch (err) {
    console.log(err)
    res.status(404).json({ msg: 'Privilege update failed' })
  }
})

router.put('/api/:username/password', auth.isLoggedIn, async (req, res) => {
  try {
    let user = await db.User.findOne({
        where: { username: req.params.username }
      })
    let hashedPassword = await bcrypt.hash(req.body.password, parseInt(process.env.USER_SALT_ROUNDS))
    await user.set('password', hashedPassword)
    await user.save()
    res.json({
      username: user.dataValues.username,
      email: user.dataValues.email,
      privilege: user.dataValues.privilege
    })
  } catch (err) {
    console.log(err)
    res.status(404).json({ msg: 'Password update failed' })
  }
})

module.exports = router

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
      console.log(err)
    }
  }
))

router.get('/auth', (req, res) => {
  res.render('users/auth')
})
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))
router.post('/new', async(req, res) => {
  let username = req.body.username
  let email = req.body.email
  let password = req.body.password
  let confirmPassword = req.body.confirmPassword
  
  try {
    let hashedPassword = await bcrypt.hash(password, parseInt(process.env.USER_SALT_ROUNDS))
    let createdUser = await db.User.create({ username, email, password: hashedPassword })
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
  // console.log(req.isAuthenticated())
  // console.log(req.session.passport)
})

router.get('/profile', async (req, res) => {
  console.log(req.session.passport.user)
  res.render('users/profile', {user: req.session.passport.user})
})

router.get('/admin', async (req, res) => {
  res.render('users/admin')
})

router.get('/api', async (req, res) => {
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

router.delete('/api/:username', async (req, res) => {
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

router.put('/api/:username/privilege', async (req, res) => {
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

router.put('/api/:username/password', async (req, res) => {
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

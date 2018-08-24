'use strict'

// dependencies import
let express = require('express')
let router = express.Router()

// middlewares import
let auth = require('../middlewares/auth')

router.get('/', auth.isLoggedIn, (req, res) => {
  res.render('students/view');
})

router.get('/datatable', (req, res) => {
  res.render('students/datatable');
})

module.exports = router

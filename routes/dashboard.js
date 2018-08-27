'use strict'

// dependencies import
let express = require('express')
let router = express.Router()
let db = require('../models/index')

// middlewares import
let auth = require('../middlewares/auth')

router.get('/', auth.havePermission('DASHBOARD_VIEW'), (req, res) => {
  res.render('dashboard/dashboard')
})

module.exports = router

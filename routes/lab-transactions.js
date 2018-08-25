'use strict'

// dependencies import
let express = require('express')
let router = express.Router()
let db = require('../models/index')

// middlewares import
let auth = require('../middlewares/auth')

router.get('/', auth.isLoggedIn, (req, res) => {
  res.render('lab-transactions/view');
})

router.get('/api', async (req, res) => {
  try {
    let labTransactions = await db.LabTransaction.findAll({
      include: [{
        model: db.Student,
        include: [{
          model: db.StudyProgram,
          required: true
        }],
        required: true
      }]
    })
    res.json(labTransactions)
  } catch (err) {
    console.log(err)
    res.status(404).json({ msg: 'Cannot get Lab Transactions data' })
  }
})

module.exports = router

'use strict'

// dependencies import
let express = require('express')
let router = express.Router()
let db = require('../models/index')
let Sequelize = require('sequelize')
let Op = Sequelize.Op;

// middlewares import
let auth = require('../middlewares/auth')

router.get('/', auth.isLoggedIn, (req, res) => {
  res.render('lab-transactions/view');
})

router.get('/api', async (req, res) => {
  try {
    if (!req.query.startDate || !req.query.endDate) throw new Error()
    let startDate = new Date(req.query.startDate)
    let endDate = new Date(req.query.endDate)
    let labTransactions = await db.LabTransaction.findAll({
      include: [{
        model: db.Student,
        include: [{
          model: db.StudyProgram,
          required: true
        }],
        required: true
      }],
      where : {
        sign_in: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        }
      }
    })
    res.json(labTransactions)
  } catch (err) {
    console.log(err)
    res.status(404).json({ msg: 'Cannot get Lab Transactions data' })
  }
})

module.exports = router

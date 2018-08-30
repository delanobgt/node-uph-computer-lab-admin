'use strict'

// dependencies import
let express = require('express')
let moment = require('moment')
let Sequelize = require('sequelize')
let Op = Sequelize.Op;
let router = express.Router()
let db = require('../models/index')


// middlewares import
let auth = require('../middlewares/auth')

router.get('/', auth.havePermission('LABRECORDS_VIEW'), (req, res) => {
  res.render('lab-transactions/view');
})

router.get('/api', auth.havePermission('LABRECORDS_VIEW'), async (req, res) => {
  try {
    if (!req.query.startDate || !req.query.endDate) throw new Error()
    let startDate = new Date(req.query.startDate)
    let endDate = moment(req.query.endDate).add(1, 'days').toDate()
    console.log(startDate, endDate)
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

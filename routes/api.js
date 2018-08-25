'use strict'

// dependencies import
let express = require('express')
let router = express.Router()
let db = require('../models/index')

// middlewares import
let auth = require('../middlewares/auth')

router.get('/study-programs', async (req, res) => {
  try {
    let studyPrograms = await db.StudyProgram.findAll()
    res.json(studyPrograms)
  } catch (err) {
    console.log(err)
    res.status(404).json({ msg: 'Cannot get Study Programs data' })
  }
})

module.exports = router
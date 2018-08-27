'use strict'

// dependencies import
let express = require('express')
let router = express.Router()
let db = require('../models/index')

// middlewares import
let auth = require('../middlewares/auth')

router.get('/study-programs', auth.havePermission('STUDENTS_VIEW', 'STUDENTS_MODIFY'), async (req, res) => {
  try {
    let studyPrograms = await db.StudyProgram.findAll()
    res.json(studyPrograms)
  } catch (err) {
    console.log(err)
    res.status(404).json({ msg: 'Cannot get Study Programs data' })
  }
})

router.post('/tokens', auth.havePermission('ADMIN'), async (req, res) => {
  try {
    let token = await db.UserToken.create({
      token: req.body.token
    })
    console.log(token)
    res.json(token)
  } catch (err) {
    console.log(err)
    res.status(404).json({ msg: 'Error/Duplicate token' })
  }
})
router.delete('/tokens/:token', auth.havePermission('ADMIN'), async (req, res) => {
  try {
    await db.UserToken.destroy({
      where: { token: req.params.token }
    })
    res.json({success: true})
  } catch (err) {
    console.log(err)
    res.status(404).json({ msg: 'Failed to delete' })
  }
})

module.exports = router
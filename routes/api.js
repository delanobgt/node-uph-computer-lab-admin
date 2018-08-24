'use strict'

// dependencies import
let express = require('express')
let router = express.Router()
let db = require('../models/index')

// middlewares import
let auth = require('../middlewares/auth')

router.get('/students', async (req, res) => {
  try {
    let students = await db.Student.findAll({
      include: [{
        model: db.StudyProgram,
        required: true
      }]
    })
    res.json(students)
  } catch (err) {
    console.log(err)
    res.status(404).json({ msg: 'Cannot get Students data' })
  }
})

router.put('/students/:studentID', async (req, res) => {
  try {
    let newStudyProgram = await db.StudyProgram.findOne({
        where: { name: req.body.newStudyProgram }
      })
    let student = await db.Student.findOne({
        where: { student_id: req.params.studentID }
      })
    await student.set('student_id', req.body.newStudentID)
    await student.set('name', req.body.newName)
    await student.set('study_program_id', newStudyProgram.dataValues.id)
    await student.save()
    res.json({student})
  } catch (err) {
    console.log(err)
    res.status(404).json({ msg: 'Error/Duplicate data' })
  }
})

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
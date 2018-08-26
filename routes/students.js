'use strict'

// dependencies import
let express = require('express')
let router = express.Router()
let db = require('../models/index')

// middlewares import
let auth = require('../middlewares/auth')

router.get('/', auth.isLoggedIn, (req, res) => {
  res.render('students/view');
})

router.get('/api', async (req, res) => {
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

router.post('/api', async (req, res) => {
  try {
    let studyProgram = await db.StudyProgram.findOne({
      where: { name: req.body.studyProgram }
    })
    let student = await db.Student.create({
      student_id: req.body.studentID,
      name: req.body.name,
      study_program_id: studyProgram.id
    })
    res.json(student)
  } catch (err) {
    console.log(err)
    res.status(404).json({ msg: 'Error/Duplicate Student' })
  }
})

router.put('/api/:studentID', async (req, res) => {
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

router.delete('/api/:studentID', async (req, res) => {
  try {
    await db.Student.destroy({
      where: { student_id: req.params.studentID }
    })
    res.json({success: true})
  } catch (err) {
    console.log(err)
    res.status(404).json({ msg: 'Failed to delete' })
  }
})

module.exports = router

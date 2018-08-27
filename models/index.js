let Sequelize = require('sequelize')

let sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  operatorsAliases: false,
  define: {
    timestamps: false
  }
})

const User = require('./user')(sequelize)
const UserToken = require('./user-tokens')(sequelize)
const Student = require('./student')(sequelize)
const LabTransaction = require('./lab-transaction')(sequelize)
const StudyProgram = require('./study-program')(sequelize)

Student.belongsTo(StudyProgram, {foreignKey: 'study_program_id', targetKey: 'id'})
LabTransaction.belongsTo(Student, {foreignKey: 'student_id', targetKey: 'id'})

sequelize.sync({
  logging: console.log
})

module.exports = {
  User,
  UserToken,
  Student,
  LabTransaction,
  StudyProgram
}
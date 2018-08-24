let Sequelize = require('sequelize');

let model = function (sequelize) {
  return sequelize.define('student', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true
    },
    student_id: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    study_program_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  })
}

module.exports = model
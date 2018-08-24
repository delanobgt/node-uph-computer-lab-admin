let Sequelize = require('sequelize');

let model = function (sequelize) {
  return sequelize.define('study_program', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
  })
}

module.exports = model
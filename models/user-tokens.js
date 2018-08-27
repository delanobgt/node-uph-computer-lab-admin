let Sequelize = require('sequelize');

let model = function (sequelize) {
  return sequelize.define('user_token', {
    token: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true
    }
  })
}

module.exports = model
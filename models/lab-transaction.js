let Sequelize = require('sequelize');

let model = function (sequelize) {
  return sequelize.define('lab_transaction', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true
    },
    student_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    sign_in: {
      type: Sequelize.DATE,
      allowNull: false
    },
    sign_out: {
      type: Sequelize.DATE,
      allowNull: false
    },
    pc_number: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    lab_location: {
      type: Sequelize.DataTypes.ENUM('LP503', 'AD101', 'AD106', 'RMH_IRVIN'),
      allowNull: false
    }
  })
}

module.exports = model
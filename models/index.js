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

sequelize.sync({
  logging: console.log
})
  
module.exports = {
  User
}
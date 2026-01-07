const { Sequelize } = require('sequelize');
const env = require('./env');

const sequelize = new Sequelize(
  env.db.database,
  env.db.user,
  env.db.password,
  {
    host: env.db.host,
    dialect: 'mysql',
    logging: console.log
  }
);

sequelize.authenticate()
  .then(() => console.log('✅ MySQL connected'))
  .catch(err => console.error('❌ MySQL connection error:', err));

module.exports = sequelize;

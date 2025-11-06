require('dotenv').config();

module.exports = {
  development: {
    username: 'postgres',
    password: 'postgres',
    database: 'manlib',
    host: 'localhost',
    dialect: 'postgres'
  },
  test: {
    username: 'postgres',
    password: 'postgres',
    database: 'manlib',
    host: 'localhost',
    dialect: 'postgres'
  },
  production: {
    username: 'postgres',
    password: 'postgres',
    database: 'manlib',
    host: 'localhost',
    dialect: 'postgres'
  }
};
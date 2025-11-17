// module.exports = {
//   development: {
//     use_env_variable: 'DATABASE_URL',
//     dialect: 'postgres',
//     logging: false
//   },
//   test: {
//     use_env_variable: 'DATABASE_TEST_URL',
//     dialect: 'postgres',
//     logging: false
//   },
//   production: {
//     use_env_variable: 'DATABASE_URL',
//     dialect: 'postgres',
//     logging: false
//   }
// };
import 'dotenv/config';

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false
  },
  test: {
    url: process.env.DATABASE_TEST_URL,
    dialect: 'postgres',
  },
  production: {
    url: process.env.HOSTED_DATABASE_URL,
    dialect: 'postgres',
  },
};
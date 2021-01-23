module.exports = {
  mail: {
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '',
      pass: ''
    }
  },
  mailFrom: 'Test Molecule <test@molecule.com>',
  database: {
    username: 'dbUser',
    password: 'dbPassword',
    host: '127.0.0.1',
    port: '3306',
    dialect: 'mysql',
    database: 'dbDatabase',
  },
  jwtKey: '4c395ac11092015d47872642262b800c'
};

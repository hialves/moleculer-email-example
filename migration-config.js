require('dotenv').config()

const environment = process.env.NODE_ENV || 'local';
const dbConfig = require('./env.config').database;
module.exports = { [environment]: dbConfig };

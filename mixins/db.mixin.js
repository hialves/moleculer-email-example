'use strict';

const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");

const dbConfig = require('../env.config').database;

module.exports = {
  mixins: [DbService],
  adapter: new SqlAdapter(dbConfig.database, dbConfig.username, dbConfig.password, {
    dialect: 'mysql',
    host: dbConfig.host,
    port: dbConfig.port,
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
  }),
}
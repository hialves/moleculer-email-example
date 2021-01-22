"use strict";

const bcrypt = require('bcryptjs');
const Db = require("../mixins/db.mixin");
const Sequelize = require('sequelize');

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
	name: "user-repo",

  mixins: [Db],
  
  model: {
    name: 'user',
    define: {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
    }
  },

	settings: {
		fields: [
			"id",
			"name",
      "email",
      "password",
    ],
    entityValidator: {
      name: "string",
      email: "string",
      password: "string"
		}
	},

	hooks: {
    before: {
      create: ['hashPassword']
    },
    after: {
      '*': ['removePassword']
    }
  },

	actions: {},

	methods: {
		async hashPassword(ctx) {
      ctx.params.password = await bcrypt.hash(ctx.params.password, 10)
    },
    removePassword(ctx, res) {
      if (res.rows) {
        res.rows.forEach(u => delete u.password)
      } else if(Array.isArray(res)) {
        res.map(u => delete u.password)
      } else {
        delete res.password
      }

      return res
    }
	},

	async afterConnected() {}
};

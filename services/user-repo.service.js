'use strict';

const bcrypt = require('bcryptjs');

const Db = require('../mixins/db.mixin');
const UserMixin = require('../mixins/user.mixin')

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
	name: 'user-repo',

  mixins: [Db, UserMixin],

	settings: {
		fields: [
			'id',
			'name',
      'email',
      'password'
    ],
    entityValidator: {
      name: 'string',
      email: 'string',
      password: 'string'
    },
    routes: [{
      path: 'user-repo',
      authorization: true
    }]
	},

	hooks: {
    before: {
      create: ['hashPassword']
    },
    after: {

    }
  },

  actions: {

  },
  
  events: {},

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

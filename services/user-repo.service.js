'use strict';

const bcrypt = require('bcryptjs');

const Db = require('../mixins/db.mixin');
const UserMixin = require('../mixins/user.mixin');
const { UNAUTHORIZED_ACTION } = require('../utils/user-repo.error');
const { createUserError } = require('../core/error.builder');

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
	},

	hooks: {
    before: {
      create: ['hashPassword'],
      update: ['validateIdOwner', 'addUpdateTimestamp'],
      remove: ['validateIdOwner']
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
    },
    addUpdateTimestamp(ctx) {
      ctx.params.updatedAt = new Date()
    },
    validateIdOwner(ctx) {
      if(ctx.meta.user.id !== Number(ctx.params.id)) {
        const error = createUserError('You do not own that user', 403, UNAUTHORIZED_ACTION)

        throw error
      }
    }
	},

  async afterConnected() {},
  
  async entityCreated(json, ctx) {
    this.logger.info("Entity created, sending mail!");
    
    await ctx.call('mail.sendMailRegistration', { userId: json.id })
  },
};

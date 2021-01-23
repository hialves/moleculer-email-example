'use strict';

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const Db = require('../mixins/db.mixin');
const { jwtKey } = require('../env.config');
const { createAuthError } = require('../core/error.builder');
const AuthErrors = require('../utils/auth.error')

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
	name: 'auth',

  mixins: [],

	settings: {
		fields: [
			'id',
			'name',
      'email',
      'token'
    ],
	},

	hooks: {},

  actions: {
    userLogin: {
      params: {
        email: 'string',
        password: 'string'
      },
      async handler(ctx) {
        const user = await ctx.call('user-repo.findOne', { query: { email: ctx.params.password }, limit: 1 })

        if (user && await bcrypt.compare(ctx.params.password, user.password)) {
          return { ...user, token: jwt.sign({ id: user.id }, jwtKey, {
            // 1 hour
            expiresIn: 60 * 60,
          } )}
        } else {
          const error = createAuthError('Email or password invalid', 401, AuthErrors.INVALID_CREDENTIALS)

          throw error
        }
      }
    },
    resolveToken: {
      params: {
        token: 'string',
      },
      async handler(ctx) {
        const decoded = jwt.verify(token, jwtKey)
        const user = await ctx.call('user-repo.get', { id: decoded.id })

        return user
      }
    }
  },
  
  events: {},

	methods: {

  },

	async afterConnected() {}
};

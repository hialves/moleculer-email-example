'use strict';

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { MoleculerError } = require('moleculer').Errors;

const { jwtKey } = require('../env.config');
const { createAuthError } = require('../core/error.builder');
const AuthErrors = require('../utils/auth.error');
const Sequelize = require('sequelize');



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
      rest: 'POST /userLogin', 
      params: {
        email: 'email',
        password: { type: 'string', min: 8 }
      },
      async handler(ctx) {
        try {
          let user = await ctx.call('user-repo.find', { query: { email: ctx.params.email }, limit: 1 })
          user = user[0] || null
          
          if (user && await bcrypt.compare(ctx.params.password, user.password)) {
            return { ...user, token: jwt.sign({ id: user.id }, jwtKey, {
              // 1 hour
              expiresIn: 60 * 60,
            } )}
          } else {
            const error = createAuthError('Email or password invalid', 401, AuthErrors.INVALID_CREDENTIALS)

            throw error
          }
        } catch(err) {
          this.logger.error(err.message)

          throw new MoleculerError(err.message)
        }
      }
    },
    resolveToken: {
      rest: 'POST /resolveToken', 
      params: {
        token: 'string',
      },
      async handler(ctx) {
        try {
          const decoded = jwt.verify(ctx.params.token, jwtKey)
          const user = await ctx.call('user-repo.get', { id: decoded.id })

          return user
        } catch(err) {
          this.logger.error(err.message)

          const code = err.message === 'jwt expired' ? 401 : 500

          throw new MoleculerError(err.message, code, 'INVALID_TOKEN')
        }
      }
    },
    registerUser: {
      rest: 'POST /registerUser',
      params: {
        name: 'string',
        email: 'email',
        password: { type: 'string', min: 8 }
      },
      async handler(ctx) {
        try {
          const user = await ctx.call('user-repo.create', { ...ctx.params })

          return user
        } catch(err) {
          this.logger.error(err.message)
          if(err.errors && err.errors.length > 0 && err.errors[0] instanceof Sequelize.ValidationErrorItem) {
            throw new MoleculerError(err.errors[0].message, 409, 'DB_VALIDATION_ERROR')
          } else {
            throw new MoleculerError(err.message)
          }
        }
      }
    }
  },
  
  events: {},

	methods: {

  },

	async afterConnected() {}
};

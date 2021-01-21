"use strict";

const userData = require('../data/user.json')
const { MoleculerError } = require('moleculer').Errors;
const userRepoErrors = require('../utils/user-repo.error')
const ErrorBuilder = require('../core/error.builder')

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "user-repo",
	// version: 1

	/**
	 * Mixins
	 */
	mixins: [],

	/**
	 * Settings
	 */
	settings: {
		// Available fields in the responses
		fields: [
			"_id",
			"name",
			"email",
		],
	},

	/**
	 * Action Hooks
	 */
	hooks: {},

	/**
	 * Actions
	 */
	actions: {
		getById: {
			params: {
				id: "string",
			},
			async handler(ctx) {
        try{
          const { id } = ctx.params
          const user = userData.find(u => u._id === ctx.params.id)

          if(user) {
            this.logger.info('[user-repo] user found', user)
            
            return user
          }else {
            const error = ErrorBuilder.createUserError(
              `Entity not found with specified id: ${id}`, 
              404, 
              userRepoErrors.NOT_FOUND
            )
            
            throw error
          }
        } catch (err) {
          throw new MoleculerError(err.message)
        }
			}
		},
	},

	/**
	 * Methods
	 */
	methods: {
		/**
		 * Loading sample data to the collection.
		 * It is called in the DB.mixin after the database
		 * connection establishing & the collection is empty.
		 */
	},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected() {
		// await this.adapter.collection.createIndex({ name: 1 });
	}
};

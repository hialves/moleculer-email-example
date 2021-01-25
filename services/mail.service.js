"use strict";

const mailFrom = require('../env.config').mailFrom
const { MoleculerError } = require('moleculer').Errors;
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "mail",

	/**
	 * Settings
	 */
	settings: {

	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {

		/**
		 * Send mail for registered user
		 *
		 * @returns
		 */
		sendMailRegistration: {
			params: {
        userId: "number|string"
      },
      rest: 'POST /sendMailRegistration',
			async handler(ctx) {
        try {
          const { userId } = ctx.params
          const user = await ctx.call('user-repo.get', { id: userId })

          const mailData = {
            from: mailFrom,
            to: `${user.name} <${user.email}>`,
            subject: 'Test Molecule Registration',
            html: `Welcome ${user.name}, please confirm your registration...`,
          }

          await ctx.call('mail-sender.send', { ...mailData });
        } catch(err) {
          this.logger.error(err.message)

          throw new MoleculerError(err.message)
        }
			}
		},
	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {

	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};

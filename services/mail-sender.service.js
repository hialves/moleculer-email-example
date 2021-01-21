"use strict";
const { MoleculerError } = require('moleculer').Errors;

const nodemailer = require('nodemailer')
const mailConfig = require('../env.config').mail

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "mail-sender",

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

	},

	/**
	 * Events
	 */
	events: {
    'mail.send': {
      params: {
        from: 'string',
        to: 'string',
        subject: 'string',
        html: 'string'
      }, 
      async handler(ctx) {
        const { from, to, subject, html } = ctx.params
        try{
          const transport = nodemailer.createTransport(mailConfig)

          const result = await transport.sendMail({
            from,
            to,
            subject,
            html
          })

          this.logger.info(`[mail-sender] email sent to ${to} with subject ${subject}`)

          return Promise.resolve(true)
        } catch (err) {
          throw new MoleculerError(err.message)
        }
      }
    }
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

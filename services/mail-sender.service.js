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
    send: {
      params: {
        from: 'string',
        to: 'string',
        subject: 'string',
        html: 'string'
      }, 
      rest: 'POST /send',
      async handler(ctx) {
        const { from, to, subject, html } = ctx.params
        try{
          const transport = nodemailer.createTransport(mailConfig)

          await transport.sendMail({
            from,
            to,
            subject,
            html
          })

          this.logger.info(`[mail-sender] email sent to ${to} with subject ${subject}`)

          return Promise.resolve(true)
        } catch (err) {
          this.logger.error(err.message)

          throw new MoleculerError(err.message)
        }
      }
    }
	},

	events: {
    
	},

	methods: {

	},

	created() {

	},

	async started() {

	},

	async stopped() {

	}
};

"use strict";

const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const PostMixin = require('../mixins/post.mixin')
const Db = require("../mixins/db.mixin");
const Sequelize = require('sequelize');

const dbConfig = require('../env.config').database;
const ErrorBuilder = require("../core/error.builder");
const PostErrors = require('../utils/post-repo.error')

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
	name: "post-repo",

  mixins: [Db, PostMixin],

	settings: {
		fields: [
			"id",
			"title",
      "description",
      "userId",
      "createdAt",
      "updatedAt"
    ],
    entityValidator: {
      title: "string",
      description: "string",
      userId: "number"
    },
    populate: {
      "userId": {
        action: "post-repo.find",
        field: "userId",
        
        params: {
          fields: ["id", "name", "email"]
        }
      }
    }
	},

	hooks: {},

	actions: {

	},

	methods: {},

	async afterConnected() {}
};

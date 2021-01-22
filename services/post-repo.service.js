"use strict";

const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
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

  //mixins: [Db],
  mixins: [DbService],
  adapter: new SqlAdapter(dbConfig.database, dbConfig.username, dbConfig.password, {
    dialect: 'mysql',
    host: dbConfig.host,
    port: dbConfig.port,
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
  }),

  model: {
    name: 'post',
    define: {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
      }
    }
  },

	settings: {
		fields: [
			"id",
			"title",
      "description",
      "userId"
    ],
    entityValidator: {
      title: "string",
      description: "string",
      userId: "number"
    },
    populates: {
      user: {
        field: "userId",
        action: "*",
        params: {
          fields: "id name email"
        }
      }
    }
	},

	hooks: {},

	actions: {
		findByUserId: {
      params: {
        userId: 'number'
      },
      async handler(ctx) {
        const posts = await this.adapter.findOne({
          where: { userId: ctx.params.userId },
          populate: ['user']
        })

        if(posts) {
          return posts.toJSON()
        }

        const error = ErrorBuilder.createPostError(`Post not found with userId ${ctx.params.userId}`, 404, PostErrors.NOT_FOUND)
        throw error
      }
    }
	},

	methods: {},

	async afterConnected() {}
};

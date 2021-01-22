"use strict";

const Db = require('../mixins/db.mixin');
const PostMixin = require('../mixins/post.mixin')

const ErrorBuilder = require('../core/error.builder');
const PostErrors = require('../utils/post-repo.error')

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
	name: "post",

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
    populates: {
      "user": {
        action: "user-repo.get",
        field: "userId",
        
        params: {
          fields: 'id name email'
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
        const posts = await this.adapter.find({search: ctx.params.userId, searchFields: ["userId"], populate: ["user"]})

        return posts.map(post => post.toJSON())
      }
    }
	},

	methods: {},

	async afterConnected() {}
};

/*
const posts = await this.adapter.findOne({
  where: { userId: ctx.params.userId },
  populate: ['user']
})

console.log(this.model)

if(posts) {
  return posts.toJSON()
}

const error = ErrorBuilder.createPostError(`Post not found with userId ${ctx.params.userId}`, 404, PostErrors.NOT_FOUND)
throw error
*/

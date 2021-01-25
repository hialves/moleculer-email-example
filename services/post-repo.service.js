'use strict';

const PostMixin = require('../mixins/post.mixin')
const Db = require('../mixins/db.mixin');

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
module.exports = {
	name: 'post-repo',

  mixins: [Db, PostMixin],

	settings: {
		fields: [
			'id',
			'title',
      'description',
      'userId',
      'createdAt',
      'updatedAt'
    ],
    entityValidator: {
      title: 'string',
      description: 'string',
      userId: 'number'
    },
    populates: {
      'user': {
        action: 'user-repo.get',
        field: 'userId',
        
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
        try {
          const posts = await this.adapter.find({search: ctx.params.userId, searchFields: ['userId'], populate: ['user']})

          return posts.map(post => post.toJSON())
        } catch(err) {
          this.logger.error(err.message)

          throw new MoleculerError(err.message)
        }
      }
    },
	},

	methods: {},

	async afterConnected() {}
};

'use strict';
const {
  Model
} = require('sequelize');
const user = require('./user');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.user, { foreignKey: 'userId' })
    }
  };
  Post.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: user,
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'post',
    tableName: 'posts'
  });
  return Post;
};
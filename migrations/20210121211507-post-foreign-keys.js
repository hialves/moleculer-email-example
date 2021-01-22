'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('post', 'userId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('post', 'userId')
  }
};

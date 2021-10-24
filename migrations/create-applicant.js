"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("applicant", {
      applicantId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      postId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
            model: 'posts',
            key: 'postId',
          },
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
            model: 'users',
            key: 'userId',
          },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("applicant");
  },
};

"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Chat", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      room: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      chat: {
        type: Sequelize.STRING,
      },
      user:{
        type: Sequelize.STRING,
        allowNull: false,
      },
      gif:{
        type: Sequelize.STRING,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Chat");
  },
};

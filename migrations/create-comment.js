"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("comments", {
      commentid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      comment: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lunchid: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "lunchs",
          key: "lunchid",
        },
        onDelete: "cascade",
      },
      userid: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "userid",
        },
        onDelete: "cascade",
      },
      time: {
        allowNull: false,
        type: Sequelize.STRING,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("comments");
  },
};

"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("bookmarks", {
      bookmarkid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      lunchid: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "lunchs",
          key: "lunchid",
        },
      },
      userid: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "userid",
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("bookmarks");
  },
};

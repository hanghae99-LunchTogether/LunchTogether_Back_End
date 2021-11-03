"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("lunchs", {
      lunchid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userid: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
            model: 'users',
            key: 'userid',
          },
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      content: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      date: {
        type: Sequelize.STRING,
      },
      time:{
        type: Sequelize.STRING,
      },
      location: {
        type: Sequelize.INTEGER,
        references: {
          model: 'lunchdata',
          key: 'id',
        },
      },
      membernum: {
        type: Sequelize.STRING,
      },
      // duration: {
      //   type: Sequelize.INTEGER,
      // },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("lunchs");
  },
};

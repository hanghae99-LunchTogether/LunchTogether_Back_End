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
        type: Sequelize.TEXT,
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
      duration: {
        type: Sequelize.INTEGER,
      },
      confirmed:{
        type: Sequelize.BOOLEAN,
      },
      private:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      bk_num: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
        validate: {
          max: 999,
          min: 0,
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("lunchs");
  },
};

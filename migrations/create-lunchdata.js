"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("lunchdata", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      address_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      road_address_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category_group_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      place_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      place_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      x: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      y: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      lunchreview :{
        type: Sequelize.STRING,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("lunchdata");
  },
};

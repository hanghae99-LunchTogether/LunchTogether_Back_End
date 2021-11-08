"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      userid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nickname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      salt: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING,
      },
      mbti: {
        type: Sequelize.STRING,
      },
      gender: {
        type: Sequelize.STRING,
      },
      introduction: {
        type: Sequelize.STRING,
      },
      location: {
        type: Sequelize.STRING,
        references: {
          model: 'locationdata',
          key: 'id',
        },
      },
      likemenu: {
        type: Sequelize.STRING,
      },
      dislikemenu: {
        type: Sequelize.STRING,
      },
      company: {
        type: Sequelize.STRING,
      },
      mannerstatus: {
        type: Sequelize.INTEGER,
      },
      snsurl: {
        type: Sequelize.STRING,
      },
      job:{
        type: Sequelize.STRING,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("users");
  },
};

"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      userId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pw: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nickName: {
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

      },
      menu: {
        type: Sequelize.STRING,

      },
      company: {
        type: Sequelize.STRING,

      },
      mannerStatus: {
        type: Sequelize.STRING,

      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("users");
  },
};

"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("applicant", {
      applicantid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      lunchid: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
            model: 'lunchs',
            key: 'lunchid',
          },
      },
      userid: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
            model: 'users',
            key: 'userid',
          },
      },
      status:{
        allowNull: false,
        type: Sequelize.STRING,
      },
      statusdesc: {
        allowNull: false,
        type: Sequelize.BOOLEAN, 
      },
      comments:{
        allowNull: false,
        type: Sequelize.STRING,
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("applicant");
  },
};

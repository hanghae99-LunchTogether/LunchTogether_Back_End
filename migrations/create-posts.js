"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("posts", {
      postId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'userId',
          },
      },
      content: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      date: {
        type: DataTypes.STRING,
      },
      location: {
        type: DataTypes.STRING,
      },
      usersNum: {
        type: DataTypes.STRING,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("posts");
  },
};

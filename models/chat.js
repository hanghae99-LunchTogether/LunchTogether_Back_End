"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  chat.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        required: true,
      },
      chat:{
        type: DataTypes.STRING,
      },
      user:{
        type: DataTypes.STRING,
        required: true,
      },
      gif :{
        type: DataTypes.STRING,
      }
    },
    {
      sequelize,
      modelName: "chat",
    }
  );

  chat.associate = function (models) {
   
  };
  return chat;
};

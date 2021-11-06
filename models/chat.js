"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Chat.init(
    {
      id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        required: true,
      },
      room: {
        type: DataTypes.INTEGER,
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
      modelName: "Chat",
    }
  );

  Chat.associate = function (models) {
   
  };
  return Chat;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Room.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        required: true,
      },
      title:{
        type: DataTypes.STRING,
        required: true,
      },
      max:{
        type: DataTypes.INTEGER,
        required: true,
      },
      owner:{
        type: DataTypes.STRING,
        required: true,
      },
      password:{
          type : DataTypes.STRING,
      }
    },
    {
      sequelize,
      modelName: "Room",
    }
  );

  Room.associate = function (models) {
   
  };
  return Room;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class notice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  notice.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        required: true,
      },
      userid: {
        type: DataTypes.INTEGER,
        required: true,
      },
      kind: {
        required: true,
        type: DataTypes.STRING,
      },
      message: {
        required: true,
        type: DataTypes.STRING,
      },
      nickname: {
        require: true,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "notice"
    }
  );
  return notice;
};

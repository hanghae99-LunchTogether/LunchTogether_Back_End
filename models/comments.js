"use strict";
const { truncateSync } = require("fs");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  comments.init(
    {
      commentid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        required: true,
      },
      comment: {
        type: DataTypes.STRING,
        required: true,
      },
      lunchid: {
        required: true,
        type: DataTypes.INTEGER,
      },
      userid: {
        required: true,
        type: DataTypes.INTEGER,
      },
      time: {
        require: true,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "comments",

    }
  );

  comments.associate = function (models) {
    models.comments.belongsTo(models.users, {
      foreignKey: "userid",
      onDelete: "cascade",
    });
    models.comments.belongsTo(models.lunchs, {
      foreignKey: "lunchid",
      onDelete: "cascade",
    });
  };
  return comments;
};

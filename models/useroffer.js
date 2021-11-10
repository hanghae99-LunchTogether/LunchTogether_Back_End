"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class useroffer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  useroffer.init(
    {
      userofferid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
      confirmed: {
        require: false,
        type: DataTypes.BOOLEAN,
      },
      comments: {
        require: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "useroffer",
    }
  );

  useroffer.associate = function (models) {
    models.useroffer.belongsTo(models.lunchs, {
      foreignKey: "lunchid",
      onDelete: "cascade",
    });
    models.useroffer.belongsTo(models.users, {
      foreignKey: "userid",
      onDelete: "cascade",
    });
  };
  return useroffer;
};

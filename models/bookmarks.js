"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class bookmarks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  bookmarks.init(
    {
      bookmarkid: {
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
    },
    {
      sequelize,
      modelName: "bookmarks",
    }
  );

  bookmarks.associate = function (models) {
    models.bookmarks.belongsTo(models.lunchs, {
      foreignKey: "lunchid",
      onDelete: "cascade",
    });
    models.bookmarks.belongsTo(models.users, {
      foreignKey: "userid",
      onDelete: "cascade",
    });
  };
  return bookmarks;
};

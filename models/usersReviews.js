"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class usersReviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // define association here
    }
  }
  usersReviews.init(
    {
      reviewid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        required: true,
      },
      userid: {
        type: DataTypes.INTEGER,
        require: true,
      },
      lunchid: {
        type: DataTypes.INTEGER,
        require: true,
      },
      targetusers: {
        type: DataTypes.INTEGER,
        require: true,
      },
      spoon: {
        type: DataTypes.INTEGER,
        require: true,
      },
      comments: {
        type: DataTypes.STRING,
        require: false,
      },
    },
    {
      sequelize,
      modelName: "usersReviews",
    }
  );
  usersReviews.associate = function (models) {
    models.usersReviews.belongsTo(models.users, {
      as: "rater",
      foreignKey: "userid",
      onDelete: "cascade",
    });
    models.usersReviews.belongsTo(models.lunchs, {
      foreignKey: "lunchid",
      onDelete: "cascade",
    });
    models.usersReviews.belongsTo(models.users, {
      as: "target",
      foreignKey: "targetusers",
      targetKey: "userid",
      onDelete: "cascade",
    });
  };
  return usersReviews;
};

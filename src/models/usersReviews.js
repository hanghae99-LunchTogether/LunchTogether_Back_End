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
      reviewerId: {
        type: DataTypes.INTEGER,
        require: true,
      },
      lunchid: {
        type: DataTypes.INTEGER,
        require: true,
      },
      targetUserId: {
        type: DataTypes.INTEGER,
        require: true,
      },
      spoon: {
        type: DataTypes.INTEGER,
        require: true,
      },
      comment: {
        type: DataTypes.STRING,
        require: false,
      },
    },
    {
      sequelize,
      modelName: "usersReviews",
      logging: false
    }
  );
  usersReviews.associate = function (models) {
    models.usersReviews.belongsTo(models.users, {
      as: "reviewer",
      foreignKey: "reviewerId",
      targetKey: "userid",
      onDelete: "cascade",
    });
    models.usersReviews.belongsTo(models.lunchs, {
      foreignKey: "lunchid",
      onDelete: "cascade",
    });
    models.usersReviews.belongsTo(models.users, {
      as: "targetUser",
      foreignKey: "targetUserId",
      targetKey: "userid",
      onDelete: "cascade",
    });
  };
  return usersReviews;
};

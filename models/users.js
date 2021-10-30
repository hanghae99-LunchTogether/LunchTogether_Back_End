"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // define association here
    }
  }
  users.init(
    {
      userid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        required: true,
      },
      username: {
        type: DataTypes.STRING,
        require: true,
      },
      email: {
        type: DataTypes.STRING,
        require: true,
      },
      password: {
        type: DataTypes.STRING,
        require: true,
      },
      nickname: {
        type: DataTypes.STRING,
        require: true,
      },
      salt: {
        type: DataTypes.STRING,
        require: true,
      },
      image: {
        type: DataTypes.STRING,
        require: false,
      },
      mbti: {
        type: DataTypes.STRING,
        require: false,
      },
      gender: {
        type: DataTypes.STRING,
        require: false,
      },
      introduction: {
        type: DataTypes.STRING,
        require: false,
      },
      location: {
        type: DataTypes.STRING,
        require: false,
      },
      menu: {
        type: DataTypes.STRING,
        require: false,
      },
      company: {
        type: DataTypes.STRING,
        require: false,
      },
      mannerStatus: {
        type: DataTypes.STRING,
        require: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        require: false,
      },
    },

    {
      sequelize,
      modelName: "users",
      timestamps: false,
    }
  );
  users.associate = function (models) {
    models.users.hasMany(models.applicant, {
      foreignKey: "userid",
      sourceKey: "userid",
    });
    models.users.hasMany(models.comments, {
      foreignKey: "userid",
      sourceKey: "userid",
    });
    models.users.hasMany(models.usersReviews, {
      foreignKey: "userid",
      sourceKey: "userid",
    });
    models.users.hasMany(models.lunchs, {
      foreignKey: "userid",
      sourceKey: "userid",
    });
    models.users.hasMany(models.usersReviews, {
      foreignKey: "targetusers",
      sourceKey: "userid",
    });
  };
  return users;
};

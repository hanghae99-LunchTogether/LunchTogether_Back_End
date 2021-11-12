"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class lunchs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  lunchs.init(
    {
      lunchid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        required: true,
      },
      userid: {
        required: true,
        type: DataTypes.INTEGER,
      },
      title: {
        required: true,
        type: DataTypes.STRING,
      },
      content: {
        required: true,
        type: DataTypes.TEXT,
      },
      date: {
        type: DataTypes.STRING,
        required: false,
      },
      time: {
        type: DataTypes.STRING,
        required: false,
      },
      location: {
        type: DataTypes.INTEGER,
        required: false,
      },
      membernum: {
        type: DataTypes.STRING,
        required: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        required: false,
      },
      confirmed: {
        type: DataTypes.BOOLEAN,
        required: false,
      },
      private: {
        type: DataTypes.BOOLEAN,
        required: true,
      },
      bk_num: {
        type: DataTypes.INTEGER,
        required: true,
        default: 0,
        validate: {
          max: 999,
          min: 0,
        },
      },
    },
    {
      sequelize,
      modelName: "lunchs",
    }
  );

  lunchs.associate = function (models) {
    //posts모델 안에 "postsId라는 컬럼 이름"으로 comments모델에 있는 "postId값"을 새로운 컬럼으로 추가한다. offered
    models.lunchs.hasMany(models.comments, {
      foreignKey: "lunchid",
      sourceKey: "lunchid",
    });
    models.lunchs.hasMany(models.applicant, {
      foreignKey: "lunchid",
      sourceKey: "lunchid",
    });
    models.lunchs.hasMany(models.useroffer, {
      foreignKey: "lunchid",
      sourceKey: "lunchid",
    });
    models.lunchs.belongsTo(models.lunchdata, {
      as: "locations",
      foreignKey: "location",
      targetKey: "id",
      onDelete: "cascade",
    });
    models.lunchs.belongsTo(models.users, {
      as: "host",
      foreignKey: "userid",
      onDelete: "cascade",
    });
    models.lunchs.hasMany(models.bookmarks, {
      foreignKey: "lunchid",
      onDelete: "cascade",
    });
  };
  return lunchs;
};

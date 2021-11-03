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
        type: DataTypes.STRING,
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
      // duration: {
      //   type: DataTypes.INTEGER,
      //   required: false,
      // },
    },
    {
      sequelize,
      modelName: "lunchs",
      timestamps: false,
    }
  );

  lunchs.associate = function (models) {
    //posts모델 안에 "postsId라는 컬럼 이름"으로 comments모델에 있는 "postId값"을 새로운 컬럼으로 추가한다.
    models.lunchs.hasMany(models.comments, {
      foreignKey: "lunchid",
      sourceKey: "lunchid",
    });
    models.lunchs.hasMany(models.applicant, {
      foreignKey: "lunchid",
      sourceKey: "lunchid",
    });
    models.lunchs.belongsTo(models.lunchdata, {
      foreignKey: "location",
      targetKey: "id",
      onDelete: "cascade",
    });
    models.lunchs.belongsTo(models.users, {
      foreignKey: "userid",
      onDelete: "cascade",
    });
  };
  return lunchs;
};

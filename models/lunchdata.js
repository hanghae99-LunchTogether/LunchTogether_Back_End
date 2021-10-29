"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class lunchdata extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // define association here
    }
  }
  lunchdata.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        required: true,
      },
      addressname: {
        type: DataTypes.STRING,
        require: true,
      },
      roadaddressname: {
        type: DataTypes.STRING,
        require: true,
      },
      categoryname: {
        type: DataTypes.STRING,
        require: true,
      },
      placename: {
        type: DataTypes.STRING,
        require: true,
      },
      placeurl: {
        type: DataTypes.STRING,
        require: true,
      },
      phonenumber: {
        type: DataTypes.STRING,
        require: false,
      },
      x: {
        type: DataTypes.STRING,
        require: false,
      },
      y: {
        type: DataTypes.STRING,
        require: false,
      },
    },

    {
      sequelize,
      modelName: "lunchdata",
      timestamps: false,
    }
  );
  lunchdata.associate = function (models) {
    models.lunchdata.hasMany(models.lunchs, {
      foreignKey: "location",
      sourceKey: "id",
      onDelete: "cascade",
    });
  };
  return lunchdata;
};

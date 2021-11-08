"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class locationdata extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // define association here
    }
  }
  locationdata.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        required: true,
      },
      address_name: {
        type: DataTypes.STRING,
        require: true,
      },
      road_address_name: {
        type: DataTypes.STRING,
        require: true,
      },
      category_group_name: {
        type: DataTypes.STRING,
        require: true,
      },
      place_name: {
        type: DataTypes.STRING,
        require: true,
      },
      place_url: {
        type: DataTypes.STRING,
        require: true,
      },
      phone: {
        type: DataTypes.STRING,
        require: false,
      },
      x: {
        type: DataTypes.DOUBLE,
        require: false,
      },
      y: {
        type: DataTypes.DOUBLE,
        require: false,
      },
      lunchreview :{
        type: DataTypes.STRING,
        require: false,
      }
    },
    {
      sequelize,
      modelName: "locationdata",

    }
  );
  locationdata.associate = function (models) {
    models.locationdata.hasMany(models.users, {
        foreignKey: "location", 
        sourceKey: "id", 
        onDelete: "cascade"
    });
  };
  return locationdata;
};

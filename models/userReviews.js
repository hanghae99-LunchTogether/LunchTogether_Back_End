'use strict';
const { Model } = require('sequelize');
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
      reviewsId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        required: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        require: true,
      },
      targetUsers: {
        type: DataTypes.INTEGER,
        require: true,
      },
      stars: {
        type: DataTypes.STRING,
        require: true,
      },
      comments:{
        type: DataTypes.STRING,
        require: false,
      }
    },
    {
      sequelize,
      modelName: 'usersReviews',
      timestamps: false,
    }
  );
  usersReviews.associate = function (models) {
    models.usersReviews.belongsTo(models.users, {
      foreignKey: 'userId',
      onDelete: 'cascade',
    });
  };
  return usersReviews;
};

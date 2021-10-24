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
        type: DataTypes.STRING,
        require: true,
      },
      targetUsers: {
        type: DataTypes.STRING,
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
      modelName: 'users',
      timestamps: false,
    }
  );
//   users.associate = function (models) {
//     models.users.hasMany(models.posts, {
//       foreignKey: 'userId',
//       sourceKey: 'userId',
//     });
//     models.users.hasMany(models.likes, {
//       foreignKey: 'userId',
//       sourceKey: 'userId',
//     });
//   };
  return usersReviews;
};

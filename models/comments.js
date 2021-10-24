'use strict';
const { truncateSync } = require('fs');
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  comments.init(
    {
      commentId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        required: true,
      },
      comment: {
        type: DataTypes.STRING,
        required: true,
      },
      postId: {
        required: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        required: true,
        type: DataTypes.INTEGER,
      },
      date:{
          require: true,
          type: DataTypes.STRING,
      }
    },
    {
      sequelize,
      modelName: 'comments',
      timestamps: false,
    }
  );

//   comments.associate = function (models) {
//     models.comments.belongsTo(models.posts, {
//       foreignKey: 'postId',
//       onDelete: 'cascade',
//     });
//     models.comments.belongsTo(models.users, {
//       foreignKey: 'userId',
//       onDelete: 'cascade',
//     });
//   };
  return comments;
};

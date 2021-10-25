'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class applicant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  applicant.init(
    {
      applicantId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
      approval: {
        require: true,
        type: DataTypes.BOOLEAN, 
      }
    },
    {
      sequelize,
      modelName: "applicant",
      timestamps: false,
    }
  );

  applicant.associate = function (models) {
    models.applicant.belongsTo(models.posts, {
      foreignKey: 'postId',
      onDelete: 'cascade',
    });
    models.applicant.belongsTo(models.users, {
      foreignKey: 'userId',
      onDelete: 'cascade',
    });
  };
  return applicant;
};

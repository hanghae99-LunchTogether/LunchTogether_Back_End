'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  posts.init(
    {
      postId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        required: true,
      },
      userId: {
        required: true,
        type: DataTypes.INTEGER,
      },
      content: {
        required: true,
        type: DataTypes.STRING,
      },
      date: {
        type: DataTypes.STRING,
      },
      location: {
        type: DataTypes.STRING,
      },
      usersNum: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,

      modelName: 'posts',
      timestamps: false,
    }
  );

//   posts.associate = function (models) {
//     //posts모델 안에 "postsId라는 컬럼 이름"으로 comments모델에 있는 "postId값"을 새로운 컬럼으로 추가한다.
//     models.posts.hasMany(models.comments, {
//       foreignKey: 'postId',
//       sourceKey: 'postId',
//     });
//     models.posts.hasMany(models.likes, {
//       foreignKey: 'postId',
//       sourceKey: 'postId',
//     });
//     models.posts.belongsTo(models.users, {
//       foreignKey: 'userId',
//       sourceKey: 'userId',
//     });
//   };
  return posts;
};

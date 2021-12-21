import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface UserAttributes {
  userid: number;
  kakaoid: string;
  email: string;
  password: string;
  nickname: number;
  salt: number;
  image?: string;
  mbti?: string;
  introduction?: string;
  location?: string;
  likemenu?: string;
  dislikemenu?: string;
  mannerStatus?: number;
  snsurl?: string;
  job?: string;
}
export interface UserModel extends Model<UserAttributes>, UserAttributes {}
export class User extends Model<UserModel, UserAttributes> {}

export type UserStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserModel;
};
export function UserFactory(sequelize: Sequelize): UserStatic {
  return <UserStatic>sequelize.define("user", {
    userid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    kakaoid: {
      type: DataTypes.INTEGER,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    nickname: {
      type: DataTypes.STRING,
    },
    salt: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    mbti: {
      type: DataTypes.STRING,
    },
    introduction: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.INTEGER,
    },
    likemenu: {
      type: DataTypes.STRING,
    },
    dislikemenu: {
      type: DataTypes.STRING,
    },
    mannerStatus: {
      type: DataTypes.INTEGER,
    },
    snsurl: {
      type: DataTypes.STRING,
    },
    job: {
      type: DataTypes.STRING,
    },
  });
}
//   {
//     sequelize,
//     modelName: "users",
//     logging: false
//   }
// );
//   }

//   users.associate = function (models) {
//     models.users.hasMany(models.applicant, {
//       as: "applied",
//       foreignKey: "userid",
//       sourceKey: "userid",
//     });
//     models.users.hasMany(models.comments, {
//       foreignKey: "userid",
//       sourceKey: "userid",
//     });
//     models.users.hasMany(models.usersReviews, {
//       foreignKey: "reviewerId",
//       sourceKey: "userid",
//     });
//     models.users.hasMany(models.lunchs, {
//       foreignKey: "userid",
//       sourceKey: "userid",
//     });
//     models.users.hasMany(models.usersReviews, {
//       foreignKey: "targetUserId",
//       sourceKey: "userid",
//     });
//     models.users.hasMany(models.bookmarks, {
//       foreignKey: "userid",
//       sourceKey: "userid",
//     });
//     models.users.belongsTo(models.locationdata, {
//       as: "locations",
//       foreignKey: "location",
//       sourceKey: "id",
//     });
//   };
//   return users;
// };

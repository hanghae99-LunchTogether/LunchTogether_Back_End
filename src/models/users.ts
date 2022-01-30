import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";
import { sequelize } from "./index";

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
export class users extends Model<UserModel, UserAttributes> {}

export type UserStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserModel;
};
export function UserFactory(sequelize: Sequelize): UserStatic {
  return <UserStatic>sequelize.define(
    "users",
    {
      userid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      kakaoid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false,
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
    },
    {
      modelName: "users",
      tableName: "users",
      paranoid: false,
      charset: "utf8",
      collate: "utf8_general_ci",
    }
  );
}
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

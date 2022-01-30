import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";
import { sequelize } from "./index";

export interface userReviewAttributes {
  reviewid: number;
  reviewerId?: number;
  lunchid?: number;
  targetUserId?: number;
  spoon?: number;
  comment?: string;
}
export interface userReviewsModel
  extends Model<userReviewAttributes>,
    userReviewAttributes {}
export class User extends Model<userReviewsModel, userReviewAttributes> {}

export type userReviewsStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): userReviewsModel;
};
export function userReviewFactory(sequelize: Sequelize): userReviewsStatic {
  return <userReviewsStatic>sequelize.define(
    "userReviews",
    {
      reviewid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      reviewerId: {
        type: DataTypes.INTEGER,
      },
      lunchid: {
        type: DataTypes.INTEGER,
      },
      targetUserId: {
        type: DataTypes.INTEGER,
      },
      spoon: {
        type: DataTypes.INTEGER,
      },
      comment: {
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
//   usersReviews.associate = function (models) {
//     models.usersReviews.belongsTo(models.users, {
//       as: "reviewer",
//       foreignKey: "reviewerId",
//       targetKey: "userid",
//       onDelete: "cascade",
//     });
//     models.usersReviews.belongsTo(models.lunchs, {
//       foreignKey: "lunchid",
//       onDelete: "cascade",
//     });
//     models.usersReviews.belongsTo(models.users, {
//       as: "targetUser",
//       foreignKey: "targetUserId",
//       targetKey: "userid",
//       onDelete: "cascade",
//     });
//   };
//   return usersReviews;
// };

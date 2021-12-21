import { DataTypes, Model } from "sequelize"; 
import {sequelize} from "./index";

interface bookmarksAttributes{
  bookmarksid?:number;
  userid:number;
  lunchid: number;
}

export class bookmarks extends Model<bookmarksAttributes>{
  public readonly bookmarksid!: number;
  public userid!: number;
  public lunchid!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  
  public static associations: {
  };
}
bookmarks.init(
    {
      bookmarksid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      lunchid: {
        type: DataTypes.INTEGER,
      },
      userid: {
        type: DataTypes.INTEGER,
      },
    },
    {
        sequelize,
        modelName: "bookmarks",
    }
);

// bookmarks.associate = function (models) {
//   //     models.bookmarks.belongsTo(models.lunchs, {
//   //       foreignKey: "lunchid",
//   //       onDelete: "cascade",
//   //     });
//   //     models.bookmarks.belongsTo(models.users, {
//   //       foreignKey: "userid",
//   //       onDelete: "cascade",
//   //     });
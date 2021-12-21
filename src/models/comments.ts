import { DataTypes, Model } from "sequelize"; 
import {sequelize} from "./index";

interface commentsAttributes{
  commentid?:number;
  userid:number;
  lunchid: number;
  comment:string;
  time:Date;
}

export class comments extends Model<commentsAttributes>{
  public readonly commentid!: number;
  public userid!: number;
  public lunchid!: number;
  public comment!: string;
  public time!:Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  
  public static associations: {
  };
}
comments.init(
    {
      commentid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      comment: {
        type: DataTypes.STRING,
      },
      lunchid: {
        type: DataTypes.INTEGER,
      },
      userid: {
        type: DataTypes.INTEGER,
      },
      time: {
        type: DataTypes.STRING,
      },
    },
    {
        sequelize,
        modelName: "comments",
    }
);
// comments.associate = function (models) {
//       models.comments.belongsTo(models.users, {
//         foreignKey: "userid",
//         onDelete: "cascade",
//       });
//       models.comments.belongsTo(models.lunchs, {
//         foreignKey: "lunchid",
//         onDelete: "cascade",
//       });
//     };

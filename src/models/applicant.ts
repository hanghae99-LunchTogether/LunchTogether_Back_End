import { DataTypes, Model } from "sequelize"; 
import {sequelize} from "./index";

interface applicantAttributes{
  applicantid?:number;
  userid:number;
  lunchid: number;
  confirmed: string;
  comments: string;
}

export class applicant extends Model<applicantAttributes>{
  public readonly applicantid!: number;
  public userid!: number;
  public lunchid!: number;
  public confirmed!: string;
  public comments!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  
  public static associations: {
  };
}
applicant.init(
    {
      applicantid: {
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
      confirmed: {
        type: DataTypes.BOOLEAN,
      },
      comments: {
        type: DataTypes.STRING,
      },
    },
    {
        sequelize,
        modelName: "applicant",
    }
);
// applicant.belongsTo(lunchs, {
//         foreignKey: "lunchid",
//         onDelete: "cascade",
//       });
//       models.applicant.belongsTo(models.users, {
//         foreignKey: "userid",
//         onDelete: "cascade",
//       });



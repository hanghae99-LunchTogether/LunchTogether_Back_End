import { DataTypes, Model } from "sequelize"; 
import {sequelize} from "./index";

interface locationdataAttributes{
  id?:number;
  address_name:string;
  road_address_name: string;
  category_group_name:string;
  place_name:string;
  place_url:string;
  phone:string;
  x:number;
  y:number;
  lunchreview?:string;
}

export class locationdata extends Model<locationdataAttributes>{
  public readonly id?:number;
  public address_name:string;
  public road_address_name: string;
  public category_group_name:string;
  public place_name:string;
  public place_url:string;
  public phone:string;
  public x:number;
  public y:number;
  public lunchreview?:string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  
  public static associations: {
  };
}
locationdata.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      address_name: {
        type: DataTypes.STRING,
      },
      road_address_name: {
        type: DataTypes.STRING,
      },
      category_group_name: {
        type: DataTypes.STRING,
      },
      place_name: {
        type: DataTypes.STRING,
      },
      place_url: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      x: {
        type: DataTypes.DOUBLE,
      },
      y: {
        type: DataTypes.DOUBLE,
      },
      lunchreview :{
        type: DataTypes.STRING,
      }
    },
    {
        sequelize,
        modelName: "locationdata",
    }
);
// locationdata.associate = function (models) {
  //     models.locationdata.hasMany(models.users, {
  //         foreignKey: "location", 
  //         sourceKey: "id", 
  //         onDelete: "cascade"
  //     });
  //   };

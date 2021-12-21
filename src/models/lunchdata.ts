import { DataTypes, Model } from "sequelize"; 
import {sequelize} from "./index";

interface lunchdataAttributes{
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

export class lunchdata extends Model<lunchdataAttributes>{
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
lunchdata.init(
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
        modelName: "lunchdata",
    }
);
// lunchdata.associate = function (models) {
  //     models.lunchdata.hasMany(models.users, {
  //         foreignKey: "location", 
  //         sourceKey: "id", 
  //         onDelete: "cascade"
  //     });
  //   };




// "use strict";
// const { Model } = require("sequelize");
// module.exports = (sequelize, DataTypes) => {
//   class lunchdata extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */

//     static associate(models) {
//       // define association here
//     }
//   }
//   lunchdata.init(
//     {
//       id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//         required: true,
//       },
//       address_name: {
//         type: DataTypes.STRING,
//         require: true,
//       },
//       road_address_name: {
//         type: DataTypes.STRING,
//         require: true,
//       },
//       category_group_name: {
//         type: DataTypes.STRING,
//         require: true,
//       },
//       place_name: {
//         type: DataTypes.STRING,
//         require: true,
//       },
//       place_url: {
//         type: DataTypes.STRING,
//         require: true,
//       },
//       phone: {
//         type: DataTypes.STRING,
//         require: false,
//       },
//       x: {
//         type: DataTypes.DOUBLE,
//         require: false,
//       },
//       y: {
//         type: DataTypes.DOUBLE,
//         require: false,
//       },
//       lunchreview :{
//         type: DataTypes.STRING,
//         require: false,
//       }
//     },

//     {
//       sequelize,
//       modelName: "lunchdata",
//       logging: false
//     }
//   );
//   lunchdata.associate = function (models) {
//     models.lunchdata.hasMany(models.lunchs, {
//       foreignKey: "location",
//       sourceKey: "id",
//       onDelete: "cascade",
//     });
//     models.lunchdata.hasMany(models.users, {foreignKey: "location", sourceKey: "id", onDelete: "cascade"});
//   };
//   return lunchdata;
// };

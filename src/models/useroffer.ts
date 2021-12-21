import { BuildOptions, DataTypes, Model, Sequelize } from "sequelize";

export interface userofferAttributes {
  userofferid: number;
  lunchid?: number;
  userid?: number;
  confirmed?: boolean;
  comments?: string;
}
export interface userofferModel
  extends Model<userofferAttributes>,
    userofferAttributes {}
export class useroffer extends Model<userofferModel, userofferAttributes> {}

export type userofferStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): userofferModel;
};
export function UserFactory(sequelize: Sequelize): userofferStatic {
  return <userofferStatic>sequelize.define("useroffer", {
    userofferid: {
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
  });
}
//     {
//       sequelize,
//       modelName: "useroffer",
//       logging: false,
//     }
//   );

//   useroffer.associate = function (models) {
//     models.useroffer.belongsTo(models.lunchs, {
//       foreignKey: "lunchid",
//       onDelete: "cascade",
//     });
//     models.useroffer.belongsTo(models.users, {
//       foreignKey: "userid",
//       onDelete: "cascade",
//     });
//   };
//   return useroffer;
// };

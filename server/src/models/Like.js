import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Like = sequelize.define("Like",  {
    id:  { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true  },
    cvId:  { type: DataTypes.INTEGER, allowNull: false },
    userId:  { type: DataTypes.INTEGER, allowNull: false  },
 },  { freezeTableName: true });

export default Like;

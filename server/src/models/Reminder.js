import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Reminder = sequelize.define("Reminder",  {
    id:  { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    text:   { type: DataTypes.STRING, allowNull: false },
    userId:  { type: DataTypes.INTEGER, allowNull: false },
},  { freezeTableName: true });

export default Reminder;



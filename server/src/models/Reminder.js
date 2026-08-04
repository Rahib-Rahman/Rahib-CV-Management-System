import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Reminder = sequelize.define(
    "Reminder",
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        text: { type: DataTypes.STRING, allowNull: false },
        userId: { type: DataTypes.INTEGER, allowNull: false },
        dueDate: { type: DataTypes.DATE, allowNull: true },
        type: { type: DataTypes.ENUM("popup", "email"), defaultValue: "popup" },
    },
    {
        freezeTableName: true,
        timestamps: true,
    }
);

export default Reminder;

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ApiToken = sequelize.define(
    "ApiToken",
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        token: { type: DataTypes.STRING, allowNull: false, unique: true },
        positionId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
        freezeTableName: true,
        timestamps: true,
    }
);

export default ApiToken;

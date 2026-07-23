import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Badge = sequelize.define("Badge",  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true  },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT  },
    iconUrl: { type: DataTypes.STRING  },
}, { freezeTableName: true  });

export default Badge;

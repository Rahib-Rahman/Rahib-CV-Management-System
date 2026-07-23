import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Discussion = sequelize.define("Discussion",  {
    id:  { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true  },
    positionId:  { type: DataTypes.INTEGER, allowNull: false  },
    userId: { type: DataTypes.INTEGER, allowNull: false  },
    content:  { type: DataTypes.TEXT, allowNull: false  },
},  { freezeTableName: true });

export default Discussion;

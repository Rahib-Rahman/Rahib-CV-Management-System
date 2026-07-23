import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const CV = sequelize.define("CV",  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true  },
    userId: { type: DataTypes.INTEGER, allowNull: false  },
    positionId:  { type: DataTypes.INTEGER, allowNull: false },
    published: { type: DataTypes.BOOLEAN, defaultValue: false  },
    version:  { type: DataTypes.INTEGER, defaultValue: 0  },
 }, { freezeTableName: true  });

export default CV;




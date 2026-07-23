import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Project = sequelize.define("Project",  {
    id:  { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId:  { type: DataTypes.INTEGER, allowNull: false  },
    name:  { type: DataTypes.STRING, allowNull: false  },
    periodStart:  { type: DataTypes.DATE },
    periodEnd:  { type: DataTypes.DATE },
    description: { type: DataTypes.TEXT },
    tags: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: []  }
}, { freezeTableName: true  });

export default Project;

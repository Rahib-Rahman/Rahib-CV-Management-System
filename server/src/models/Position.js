import sequelize from "../config/db.js";
import { DataTypes } from "sequelize";

const Position = sequelize.define ("Position",   {
    id:  { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true  },
    title: { type: DataTypes.STRING, allowNull: false  },
    description:   { type: DataTypes.TEXT },
    accessRules: { type: DataTypes.JSONB, defaultValue: {}  },
    attributes: { type: DataTypes.JSONB, defaultValue: []  },
    projectTags:  { type: DataTypes.JSONB, defaultValue: []  },
    maxProjects: { type: DataTypes.INTEGER, defaultValue: 0  },
}, { freezeTableName: true  });

export default Position;





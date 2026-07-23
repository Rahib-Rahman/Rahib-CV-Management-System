import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const AuditLog = sequelize.define ("AuditLog",  {
    id:  { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    entityType:  { type: DataTypes.STRING, allowNull: false  },
    entityId:  { type: DataTypes.INTEGER, allowNull: false },
    action:  { type: DataTypes.STRING, allowNull: false  },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    details:  { type: DataTypes.JSON, allowNull: true  },
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW  }
},  { freezeTableName: true });

export default AuditLog;



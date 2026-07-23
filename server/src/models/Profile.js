import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Profile = sequelize.define ("Profile", {
    id:  { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true  },
    userId:  { type: DataTypes.INTEGER, allowNull: false  },
    firstName:  { type: DataTypes.STRING, allowNull: false },
    lastName:  { type: DataTypes.STRING, allowNull: false },
    location:  { type: DataTypes.STRING  },
    photoUrl: { type: DataTypes.STRING },

    attributes:  { type: DataTypes.JSON, defaultValue: {} },

    version: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { freezeTableName: true });

export default Profile;


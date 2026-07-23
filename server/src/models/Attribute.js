import { DataTypes  } from "sequelize";
import sequelize from "../config/db.js";

const Attribute = sequelize.define ("Attribute",   {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true  },
    name:  { type: DataTypes.STRING, allowNull: false, unique: true  },
    category:  { type: DataTypes.STRING, allowNull: false},
    description:  { type: DataTypes.TEXT  },
    type:  {
        type: DataTypes.STRING,
        allowNull: false,
        validate:  {
            isIn: [["string", "text", "numeric", "date", "boolean", "dropdown", "image"]],
         },
     },
}, { freezeTableName: true  });

export default Attribute;



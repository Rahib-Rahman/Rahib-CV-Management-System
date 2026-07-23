import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import bcrypt from "bcryptjs";

const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
        type: DataTypes.ENUM("candidate", "recruiter", "admin"),
        allowNull: false,
        defaultValue: "candidate",
    },
    blocked: { type: DataTypes.BOOLEAN, defaultValue: false },
    googleId: { type: DataTypes.STRING, allowNull: true },
    facebookId: { type: DataTypes.STRING, allowNull: true },
}, { freezeTableName: true });

User.beforeCreate(async (user) => {
    if (user.password && user.password !== "oauth") {
        user.password = await bcrypt.hash(user.password, 10);
    }
});
User.beforeUpdate(async (user) => {
    if (user.changed("password") && user.password !== "oauth") {
        user.password = await bcrypt.hash(user.password, 10);
    }
});

User.prototype.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export default User;


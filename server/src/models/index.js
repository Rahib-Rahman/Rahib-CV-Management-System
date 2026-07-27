import User from "./User.js";
import CV from "./CV.js";
import Position from "./Position.js";
import Project from "./Project.js";
import Like from "./Like.js";
import Reminder from "./Reminder.js";
import Profile from "./Profile.js";


User.hasMany(CV, { foreignKey: "userId", as: "cvs", onDelete: "CASCADE", onUpdate: "CASCADE" });
CV.belongsTo(User, { foreignKey: "userId", as: "user", onDelete: "CASCADE", onUpdate: "CASCADE" });


Position.hasMany(CV, { foreignKey: "positionId", as: "cvs", onDelete: "CASCADE", onUpdate: "CASCADE" });
CV.belongsTo(Position, { foreignKey: "positionId", as: "position", onDelete: "CASCADE", onUpdate: "CASCADE" });


User.hasMany(Project, { foreignKey: "userId", as: "projects", onDelete: "CASCADE", onUpdate: "CASCADE" });
Project.belongsTo(User, { foreignKey: "userId", as: "user", onDelete: "CASCADE", onUpdate: "CASCADE" });


CV.hasMany(Like, { foreignKey: "cvId", as: "likes", onDelete: "CASCADE", onUpdate: "CASCADE" });
Like.belongsTo(CV, { foreignKey: "cvId", as: "cv", onDelete: "CASCADE", onUpdate: "CASCADE" });


User.hasMany(Reminder, { foreignKey: "userId", as: "reminders", onDelete: "CASCADE", onUpdate: "CASCADE" });
Reminder.belongsTo(User, { foreignKey: "userId", as: "user", onDelete: "CASCADE", onUpdate: "CASCADE" });


User.hasOne(Profile, { foreignKey: "userId", as: "profile", onDelete: "CASCADE", onUpdate: "CASCADE" });
Profile.belongsTo(User, { foreignKey: "userId", as: "user", onDelete: "CASCADE", onUpdate: "CASCADE" });

export { User, CV, Position, Project, Like, Reminder, Profile };

import User from "./User.js";
import CV from "./CV.js";
import Position from "./Position.js";
import Project from "./Project.js";
import Like from "./Like.js";
import Reminder from "./Reminder.js";

User.hasMany (CV, { foreignKey: "userId", as: "cvs"  });
CV.belongsTo (User, { foreignKey: "userId", as: "user"  });

Position.hasMany (CV,  { foreignKey: "positionId", as: "cvs" });
CV.belongsTo (Position, { foreignKey: "positionId", as: "position"  });

User.hasMany (Project,  { foreignKey: "userId", as: "projects"  });
Project.belongsTo(User,  { foreignKey: "userId", as: "user"  });

CV.hasMany (Like,  { foreignKey: "cvId", as: "likes" });
Like.belongsTo (CV,  { foreignKey: "cvId", as: "cv"  });

User.hasMany (Reminder, { foreignKey: "userId", as: "reminders"  });
Reminder.belongsTo (User, { foreignKey: "userId", as: "user"  });

export { User, CV, Position, Project, Like, Reminder };



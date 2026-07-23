import dotenv from "dotenv";
dotenv.config();
import sequelize from "./config/db.js";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";

import "./models/User.js";
import "./models/Profile.js";
import "./models/Project.js";
import "./models/Attribute.js";
import "./models/Position.js";
import "./models/CV.js";
import "./models/Discussion.js";
import "./models/Like.js";
import "./models/Reminder.js";
import "./models/Badge.js";
import "./models/AuditLog.js";

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);
export const io = new Server(server,  {
     cors: { origin: "https://rahib-cv-management-system.netlify.app" },
});

io.on("connection", (socket) =>  {
    console.log("Client connected:", socket.id);
     socket.on("newPost", (post) => io.emit("newPost", post));
    socket.on("likeUpdated", (likeData) => io.emit("likeUpdated", likeData));
     socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
     });
});

sequelize
    .sync({  alter: true })
     .then(() => {
        console.log("Database synced successfully.");
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
         });
     })
    .catch((err) => {
        console.error("Failed to sync database:", err);
    });

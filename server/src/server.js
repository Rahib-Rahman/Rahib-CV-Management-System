import dotenv from "dotenv";
dotenv.config();

import sequelize from "./config/db.js";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";

import "./models/index.js";

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "https://rahib-cv-management-system.netlify.app",
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("newPost", (post) => io.emit("newPost", post));
    socket.on("likeUpdated", (likeData) => io.emit("likeUpdated", likeData));

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });

    socket.on("error", (err) => {
        console.error("Socket.IO error:", err);
    });
});

sequelize
    .sync({ alter: true })
    .then(() => {
        console.log("Database synced successfully.");
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to sync database:", err);
    });

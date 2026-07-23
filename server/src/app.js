import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();

import session from "express-session";
import passport from "./config/passport.js";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import attributeRoutes from "./routes/attributeRoutes.js";
import positionRoutes from "./routes/positionRoutes.js";
import cvRoutes from "./routes/cvRoutes.js";
import discussionRoutes from "./routes/discussionRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";
import pdfExportRoutes from "./routes/pdfExportRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import badgeRoutes from "./routes/badgeRoutes.js";
import mainRoutes from "./routes/mainRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/attributes", attributeRoutes);
app.use("/api/positions", positionRoutes);
app.use("/api/cvs", cvRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/pdf", pdfExportRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/badges", badgeRoutes);
app.use("/api/main", mainRoutes);
app.use("/api/search", searchRoutes);

export default app;



import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import session from "express-session";
import passport from "./config/passport.js";

// Import routes
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
import salesforceRoutes from "./routes/salesforceRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";

// Odoo integration routes
import tokenRoutes from "./routes/tokenRoutes.js";
import aggregateRoutes from "./routes/aggregateRoutes.js";

const app = express();

app.use(
    session({
        secret: process.env.SESSION_SECRET || "supersecret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        },
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// CORS + JSON parsing
app.use(cors());
app.use(express.json());

// Mount routes
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
app.use("/api/salesforce", salesforceRoutes);
app.use("/api/support", supportRoutes);

// Odoo integration endpoints
app.use("/api/tokens", tokenRoutes);
app.use("/api/aggregate", aggregateRoutes);


app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

export default app;

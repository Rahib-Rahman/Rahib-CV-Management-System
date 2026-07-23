import jwt from "jsonwebtoken";
import User from "../models/User.js";
export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ error: "Invalid token" });
        }
        if (user.blocked) {
            return res.status(403).json({ error: "User is blocked. Contact admin." });
        }
        req.user = {
            id: user.id,
            role: user.role,
            blocked: user.blocked,
        };
        next();
    } catch (err) {
        console.error("Auth error:", err);
        return res.status(401).json({ error: "Unauthorized" });
    }
};
export const authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden" });
        }
        next();
    };
};

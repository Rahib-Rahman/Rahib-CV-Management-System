import express from "express";
import passport from "../config/passport.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post ("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (!["candidate", "recruiter", "admin"].includes(role)) {
            return res.status(400).json({ error: "Invalid role" });
        }
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }
        await User.create({ name, email, password, role });
        res.json({ message: "Registration successful. Please login." });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ error: "Registration failed" });
    }
});

router.post ("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password required" });
        }
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ error: "Invalid credentials" });

        if (user.blocked) {
            return res.status(403).json({ error: "Your account is blocked. Contact admin." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ error: "JWT secret not configured" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const { password: _, ...safeUser } = user.toJSON();
        res.json({ token, user: safeUser });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Login failed" });
    }
});

router.get ("/google",
    passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get ("/google/callback",
    passport.authenticate("google", { failureRedirect: "http://localhost:5173/login", session: false }),
    async (req, res) => {
        try {
            const user = req.user;
            if (user.blocked) {
                return res.redirect("http://localhost:5173/login?error=blocked");
            }
            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );
            res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
        } catch (err) {
            console.error("Google login error:", err);
            res.redirect("http://localhost:5173/login");
        }
    }
);

router.get ("/facebook",
    passport.authenticate("facebook", { scope: ["email"], session: false })
);

router.get ("/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "http://localhost:5173/login", session: false }),
    async (req, res) => {
        try {
            const user = req.user;

            if (user.blocked) {
                return res.redirect("http://localhost:5173/login?error=blocked");
            }

            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );
            res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
        } catch (err) {
            console.error("Facebook login error:", err);
            res.redirect("http://localhost:5173/login");
        }
    }
);

export default router;

import express from "express";
import User from "../models/User.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get ("/users", authenticate, authorize(["admin"]), async (req, res) =>  {
    try {
         const users = await User.findAll( {
            attributes: { exclude: ["password"]  },
        });
        res.json({ users });
    } catch (err) {
         console.error("Admin get users error:", err);
        res.status(500).json({ error: "Failed to fetch users"  });
    }
});

router.put ("/users/:id/block", authenticate, authorize (["admin"]), async (req, res) => {
    try {
         const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
         user.blocked = !user.blocked;
        await user.save();
        res.json({
             message: user.blocked ? "User blocked" : "User unblocked",
            user,
        });
    } catch (err) {
         console.error("Admin block user error:", err);
        res.status(500).json({ error: "Failed to block/unblock user" });
    }
});

router.put ("/users/:id/role", authenticate, authorize (["admin"]), async (req, res) => {
    try {
        const { role } = req.body;
        if (!["candidate", "recruiter", "admin"].includes(role)) {
            return res.status(400).json({ error: "Invalid role" });
        }
        const user = await User.findByPk(req.params.id);
         if (!user) return res.status(404).json ({ error: "User not found" });
        user.role = role;
        await user.save();
        res.json ({ message: "Role updated", user });
    } catch (err) {
        console.error ("Admin change role error:", err);
        res.status(500).json({ error: "Failed to change role" });
    }
});

router.delete ("/users/:id", authenticate, authorize (["admin"]), async (req, res) =>  {
    try  {
         const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        await user.destroy();
         res.json ({ message: "User deleted", userId: req.params.id  });
    } catch (err)   {
        console.error ("Admin delete user error:", err);
        res.status(500).json({ error: "Failed to delete user"  });
    }
});

export default router;

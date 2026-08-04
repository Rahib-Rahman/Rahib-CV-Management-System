import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Profile from "../models/Profile.js";
import { createAccountAndContact } from "../services/salesforceService.js";

const router = express.Router();

router.post("/salesforce-sync/:userId", authenticate, async (req, res) => {
    try {
        const { userId } = req.params;
        const { extraInfo } = req.body;

        const id = parseInt(userId, 10);
        if (isNaN(id)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const user = await User.findByPk(id, {
            include: { model: Profile, as: "profile" },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const result = await createAccountAndContact(user, extraInfo);

        res.json({
            success: true,
            accountId: result.accountId,
            contactId: result.contactId,
        });
    } catch (err) {
        console.error("Salesforce sync error:", err.response?.data || err.message);
        res.status(500).json({
            error: "Failed to sync user to Salesforce",
            details: err.response?.data || err.message,
        });
    }
});

export default router;

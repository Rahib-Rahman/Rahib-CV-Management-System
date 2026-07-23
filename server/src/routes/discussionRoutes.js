import express from "express";
import Discussion from "../models/Discussion.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { logAction } from "../utils/logAction.js";

const router = express.Router();

router.get ("/:positionId", async (req, res) => {
    try {
         const discussions = await Discussion.findAll({ where: { positionId: req.params.positionId } });
        res.json(discussions);
    } catch (err) {
         console.error("Get discussions error:", err);
        res.status(500).json({ error: "Failed to fetch discussions" });
    }
});

router.post ("/:positionId", authenticate, async (req, res) => {
    try {
         const { content } = req.body;
        const discussion = await Discussion.create({
            positionId: req.params.positionId,
             userId: req.user.id,
            content
        });
         await logAction("Discussion", discussion.id, "create", req.user.id);
        res.json(discussion);
    } catch (err) {
         console.error("Create discussion error:", err);
        res.status(500).json({ error: "Failed to add comment" });
    }
});

export default router;


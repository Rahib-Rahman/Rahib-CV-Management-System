import express from "express";
import Discussion from "../models/Discussion.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { logAction } from "../utils/logAction.js";

const router = express.Router();

router.get("/:positionId", async (req, res) => {
    try {
        const positionId = parseInt(req.params.positionId, 10);
        if (isNaN(positionId)) {
            return res.status(400).json({ error: "Invalid positionId" });
        }

        const discussions = await Discussion.findAll({
            where: { positionId },
            order: [["createdAt", "ASC"]],
        });
        res.json(discussions);
    } catch (err) {
        console.error("Get discussions error:", err);
        res.status(500).json({ error: "Failed to fetch discussions" });
    }
});

router.post("/:positionId", authenticate, async (req, res) => {
    try {
        const positionId = parseInt(req.params.positionId, 10);
        if (isNaN(positionId)) {
            return res.status(400).json({ error: "Invalid positionId" });
        }

        const { content } = req.body;
        if (!content || !content.trim()) {
            return res.status(400).json({ error: "Content is required" });
        }

        const discussion = await Discussion.create({
            positionId,
            userId: req.user.id,
            content,
        });

        await logAction("Discussion", discussion.id, "create", req.user.id);

        const io = req.app.get("io");
        if (io) {
            io.emit("newPost", discussion);
        }

        res.json(discussion);
    } catch (err) {
        console.error("Create discussion error:", err);
        res.status(500).json({ error: "Failed to add comment" });
    }
});

export default router;

import express from "express";
import Like from "../models/Like.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { logAction } from "../utils/logAction.js";

const router = express.Router();

router.post("/:cvId", authenticate, async (req, res) => {
    try {
        const cvId = parseInt(req.params.cvId, 10);
        if (isNaN(cvId)) return res.status(400).json({ error: "Invalid CV ID" });

        const existing = await Like.findOne({ where: { cvId, userId: req.user.id } });
        if (existing) return res.status(400).json({ error: "Already liked" });

        const like = await Like.create({ cvId, userId: req.user.id });
        await logAction("Like", like.id, "create", req.user.id);

        const io = req.app.get("io");
        if (io) {
            const count = await Like.count({ where: { cvId } });
            io.emit("likeUpdated", { cvId, likes: count });
        }

        res.json(like);
    } catch (err) {
        console.error("Like error:", err);
        res.status(500).json({ error: "Failed to like CV" });
    }
});

router.delete("/:cvId", authenticate, async (req, res) => {
    try {
        const cvId = parseInt(req.params.cvId, 10);
        if (isNaN(cvId)) return res.status(400).json({ error: "Invalid CV ID" });

        const deleted = await Like.destroy({ where: { cvId, userId: req.user.id } });
        if (!deleted) return res.status(404).json({ error: "Like not found" });

        await logAction("Like", cvId, "delete", req.user.id);

        const io = req.app.get("io");
        if (io) {
            const count = await Like.count({ where: { cvId } });
            io.emit("likeUpdated", { cvId, likes: count });
        }

        res.json({ message: "Like removed" });
    } catch (err) {
        console.error("Remove like error:", err);
        res.status(500).json({ error: "Failed to remove like" });
    }
});


router.get("/:cvId", async (req, res) => {
    try {
        const cvId = parseInt(req.params.cvId, 10);
        if (isNaN(cvId)) return res.status(400).json({ error: "Invalid CV ID" });

        const count = await Like.count({ where: { cvId } });
        res.json({ cvId, likes: count });
    } catch (err) {
        console.error("Get likes error:", err);
        res.status(500).json({ error: "Failed to fetch likes" });
    }
});

export default router;

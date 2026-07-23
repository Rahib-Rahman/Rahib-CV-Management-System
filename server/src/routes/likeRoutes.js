import express from "express";
import Like from "../models/Like.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { logAction } from "../utils/logAction.js";

const router = express.Router();

router.post ("/:cvId", authenticate, async (req, res) => {
    try {
         const existing = await Like.findOne({ where: { cvId: req.params.cvId, userId: req.user.id } });
        if (existing) return res.status(400).json({ error: "Already liked" });
         const like = await Like.create({ cvId: req.params.cvId, userId: req.user.id });
        await logAction("Like", like.id, "create", req.user.id);
        res.json(like);
    } catch (err) {
         console.error("Like error:", err);
        res.status(500).json({ error: "Failed to like CV" });
    }
});

router.delete ("/:cvId", authenticate, async (req, res) => {
    try {
         const deleted = await Like.destroy({ where: { cvId: req.params.cvId, userId: req.user.id } });
        if (!deleted) return res.status(404).json({ error: "Like not found" });
         await logAction("Like", req.params.cvId, "delete", req.user.id);
        res.json({ message: "Like removed" });
    } catch (err) {
         console.error("Remove like error:", err);
        res.status(500).json({ error: "Failed to remove like" });
    }
});

router.get ("/:cvId", async (req, res) => {
    try {
         const count = await Like.count({ where: { cvId: req.params.cvId } });
        res.json({ cvId: req.params.cvId, likes: count });
    } catch (err) {
         console.error("Get likes error:", err);
        res.status(500).json({ error: "Failed to fetch likes" });
    }
});

export default router;


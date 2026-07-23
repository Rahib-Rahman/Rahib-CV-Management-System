import express from "express";
import { CV, Position } from "../models/index.js";
import Profile from "../models/Profile.js";
import { logAction } from "../utils/logAction.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get ("/", authenticate, async (req, res) => {
    try {
        const cvs = await CV.findAll({
             where: { userId: req.user.id },
            include: [{ model: Position, as: "position" }]
        });
         res.json(cvs);
    } catch (err) {
         console.error("Get CVs error:", err);
        res.status(500).json({ error: "Failed to fetch CVs" });
    }
});

router.post ("/", authenticate, async (req, res) => {
    try {
         const { positionId } = req.body;
        const existing = await CV.findOne({ where: { userId: req.user.id, positionId } });
         if (existing) return res.status(400).json({ error: "CV already exists for this position" });
        const cv = await CV.create({ userId: req.user.id, positionId });
         await logAction("CV", cv.id, "create", req.user.id);
        res.json(cv);
    } catch (err) {
         console.error("Create CV error:", err);
        res.status(500).json({ error: "Failed to create CV" });
    }
});

router.put ("/:id/publish", authenticate, async (req, res) => {
    try {
         const cv = await CV.findByPk(req.params.id, {
            include: [{ model: Position, as: "position" }]
        });
        if (!cv) return res.status(404).json({ error: "CV not found" });
         const requiredAttrs = cv.position?.attributes || [];
        const profile = await Profile.findOne({ where: { userId: cv.userId } });
         const profileAttrs = profile?.attributes || {};
        const missing = requiredAttrs.filter(attrName => !profileAttrs[attrName]);
        if (missing.length > 0) {
            return res.status(400).json({ error: "Missing attributes", missing });
        }
         cv.published = true;
        cv.version = (cv.version || 0) + 1;
         await cv.save();
        await logAction("CV", cv.id, "publish", req.user.id);
         res.json(cv);
    } catch (err) {
         console.error("Publish CV error:", err);
        res.status(500).json({ error: "Failed to publish CV" });
    }
});

router.delete ("/:id", authenticate, async (req, res) => {
    try {
         const deleted = await CV.destroy({ where: { id: req.params.id, userId: req.user.id } });
        if (!deleted) return res.status(404).json({ error: "CV not found" });
        await logAction("CV", req.params.id, "delete", req.user.id);
         res.json({ message: "CV deleted" });
    } catch (err) {
         console.error("Delete CV error:", err);
        res.status(500).json({ error: "Failed to delete CV" });
    }
});

export default router;

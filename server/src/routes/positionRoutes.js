import express from "express";
import Position from "../models/Position.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { logAction } from "../utils/logAction.js";

const router = express.Router();

router.get ("/", async (req, res) => {
    try  {
         const positions = await Position.findAll();
        res.json(positions);
    } catch (err) {
         console.error("Get positions error:", err);
        res.status(500).json({ error: "Failed to fetch positions" });
    }
});

router.post ("/", authenticate, authorize(["recruiter", "admin"]), async (req, res) => {
    try {
         const { title, description, accessRules, attributes, projectTags, maxProjects } = req.body;
        const pos = await Position.create({ title, description, accessRules, attributes, projectTags, maxProjects });
         await logAction("Position", pos.id, "create", req.user.id);
        res.json(pos);
    } catch (err) {
         console.error("Create position error:", err);
        res.status(500).json({ error: "Failed to create position" });
    }
});

router.put ("/:id", authenticate, authorize(["recruiter", "admin"]), async (req, res) => {
    try {
         const pos = await Position.findByPk(req.params.id);
        if (!pos) return res.status(404).json({ error: "Position not found" });
         const { title, description, accessRules, attributes, projectTags, maxProjects } = req.body;
        pos.title = title ?? pos.title;
        pos.description = description ?? pos.description;
        pos.accessRules = accessRules ?? pos.accessRules;
        pos.attributes = attributes ?? pos.attributes;
        pos.projectTags = projectTags ?? pos.projectTags;
        pos.maxProjects = maxProjects ?? pos.maxProjects;
         await pos.save();
        await logAction("Position", pos.id, "update", req.user.id);
        res.json(pos);
    } catch (err) {
        console.error("Update position error:", err);
        res.status(500).json({ error: "Failed to update position" });
    }
});

router.delete ("/:id", authenticate, authorize(["recruiter", "admin"]), async (req, res) => {
    try {
         const deleted = await Position.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ error: "Position not found" });
         await logAction("Position", req.params.id, "delete", req.user.id);
        res.json({ message: "Position deleted" });
    } catch (err) {
         console.error("Delete position error:", err);
        res.status(500).json({ error: "Failed to delete position" });
    }
});

export default router;

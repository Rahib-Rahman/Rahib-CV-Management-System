import express from "express";
import Project from "../models/Project.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { logAction } from "../utils/logAction.js";

const router = express.Router();

router.get ("/", authenticate, async (req, res) => {
    try  {
         const projects = await Project.findAll({ where: { userId: req.user.id } });
        res.json(projects);
    } catch (err) {
         console.error("Get projects error:", err);
        res.status(500).json({ error: "Failed to fetch projects" });
    }
});

router.post ("/", authenticate, async (req, res) => {
    try  {
        const  { name, periodStart, periodEnd, description, tags } = req.body;
        if (!name) {
            return res.status(400).json({ error: "Project name is required" });
        }
        const project = await Project.create ({
            userId: req.user.id, name, periodStart, periodEnd, description, tags,
        });
        await logAction ("Project", project.id, "create", req.user.id );
        res.json(project);
    } catch (err) {
        console.error("Create project error:", err);
        res.status(500).json({ error: "Failed to create project" });
    }
});

router.put ("/:id", authenticate, async (req, res) => {
    try  {
        const project = await Project.findOne({
            where: { id: req.params.id, userId: req.user.id },
        });
         if (!project) return res.status(404).json({ error: "Project not found" });
        Object.assign(project, req.body);
          await project.save();
        await logAction("Project", project.id, "update", req.user.id);
        res.json(project);
    } catch (err) {
         console.error("Update project error:", err);
        res.status(500).json({ error: "Failed to update project" });
    }
});

router.delete ("/:id", authenticate, async (req, res) => {
    try {
        const deleted = await Project.destroy({
            where: { id: req.params.id, userId: req.user.id },
        });
         if (!deleted) return res.status(404).json({ error: "Project not found" });
        await logAction("Project", req.params.id, "delete", req.user.id);
        res.json({ message: "Project deleted" });
    } catch (err) {
        console.error("Delete project error:", err);
        res.status(500).json({ error: "Failed to delete project" });
    }
});

export default router;


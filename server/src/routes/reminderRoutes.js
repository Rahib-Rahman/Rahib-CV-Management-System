import express from "express";
import Reminder from "../models/Reminder.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { logAction } from "../utils/logAction.js";

const router = express.Router();

router.get ("/", authenticate, async (req, res) => {
    try {
        const reminders = await Reminder.findAll({
            where: { userId: req.user.id },
            order: [["createdAt", "DESC"]],
        });
        res.json(reminders);
    } catch (err) {
        console.error("Error fetching reminders:", err);
        res.status(500).json({ error: "Failed to fetch reminders" });
    }
});

router.post ("/", authenticate, async (req, res) => {
    try  {
         const { text } = req.body;
        if (!text) {
             return res.status(400).json({ error: "Reminder text is required" });
        }
         const reminder = await Reminder.create({
            text,
             userId: req.user.id,
        });

         await logAction("Reminder", reminder.id, "create", req.user.id);

        res.json(reminder);
    }  catch (err) {
         console.error("Error creating reminder:", err);
        res.status(500).json({ error: "Failed to create reminder" });
    }
});

router.delete ("/:id", authenticate, async (req, res) => {
    try {
         const reminder = await Reminder.findOne({
            where: { id: req.params.id, userId: req.user.id },
        });
        if  (!reminder) return res.status(404).json({ error: "Reminder not found" });
         await reminder.destroy();
        await logAction("Reminder", req.params.id, "delete", req.user.id);
        res.json({ message: "Reminder deleted successfully" });
    } catch (err) {
         console.error("Error deleting reminder:", err);
        res.status(500).json({ error: "Failed to delete reminder" });
    }
});

export default router;

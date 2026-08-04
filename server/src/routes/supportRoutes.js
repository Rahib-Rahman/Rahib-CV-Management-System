import express from "express";
import axios from "axios";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, async (req, res) => {
    try {
        const { summary, priority, positionTitle, pageLink } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: "Unauthorized: No user found" });
        }

        const ticket = {
            ReportedBy: `${user.firstName} ${user.lastName} (${user.role})`,
            Position: positionTitle || "N/A",
            Link: pageLink,
            Priority: priority,
            Summary: summary,
            Admins: ["admin1@example.com", "admin2@example.com"],
        };

        const fileName = `ticket-${Date.now()}.json`;
        await axios.put(
            `https://graph.microsoft.com/v1.0/me/drive/root:/SupportTickets/${fileName}:/content`,
            JSON.stringify(ticket, null, 2),
            {
                headers: {
                    Authorization: `Bearer ${process.env.ONEDRIVE_ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );

        res.json({ success: true, fileName });
    } catch (err) {
        console.error("Support ticket upload error:", err.response?.data || err.message);
        res.status(500).json({ error: "Failed to upload support ticket" });
    }
});

export default router;

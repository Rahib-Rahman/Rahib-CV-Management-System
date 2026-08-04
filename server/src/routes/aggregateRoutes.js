import express from "express";
import ApiToken from "../models/ApiToken.js";
import Position from "../models/Position.js";
import CV from "../models/CV.js";

const router = express.Router();

router.get("/:token", async (req, res) => {
    try {
        const { token } = req.params;

        const apiToken = await ApiToken.findOne({
            where: { token },
            include: { model: Position, as: "position" },
        });

        if (!apiToken) return res.status(404).json({ error: "Invalid token" });

        const position = apiToken.position;
        if (!position) return res.status(404).json({ error: "Position not found" });

        const cvs = await CV.findAll({ where: { positionId: position.id } });

        const applications = cvs.length;
        const shortlisted = cvs.filter(cv => cv.status === "shortlisted").length;
        const hired = cvs.filter(cv => cv.status === "hired").length;

        res.json({
            position: position.title,
            aggregated: {
                applications,
                shortlisted,
                hired,
            },
        });
    } catch (err) {
        console.error("Aggregation error:", err);
        res.status(500).json({ error: "Failed to fetch aggregated results" });
    }
});

export default router;

import express from "express";
import { v4 as uuidv4 } from "uuid";
import ApiToken from "../models/ApiToken.js";
import Position from "../models/Position.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:positionId", authenticate, async (req, res) => {
    try {
        const { positionId } = req.params;
        const position = await Position.findByPk(positionId);
        if (!position) return res.status(404).json({ error: "Position not found" });

        const token = uuidv4();
        const apiToken = await ApiToken.create({ token, positionId });

        res.json({ token: apiToken.token });
    } catch (err) {
        console.error("Token generation error:", err);
        res.status(500).json({ error: "Failed to generate token" });
    }
});

export default router;

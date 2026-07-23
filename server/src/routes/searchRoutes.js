import express from "express";
import { Op } from "sequelize";
import Position from "../models/Position.js";
import CV from "../models/CV.js";
import User from "../models/User.js";
import { logAction } from "../utils/logAction.js";

const router = express.Router();

router.get ("/positions", async (req, res) => {
    try {
        const { q, limit = 10, offset = 0 } = req.query;
        if (!q || q.trim() === "") {
            return res.status(400).json ({ error: "Search query is required"  });
        }
        const positions = await Position.findAll( {
            where: {
                [Op.or]:  [
                    {  title: { [Op.iLike]: `%${q}%` } },
                    {  description: { [Op.iLike]: `%${q}%` } },
                ],
            },
             limit: parseInt(limit, 10),
             offset: parseInt(offset, 10),
        });
         await logAction("Search", null, "positions", req.user?.id || null );
        res.json(positions);
    } catch (err) {
         console.error("Error searching positions:", err);
        res.status(500).json({ error: "Failed to search positions" });
    }
});

router.get ("/cvs", async (req, res) =>  {
    try {
         const { q, limit = 10, offset = 0 } = req.query;
        if (!q || q.trim() === "")  {
            return res.status(400).json({ error: "Search query is required" });
        }
         const cvs = await CV.findAll ({
             include:  [
                { model: User, attributes: ["name"] },
                { model: Position, attributes: ["title"] },
            ],
             where:  {
                [Op.or]: [
                    { "$User.name$": { [Op.iLike]: `%${q}%` } },
                    { "$Position.title$": { [Op.iLike]: `%${q}%` } },
                ],
            },
             limit: parseInt(limit, 10),
            offset: parseInt(offset, 10),
        });
        await logAction("Search", null, "cvs", req.user?.id || null);
        res.json(cvs);
    } catch (err) {
        console.error("Error searching CVs:", err);
        res.status(500).json({ error: "Failed to search CVs" });
    }
});

export default router;

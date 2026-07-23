import express from "express";
import Position from "../models/Position.js";
import Project from "../models/Project.js";

const router = express.Router();

router.get ("/latest-positions", async (req, res) => {
    try {
         const positions = await Position.findAll({order: [["updatedAt", "DESC"]], limit: 10,});
          res.json(positions);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch latest positions" });
    }
});

router.get ("/popular-positions", async (req, res) => {
    try {
        const [results] = await Position.sequelize.query(`
      SELECT p.id, p.title, p.description, COUNT(c.id) AS "cvCount"
      FROM "Position" p
      LEFT JOIN "CV" c ON p.id = c."positionId"
      GROUP BY p.id
      ORDER BY "cvCount" DESC
      LIMIT 5;
    `);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch popular positions" });
    }
});

router.get("/tags", async (req, res) => {
    try {
         const projects = await Project.findAll();
        const tags = {};
         projects.forEach((p) => {
            (p.tags || []).forEach((tag) => {
                 tags[tag] = (tags[tag] || 0) + 1;
            });
        });
         const tagArray = Object.entries(tags).map(([tag, count]) => ({ tag, count }));
        res.json(tagArray);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch tags" });
    }
});

export default router;

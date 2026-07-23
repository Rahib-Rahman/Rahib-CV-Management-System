import express from "express";
import { Parser } from "json2csv";
import ExcelJS from "exceljs";
import CV from "../models/CV.js";
import User from "../models/User.js";
import Position from "../models/Position.js";
import Project from "../models/Project.js";
import Like from "../models/Like.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get ("/:positionId/csv", authenticate, authorize(["admin"]), async (req, res) => {
    try  {
        const cvs = await CV.findAll({
             where: { positionId: req.params.positionId },
            include: [User, Position, Project],
        });
        if (!cvs || cvs.length === 0) {
             return res.status(404).json({ error: "No CVs found for this position" });
        }
         const data = await Promise.all(
             cvs.map(async (cv) => {
                 const likeCount = await Like.count({ where: { cvId: cv.id } });
                return {cvId: cv.id, candidate: cv.User?.name, position: cv.Position?.title, projects: cv.Projects?.map((p) => p.name).join(", "), likes: likeCount,};
            })
        );
        const parser = new Parser();
        const csv = parser.parse(data);
        res.header("Content-Type", "text/csv");
        res.attachment("cvs.csv");
        res.send(csv);
    } catch (err) {
        console.error("Export CSV error:", err);
        res.status(500).json({ error: "Failed to export CVs to CSV" });
    }
});

router.get ("/:positionId/excel", authenticate, authorize(["admin"]), async (req, res) => {
    try  {
        const cvs = await CV.findAll({
             where: { positionId: req.params.positionId },
            include: [User, Position, Project],
        });
        if  (!cvs || cvs.length === 0) {
             return res.status(404).json({ error: "No CVs found for this position" });
        }
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("CVs");
        sheet.columns = [{ header: "CV ID", key: "cvId", width: 10 }, { header: "Candidate", key: "candidate", width: 20 }, { header: "Position", key: "position", width: 20 }, { header: "Projects", key: "projects", width: 30 },
            { header: "Likes", key: "likes", width: 10 },
        ];
        for (const cv of cvs) {
            const likeCount = await Like.count({ where: { cvId: cv.id } });
            sheet.addRow({cvId: cv.id, candidate: cv.User?.name, position: cv.Position?.title, projects: cv.Projects?.map((p) => p.name).join(", "), likes: likeCount,
            });
        }
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Disposition", "attachment; filename=cvs.xlsx");
        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error("Export Excel error:", err);
        res.status(500).json({ error: "Failed to export CVs to Excel" });
    }
});

export default router;

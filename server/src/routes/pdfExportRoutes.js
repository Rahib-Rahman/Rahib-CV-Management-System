import express from "express";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import CV from "../models/CV.js";
import User from "../models/User.js";
import Position from "../models/Position.js";
import Project from "../models/Project.js";
import Like from "../models/Like.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

import { logAction } from "../utils/logAction.js";

const router = express.Router();

router.get ("/:cvId/pdf", authenticate, authorize(["recruiter", "admin"]), async (req, res) => {
    try {
         const { lang = "en" } = req.query;
        const cv = await CV.findByPk(req.params.cvId, { include: [User, Position, Project] });
         if (!cv) return res.status(404).json({ error: "CV not found" });
        const likeCount = await Like.count({ where: { cvId: cv.id } });
         const qrUrl = `https://rahib-cv-management-system.netlify.app/cv/${cv.id}`;
        const qrData = await QRCode.toDataURL(qrUrl);

        const translations = {
            en: {
                title: "CV for Position", candidate: "Candidate", position: "Position", likes: "Likes", projects: "Projects",
            },
            es: {
                title: "CV para la posición", candidate: "Candidato", position: "Posición", likes: "Me gusta", projects: "Proyectos",
            },
        };
        const t = translations[lang] || translations.en;
         const doc = new PDFDocument({ size: "A4", layout: "portrait", margin: 50 });
        res.setHeader("Content-Type", "application/pdf");
         res.setHeader("Content-Disposition", `attachment; filename=cv_${cv.id}_${lang}.pdf`);
        doc.pipe(res);
        doc.font("Helvetica-Bold")
             .fontSize(20)
            .fillColor("black")
            .text(`${t.title}: ${cv.Position?.title || "N/A"}`, { align: "center" });
        doc.moveDown();
        doc.font("Helvetica")
             .fontSize(14)
            .fillColor("black")
            .text(`${t.candidate}: ${cv.User?.name || "N/A"}`);
         doc.text(`${t.position}: ${cv.Position?.title || "N/A"}`);
        doc.text(`${t.likes}: ${likeCount}`);
         doc.moveDown();
        doc.text(`${t.projects}:`);
        (cv.Projects || []).forEach((p) => {
            doc.text(`- ${p.name}`);
        });
        doc.moveDown();
        const qrImage = qrData.replace (/^data:image\/png;base64,/, "");
        doc.image(Buffer.from(qrImage, "base64"), {
            fit: [100, 100],
            align: "center",
        });
         doc.end();
        await logAction("CV", cv.id, "export-pdf", req.user.id);
    } catch (err) {
         console.error("PDF export error:", err);
        res.status(500).json({ error: "Failed to export CV to PDF" });
    }
});

export default router;

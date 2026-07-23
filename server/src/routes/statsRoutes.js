import express from "express";
import CV from "../models/CV.js";
import Position from "../models/Position.js";
import User from "../models/User.js";
import Like from "../models/Like.js";
import Project from "../models/Project.js";
import { Op } from "sequelize";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const  totalCVs = await CV.count();
        const totalPositions = await  Position.count();
        const  totalCandidates = await User.count({ where: { role: "candidate"  } });
        const   totalRecruiters = await  User.count({ where: { role: "recruiter" }  });
        const  recentCVs = await  CV.count ({
             where: { createdAt: { [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000)  } },
        });
        const totalLikes = await Like.count();
        const totalProjects = await Project.count();
        res.json({totalCVs, totalPositions, totalCandidates, totalRecruiters, recentCVs, totalLikes, totalProjects,
        });
    } catch (err) {
        console.error("Stats error:", err);
        res.status(500).json({ error: "Failed to fetch global stats" });
    }
});

router.get("/achievements", authenticate, async (req, res) => {
    try {
        const projectCount = await Project.count({ where: { userId: req.user.id } });
        const cvCount = await CV.count({ where: { userId: req.user.id  } });
        let likeCount = 0;
        if ( req.user.role === "recruiter" ) {
            likeCount = await Like.count ({
                include:  [
                     {
                        model: CV,
                        as: "cv",
                        include: [{ model: Position, as: "position" }],
                    },
                ],
                where: { "$cv.position.userId$": req.user.id },
            });
        } else if (req.user.role === "candidate") {
            likeCount = await Like.count({
                include: [{ model: CV, as: "cv" }],
                where: { "$cv.userId$": req.user.id },
            });
        }
        const badges = [];
        if (projectCount >= 10) badges.push("Project Master - 10 Projects");
        else if (projectCount >= 5) badges.push("Project Builder - 5 Projects");
        if (cvCount >= 5) badges.push("CV Creator - 5 CVs");
        if (likeCount >= 25) badges.push("Popular - 25 Likes");
        res.json({ badges, projectCount, cvCount, likeCount });
    } catch (err) {
        console.error("Achievements error:", err);
        res.status(500).json({ error: "Failed to fetch achievements" });
    }
});

export default router;

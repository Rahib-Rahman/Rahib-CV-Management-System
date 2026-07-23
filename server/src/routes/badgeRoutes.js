import express from "express";
import Project from "../models/Project.js";
import CV from "../models/CV.js";
import Like from "../models/Like.js";
import Badge from "../models/Badge.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get ("/", authenticate, async (req, res) => {
    try {
         const projectCount = await Project.count({ where: { userId: req.user.id } });
        const cvCount = await CV.count({ where: { userId: req.user.id } });
         const likeCount = await Like.count({ where: { userId: req.user.id } });
        const badges = [];
         if (projectCount >= 10) {
             badges.push({name: "Project Master", description: "Completed 10 projects", iconUrl: "/icons/project-master.png",
            });
        } else if (projectCount >= 5) {
            badges.push({name: "Project Builder", description: "Completed 5 projects",
                iconUrl: "/icons/project-builder.png",
            });
        }

         if (cvCount >= 5) {
            badges.push({name: "CV Creator", description: "Created 5 CVs",
                iconUrl: "/icons/cv-creator.png",
            });
        }
         if (likeCount >= 25) {
            badges.push({name: "Popular", description: "Received 25 likes", iconUrl: "/icons/popular.png",
            });
        }
         for (const badge of badges) {
             await Badge.findOrCreate({
                where: { name: badge.name },
                defaults: {
                    description: badge.description, iconUrl: badge.iconUrl,
                },
            });
        }
         const allBadges = await Badge.findAll();

        res.json({ badges, projectCount, cvCount, likeCount, allBadges });
    } catch (err) {
        console.error("Badge error:", err);
        res.status(500).json({ error: "Failed to load badges" });
    }
});

export default router;














import express from "express";
import AuditLog from "../models/AuditLog.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get ("/", authenticate, authorize(["admin"]), async (req, res) =>  {
    try  {
         const logs = await AuditLog.findAll( {order: [["timestamp", "DESC"]], attributes: { exclude: ["updatedAt"] },
        });
        res.json(logs);
    } catch (err) {
         console.error("Audit logs error:", err);
        res.status(500).json({ error: "Failed to fetch audit logs" });
    }
});

export default router;

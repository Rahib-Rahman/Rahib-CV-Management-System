import express from "express";
import Attribute from "../models/Attribute.js";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { logAction } from "../utils/logAction.js";

const router = express.Router();

router.get ("/", async (req, res) =>  {
    try  {const attributes = await Attribute.findAll ({ order: [["name", "ASC"]] });
    res.json (attributes);
    } catch (err)  {console.error ("Get attributes error:", err );
        res.status(500).json({ error: "Failed to fetch attributes" });
    }
});

router.post ("/", authenticate, authorize(["recruiter", "admin"]), async (req, res) =>  {
    try  {
         const { name, category, description, type } = req.body;
        if (!name || !category || !type)  {
            return res.status(400).json ({ error: "Name, category, and type are required"  });
        }
        const attr = await Attribute.create({ name, category, description, type });
         await logAction("Attribute", attr.id, "create", req.user.id );
        res.json(attr);
    } catch (err) {
         console.error("Create attribute error:", err);
        res.status(500).json({ error: "Failed to create attribute" });
    }
});

router.put ("/:id", authenticate, authorize (["recruiter", "admin"]), async (req, res) =>  {
    try {
         const { name, category, description, type } = req.body;
        const attr = await Attribute.findByPk(req.params.id);
         if (!attr) return res.status(404).json({ error: "Attribute not found"  });
        await attr.update({
            name: name ?? attr.name,
             category: category ?? attr.category,
             description: description ?? attr.description,
            type: type ?? attr.type,
        });
        await logAction("Attribute", attr.id, "update", req.user.id);
        res.json(attr);
    } catch (err) {
        console.error("Update attribute error:", err);
        res.status(500).json({ error: "Failed to update attribute" });
    }
});

router.delete ("/:id", authenticate, authorize(["recruiter", "admin"]), async (req, res) =>  {
    try {
         const attr = await Attribute.findByPk(req.params.id );
        if (!attr) return res.status(404).json({ error: "Attribute not found"  });
        await attr.destroy();
         await logAction("Attribute", req.params.id, "delete", req.user.id );
        res.json({ message: "Attribute deleted" });
    } catch (err) {
        console.error("Delete attribute error:", err );
        res.status(500).json({ error: "Failed to delete attribute" });
    }
});

export default router;


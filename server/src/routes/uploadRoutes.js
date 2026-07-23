import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import { authenticate } from "../middleware/authMiddleware.js";
import { logAction } from "../utils/logAction.js";

const router = express.Router();

const upload = multer( {
    dest:  "uploads/",
    limits:  { fileSize: 5 * 1024 * 1024  },
});

router.post ("/",  authenticate, upload.single ("file"), async  (req, res) =>  {
    try   {
        if (!req.file)   {
            return res.status(400).json({  error: "No file uploaded"  });
        }
        const allowedTypes = [ "image/jpeg", "image/png", "application/pdf" ];
        if  ( !allowedTypes.includes ( req.file.mimetype  ))  {
            fs.unlink(req.file.path,  () => {}  ) ;
            return res.status(400).json({ error: "Invalid file type"  });
        }
        const result = await cloudinary.uploader.upload( req.file.path,   {
            folder: "cv-management",
        });
        fs.unlink(req.file.path, (err) =>  {
            if (err) console.error ("Failed to remove temp file:", err);
        });
        await logAction("Upload", null, "file-upload", req.user.id);
        res.json({ url: result.secure_url });
    } catch (err)  {
        console.error("Upload error:", err);
        if (req.file)  {
            fs.unlink(req.file.path, () => {});
        }
        res.status(500).json({ error: "Upload failed" });
    }
});

export default router;

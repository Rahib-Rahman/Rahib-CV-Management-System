import express from "express";
import Profile from "../models/Profile.js";
import User from "../models/User.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { logAction } from "../utils/logAction.js";

const router = express.Router();

router.get ("/", authenticate, async (req, res) => {
    try {
         let profile = await Profile.findOne({ where: { userId: req.user.id } });
        if (!profile) {
            const user = await User.findByPk(req.user.id);
            profile = await Profile.create({userId: req.user.id, firstName: user?.name || "First", lastName: "Last", location: "", photoUrl: "", attributes: {}, version: 0
            });
        }
        res.json(profile);
    } catch (err)  {
         console.error("Profile error:", err);
        res.status(500).json({ error: "Failed to load profile" });
    }
});

router.put ("/", authenticate, async (req, res) => {
    try {
         const { firstName, lastName, location, photoUrl, attributes, version } = req.body;
        if (version === undefined) {
             return res.status(400).json({ error: "Version is required for update" });
        }
         let profile = await Profile.findOne({ where: { userId: req.user.id } });
        if (!profile) {
             profile = await Profile.create({userId: req.user.id, firstName: firstName || "First", lastName: lastName || "Last", location: location || "", photoUrl: photoUrl || "", attributes: attributes || {}, version: 0
            });
            return res.json(profile);
        }
        if (profile.version !== version) {
            return res.status(409).json({ error: "Version conflict. Reload profile.", currentVersion: profile.version });
        }
        profile.firstName = firstName ?? profile.firstName;
        profile.lastName = lastName ?? profile.lastName;
        profile.location = location ?? profile.location;
        profile.photoUrl = photoUrl ?? profile.photoUrl;
        profile.attributes = attributes ?? profile.attributes;
        profile.version += 1;
        await profile.save();
        await logAction("Profile", profile.id, "update", req.user.id);
        res.json(profile);
    } catch (err) {
        console.error("Profile update error:", err);
        res.status(500).json({ error: "Failed to update profile" });
    }
});

export default router;


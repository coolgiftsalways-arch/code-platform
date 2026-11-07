import express from "express";

import Announcement from "../models/Announcement.js";
import Registration from "../models/Registration.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

// GET /api/announcements
// Announcements for everyone + for the challenges this student joined.
router.get("/", requireAuth, async (req, res) => {
  try {
    const joined = await Registration.find({
      user: req.user._id,
      paymentStatus: { $in: ["Paid", "Free"] },
    }).distinct("challenge");

    const announcements = await Announcement.find({
      $or: [{ challenge: null }, { challenge: { $in: joined } }],
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("challenge", "title slug");

    return res.json({
      success: true,
      announcements: announcements.map((a) => ({
        id: a._id,
        title: a.title,
        body: a.body,
        createdAt: a.createdAt,
        challenge: a.challenge ? { title: a.challenge.title, slug: a.challenge.slug } : null,
      })),
    });
  } catch (error) {
    console.error("❌ Announcements error:", error);
    return res.status(500).json({ success: false, message: "Unable to load announcements." });
  }
});

export default router;

import express from "express";

import {
  getDefenseParticipants,
  scheduleDefense,
  completeDefense,
  cancelDefense,
} from "../controllers/defenseController.js";
import { requireAdmin } from "../middleware/requireAuth.js";

const router = express.Router();

// Admin only (these used to be open to anyone).
router.use(requireAdmin);


router.get("/", getDefenseParticipants);

router.patch("/:id/schedule", scheduleDefense);

router.patch("/:id/complete", completeDefense);

router.patch("/:id/cancel", cancelDefense);

export default router;

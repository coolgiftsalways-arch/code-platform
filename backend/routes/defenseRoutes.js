import express from "express";

import {
  getDefenseParticipants,
  scheduleDefense,
  completeDefense,
  cancelDefense,
} from "../controllers/defenseController.js";

const router = express.Router();

router.get("/", getDefenseParticipants);

router.patch("/:id/schedule", scheduleDefense);

router.patch("/:id/complete", completeDefense);

router.patch("/:id/cancel", cancelDefense);

export default router;

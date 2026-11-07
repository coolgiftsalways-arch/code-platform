import express from "express";

import {
  getWinners,
  getEligibleFinalists,
  makeWinner,
  removeWinner,
} from "../controllers/winnerController.js";
import { requireAdmin } from "../middleware/requireAuth.js";

const router = express.Router();

// Admin only (these used to be open to anyone).
router.use(requireAdmin);


router.get("/", getWinners);

router.get("/finalists", getEligibleFinalists);

router.post("/make", makeWinner);

router.patch("/remove/:id", removeWinner);

export default router;

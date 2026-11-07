import express from "express";

import {
  listChallenges,
  getChallenge,
  registerForChallenge,
} from "../controllers/challengeController.js";
import { optionalAuth, requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

// GET  /api/challenges              all published challenges
router.get("/", optionalAuth, listChallenges);

// GET  /api/challenges/:slug        one challenge
router.get("/:slug", optionalAuth, getChallenge);

// POST /api/challenges/:slug/register   join (pay with Razorpay if it has a fee)
router.post("/:slug/register", requireAuth, registerForChallenge);

export default router;

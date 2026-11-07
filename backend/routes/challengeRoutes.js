import express from "express";

import {
  listChallenges,
  getChallenge,
  registerForChallenge,
} from "../controllers/challengeController.js";
import {
  checkCoupon,
  getChallengeExtras,
  listProjects,
} from "../controllers/showcaseController.js";
import { optionalAuth, requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

// GET  /api/challenges              all published challenges
router.get("/", optionalAuth, listChallenges);

// GET  /api/challenges/:slug        one challenge
router.get("/:slug", optionalAuth, getChallenge);

// GET  /api/challenges/:slug/extras      updates, winners, category, gallery info
router.get("/:slug/extras", getChallengeExtras);

// GET  /api/challenges/:slug/projects    public project gallery (when switched on)
router.get("/:slug/projects", listProjects);

// POST /api/challenges/:slug/coupon      preview a coupon's price
router.post("/:slug/coupon", requireAuth, checkCoupon);

// POST /api/challenges/:slug/register   join (pay with Razorpay if it has a fee)
router.post("/:slug/register", requireAuth, registerForChallenge);

export default router;

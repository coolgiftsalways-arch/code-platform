import express from "express";

import {
  getWinners,
  getEligibleFinalists,
  makeWinner,
  removeWinner,
} from "../controllers/winnerController.js";

const router = express.Router();

router.get("/", getWinners);

router.get("/finalists", getEligibleFinalists);

router.post("/make", makeWinner);

router.patch("/remove/:id", removeWinner);

export default router;

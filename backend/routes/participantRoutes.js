import express from "express";

import {
  createParticipant,
  getParticipants,
  getParticipant,
} from "../controllers/ParticipantController.js";

const router = express.Router();

/*
=========================================================
CREATE
POST /api/participants
=========================================================
*/

router.post("/", createParticipant);

/*
=========================================================
GET ALL
GET /api/participants
=========================================================
*/

router.get("/", getParticipants);

/*
=========================================================
GET ONE
GET /api/participants/:id
=========================================================
*/

router.get("/:id", getParticipant);

export default router;

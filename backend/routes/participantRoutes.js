import express from "express";

import {
  createParticipant,
  getParticipants,
  getParticipant,
  updateParticipantStatus,
  deleteParticipant,
} from "../controllers/ParticipantController.js";

const router = express.Router();

/* =========================================================
   CREATE
   POST /api/participants
========================================================= */

router.post("/", createParticipant);

/* =========================================================
   GET ALL
   GET /api/participants
========================================================= */

router.get("/", getParticipants);

/* =========================================================
   UPDATE STATUS
   PATCH /api/participants/:id/status
========================================================= */

router.patch("/:id/status", updateParticipantStatus);

/* =========================================================
   DELETE
   DELETE /api/participants/:id
========================================================= */

router.delete("/:id", deleteParticipant);

/* =========================================================
   GET ONE
   GET /api/participants/:id

   Keep this last because /:id is generic.
========================================================= */

router.get("/:id", getParticipant);

console.log("✅ Participant routes loaded");

console.log("✅ DELETE /api/participants/:id enabled");

export default router;

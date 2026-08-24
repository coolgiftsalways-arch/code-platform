import express from "express";

import { createParticipant } from "../controllers/ParticipantController.js";

const router = express.Router();

/*
=========================================================
PROJECT SUBMISSION
POST /api/projects/submit
=========================================================

The Upload.jsx form submits here.

We save the submission as a Participant because your
Admin Participants page reads from Participant.
=========================================================
*/

router.post("/submit", createParticipant);

/*
=========================================================
API TEST
GET /api/projects
=========================================================
*/

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Projects API is working",
  });
});

export default router;

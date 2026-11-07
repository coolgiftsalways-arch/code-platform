import express from "express";

import {
  getMyRegistrations,
  getMyRegistration,
  getPaymentStatus,
  renewPaymentLink,
  saveSubmission,
} from "../controllers/registrationController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

// Everything here is the logged-in student's own data.
router.use(requireAuth);

// GET  /api/registrations/my                 dashboard list
router.get("/my", getMyRegistrations);

// GET  /api/registrations/:id                one registration
router.get("/:id", getMyRegistration);

// GET  /api/registrations/:id/payment-status polled while paying
router.get("/:id/payment-status", getPaymentStatus);

// POST /api/registrations/:id/payment-link   new link after expiry
router.post("/:id/payment-link", renewPaymentLink);

// PUT  /api/registrations/:id/submission     save draft / submit project
router.put("/:id/submission", saveSubmission);

export default router;

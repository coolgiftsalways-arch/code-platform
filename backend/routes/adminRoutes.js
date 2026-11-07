import express from "express";

import {
  getStats,
  listChallenges,
  getChallenge,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  listRegistrations,
  getRegistration,
  updateRegistration,
  markPaidManually,
  bulkStatus,
  listStudents,
  getStudent,
  setRole,
  listAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} from "../controllers/adminController.js";
import { requireAdmin } from "../middleware/requireAuth.js";

const router = express.Router();

// Every /api/admin route needs an admin login.
router.use(requireAdmin);

router.get("/stats", getStats);

router.get("/challenges", listChallenges);
router.post("/challenges", createChallenge);
router.get("/challenges/:id", getChallenge);
router.put("/challenges/:id", updateChallenge);
router.delete("/challenges/:id", deleteChallenge);

router.get("/registrations", listRegistrations);
router.post("/registrations/bulk-status", bulkStatus);
router.get("/registrations/:id", getRegistration);
router.patch("/registrations/:id", updateRegistration);
router.post("/registrations/:id/mark-paid", markPaidManually);

router.get("/students", listStudents);
router.get("/students/:id", getStudent);
router.patch("/students/:id/role", setRole);

router.get("/announcements", listAnnouncements);
router.post("/announcements", createAnnouncement);
router.delete("/announcements/:id", deleteAnnouncement);

export default router;

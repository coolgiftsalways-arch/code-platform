import express from "express";

import {
  registerUser,
  loginUser,
  getMe,
  updateMe,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", requireAuth, getMe);
router.put("/me", requireAuth, updateMe);
router.put("/password", requireAuth, changePassword);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;

import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { passwordResetEmail, sendEmail, sendLater, siteUrl, welcomeEmail } from "../utils/mailer.js";

const createToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing in .env");
  }

  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// What the website is allowed to see about a student.
export function publicUser(user) {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    institute: user.institute || "",
    city: user.city || "",
    className: user.className || "",
    github: user.github || "",
    linkedin: user.linkedin || "",
    role: user.role || "student",
  };
}

const clean = (value, max = 200) => String(value ?? "").trim().slice(0, max);

// ==========================================
// REGISTER (student account)
// POST /api/auth/register
// ==========================================

export const registerUser = async (req, res) => {
  try {
    const body = req.body || {};

    const firstName = clean(body.firstName, 60);
    const lastName = clean(body.lastName, 60);
    const email = clean(body.email, 120).toLowerCase();
    const phone = clean(body.phone, 20).replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
    const password = String(body.password || "");

    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in your name, email, mobile number and password.",
      });
    }

    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, message: "Enter a valid email address." });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ success: false, message: "Enter a valid 10-digit mobile number." });
    }

    if (password.length < 8 || password.length > 100) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists. Please log in.",
      });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      institute: clean(body.institute, 150),
      city: clean(body.city, 80),
      className: clean(body.className, 80),
      classAddress: clean(body.classAddress, 200),
      address: clean(body.address, 300),
      password: await bcrypt.hash(password, 12),
    });

    sendLater(welcomeEmail(user));

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token: createToken(user._id),
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Register error:", error);

    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists. Please log in.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error during registration",
    });
  }
};

// ==========================================
// LOGIN
// POST /api/auth/login
// ==========================================

export const loginUser = async (req, res) => {
  try {
    const email = clean(req.body?.email, 120).toLowerCase();
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token: createToken(user._id),
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// ==========================================
// CURRENT STUDENT
// GET /api/auth/me   (needs Authorization: Bearer <token>)
// ==========================================

export const getMe = (req, res) => res.json({ success: true, user: publicUser(req.user) });

// ==========================================
// UPDATE MY PROFILE
// PUT /api/auth/me   (logged in)
// ==========================================

const optionalUrl = (value, label) => {
  const url = clean(value, 300);
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
    return url;
  } catch {
    throw new Error(`${label} must be a full link starting with https://`);
  }
};

export const updateMe = async (req, res) => {
  try {
    const body = req.body || {};
    const firstName = clean(body.firstName, 60);
    const lastName = clean(body.lastName, 60);
    const phone = clean(body.phone, 20).replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");

    if (!firstName || !lastName) {
      return res.status(400).json({ success: false, message: "First and last name are required." });
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ success: false, message: "Enter a valid 10-digit mobile number." });
    }

    let github;
    let linkedin;
    try {
      github = optionalUrl(body.github, "GitHub");
      linkedin = optionalUrl(body.linkedin, "LinkedIn");
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        firstName,
        lastName,
        phone,
        institute: clean(body.institute, 150),
        city: clean(body.city, 80),
        className: clean(body.className, 80),
        github,
        linkedin,
      },
      { returnDocument: "after" },
    );

    return res.json({ success: true, message: "Profile saved.", user: publicUser(user) });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ success: false, message: "Unable to save your profile." });
  }
};

// ==========================================
// CHANGE PASSWORD
// PUT /api/auth/password   { currentPassword, newPassword }
// ==========================================

export const changePassword = async (req, res) => {
  try {
    const currentPassword = String(req.body?.currentPassword || "");
    const newPassword = String(req.body?.newPassword || "");

    if (newPassword.length < 8 || newPassword.length > 100) {
      return res.status(400).json({ success: false, message: "New password must be at least 8 characters." });
    }

    const user = await User.findById(req.user._id);
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(400).json({ success: false, message: "Your current password is wrong." });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return res.json({ success: true, message: "Password changed." });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ success: false, message: "Unable to change password." });
  }
};

// ==========================================
// FORGOT PASSWORD
// POST /api/auth/forgot-password   { email }
// Always answers the same way so nobody can test which emails exist.
// ==========================================

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");
const RESET_LIFETIME_MS = 60 * 60 * 1000; // 1 hour
const lastResetRequest = new Map(); // email -> time, to slow down repeated requests

export const forgotPassword = async (req, res) => {
  const generic = {
    success: true,
    message: "If an account exists for that email, we've sent a link to reset the password.",
  };

  try {
    const email = clean(req.body?.email, 120).toLowerCase();
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, message: "Enter a valid email address." });
    }

    const last = lastResetRequest.get(email) || 0;
    if (Date.now() - last < 60 * 1000) return res.json(generic);
    lastResetRequest.set(email, Date.now());

    const user = await User.findOne({ email });
    if (!user) return res.json(generic);

    const token = crypto.randomBytes(32).toString("hex");
    user.resetTokenHash = hashToken(token);
    user.resetTokenExpires = new Date(Date.now() + RESET_LIFETIME_MS);
    await user.save();

    await sendEmail(passwordResetEmail({ user, url: `${siteUrl()}/reset-password?token=${token}` }));

    return res.json(generic);
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.json(generic);
  }
};

// ==========================================
// RESET PASSWORD
// POST /api/auth/reset-password   { token, password }
// ==========================================

export const resetPassword = async (req, res) => {
  try {
    const token = String(req.body?.token || "");
    const password = String(req.body?.password || "");

    if (password.length < 8 || password.length > 100) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
    }

    const user = token
      ? await User.findOne({ resetTokenHash: hashToken(token), resetTokenExpires: { $gt: new Date() } })
      : null;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "This reset link is invalid or has expired. Ask for a new one.",
      });
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetTokenHash = null;
    user.resetTokenExpires = null;
    await user.save();

    return res.json({
      success: true,
      message: "Password updated. You're logged in.",
      token: createToken(user._id),
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ success: false, message: "Unable to reset password." });
  }
};

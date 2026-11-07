import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

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

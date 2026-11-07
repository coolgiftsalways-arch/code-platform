import jwt from "jsonwebtoken";

import User from "../models/User.js";

function readToken(req) {
  const header = req.get("authorization") || "";
  return header.startsWith("Bearer ") ? header.slice(7).trim() : "";
}

async function loadUser(req) {
  const token = readToken(req);
  if (!token || !process.env.JWT_SECRET) return null;

  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    return await User.findById(userId).select("-password");
  } catch {
    return null;
  }
}

// Student must be logged in: sets req.user or answers 401.
export async function requireAuth(req, res, next) {
  const user = await loadUser(req);

  if (!user) {
    return res.status(401).json({ success: false, message: "Please log in to continue." });
  }

  req.user = user;
  return next();
}

// Sets req.user when a valid token is sent, but never blocks.
export async function optionalAuth(req, _res, next) {
  req.user = await loadUser(req);
  return next();
}

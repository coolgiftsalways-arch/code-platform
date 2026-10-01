import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import participantRoutes from "./routes/participantRoutes.js";
import defenseRoutes from "./routes/defenseRoutes.js";
import winnerRoutes from "./routes/winnerRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

/* =========================================================
   APP
========================================================= */

const app = express();

/* =========================================================
   __dirname FIX FOR ES MODULES
========================================================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

/* =========================================================
   HEALTH CHECK

   IMPORTANT:
   We use /api/health instead of /
   because / will now be your React website.
========================================================= */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "DEVNEX backend is running",
    status: "online",
  });
});

/* =========================================================
   API ROUTES
========================================================= */

app.use("/api/auth", authRoutes);

app.use("/api/participants", participantRoutes);

app.use("/api/defense", defenseRoutes);

app.use("/api/winners", winnerRoutes);

app.use("/api/projects", projectRoutes);

/* =========================================================
   API 404

   Only /api routes should return JSON 404.

   IMPORTANT:
   Do NOT put a global 404 here because it would block
   React Router pages.
========================================================= */

app.use("/api", (req, res) => {
  console.log(`❌ API route not found: ${req.method} ${req.originalUrl}`);

  res.status(404).json({
    success: false,
    message: "API route not found",
    method: req.method,
    path: req.originalUrl,
  });
});

/* =========================================================
   FRONTEND BUILD
========================================================= */

const frontendDistPath = path.resolve(__dirname, "../frontend/dist");

const frontendIndexPath = path.join(frontendDistPath, "index.html");

/* =========================================================
   SERVE REACT / VITE FILES
========================================================= */

if (fs.existsSync(frontendIndexPath)) {
  console.log("✅ Frontend build found");
  console.log(`📁 ${frontendDistPath}`);

  /*
   * Serve JS, CSS, images and other Vite assets
   */
  app.use(express.static(frontendDistPath));

  /*
   * React Router fallback
   *
   * Examples:
   *
   * /
   * /login
   * /participants
   * /dashboard
   * /winners
   *
   * All load index.html and React Router handles them.
   */
  app.use((req, res, next) => {
    /*
     * Don't return React HTML for API requests.
     */
    if (req.path.startsWith("/api/")) {
      return next();
    }

    /*
     * Only frontend GET requests should get index.html.
     */
    if (req.method !== "GET") {
      return next();
    }

    return res.sendFile(frontendIndexPath);
  });
} else {
  /*
   * This normally happens during local backend development
   * before running:
   *
   * npm run build --prefix frontend
   */

  console.log("");
  console.log("⚠️ Frontend build not found.");
  console.log("⚠️ Backend will run in API-only mode.");
  console.log(`Expected: ${frontendIndexPath}`);
  console.log("");

  app.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: "DEVNEX backend is running",
      frontend: "Frontend build not found",
    });
  });
}

/* =========================================================
   FINAL 404
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    method: req.method,
    path: req.originalUrl,
  });
});

/* =========================================================
   ERROR HANDLER
========================================================= */

app.use((error, req, res, next) => {
  console.error("❌ Server error:", error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

/* =========================================================
   START SERVER
========================================================= */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, "0.0.0.0", () => {
      console.log("");
      console.log("=================================");
      console.log("🚀 DEVNEX FULL STACK SERVER");
      console.log("=================================");
      console.log(`🌐 Port: ${PORT}`);
      console.log(`🔗 Local: http://localhost:${PORT}`);
      console.log("");
      console.log("📡 API ROUTES");
      console.log("---------------------------------");
      console.log(`GET  http://localhost:${PORT}/api/health`);
      console.log(`POST http://localhost:${PORT}/api/projects/submit`);
      console.log(`GET  http://localhost:${PORT}/api/participants`);
      console.log("---------------------------------");
      console.log("🎨 React frontend served by Express");
      console.log("=================================");
      console.log("");
    });
  } catch (error) {
    console.error("❌ Unable to start server:", error.message);

    process.exit(1);
  }
};

startServer();

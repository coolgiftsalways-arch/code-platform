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
   PORT
========================================================= */

const PORT = process.env.PORT || 5000;

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  }),
);

app.use(
  express.json({
    limit: "10mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  }),
);

/* =========================================================
   REQUEST LOGGER
========================================================= */

app.use((req, _res, next) => {
  console.log(`📡 ${req.method} ${req.originalUrl}`);

  next();
});

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/api/health", (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "DEVNEX backend is running",
    status: "online",
  });
});

/* =========================================================
   API ROUTES

   IMPORTANT:
   KEEP ALL API ROUTES ABOVE THE /api 404 HANDLER
========================================================= */

/* =========================================================
   AUTH
========================================================= */

app.use("/api/auth", authRoutes);

/* =========================================================
   PARTICIPANTS

   POST   /api/participants
   GET    /api/participants
   GET    /api/participants/:id
   PATCH  /api/participants/:id/status
   DELETE /api/participants/:id
========================================================= */

app.use("/api/participants", participantRoutes);

/* =========================================================
   DEFENSE
========================================================= */

app.use("/api/defense", defenseRoutes);

/* =========================================================
   WINNERS
========================================================= */

app.use("/api/winners", winnerRoutes);

/* =========================================================
   PROJECTS
========================================================= */

app.use("/api/projects", projectRoutes);

/* =========================================================
   API 404

   MUST STAY AFTER ALL /api ROUTES
========================================================= */

app.use("/api", (req, res) => {
  console.log(`❌ API route not found: ${req.method} ${req.originalUrl}`);

  return res.status(404).json({
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
   SERVE REACT / VITE
========================================================= */

if (fs.existsSync(frontendIndexPath)) {
  console.log("");
  console.log("✅ Frontend build found");
  console.log(`📁 ${frontendDistPath}`);
  console.log("");

  /* =======================================================
     STATIC FILES
  ======================================================= */

  app.use(express.static(frontendDistPath));

  /* =======================================================
     REACT ROUTER FALLBACK
  ======================================================= */

  app.use((req, res, next) => {
    /*
      API requests should never receive React HTML.
    */

    if (req.path.startsWith("/api/")) {
      return next();
    }

    /*
      Only GET frontend routes receive index.html.
    */

    if (req.method !== "GET") {
      return next();
    }

    return res.sendFile(frontendIndexPath, (error) => {
      if (error) {
        next(error);
      }
    });
  });
} else {
  console.log("");
  console.log("⚠️ Frontend build not found.");
  console.log("⚠️ Backend running in API-only mode.");
  console.log(`Expected: ${frontendIndexPath}`);
  console.log("");

  app.get("/", (_req, res) => {
    return res.status(200).json({
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
  return res.status(404).json({
    success: false,
    message: "Route not found",
    method: req.method,
    path: req.originalUrl,
  });
});

/* =========================================================
   ERROR HANDLER
========================================================= */

app.use((error, _req, res, next) => {
  console.error("❌ Server error:", error);

  if (res.headersSent) {
    return next(error);
  }

  return res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

/* =========================================================
   START SERVER
========================================================= */

const startServer = async () => {
  try {
    /* =====================================================
       CONNECT DATABASE
    ===================================================== */

    await connectDB();

    /* =====================================================
       START SERVER
    ===================================================== */

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

      console.log(`GET    http://localhost:${PORT}/api/health`);

      console.log(`GET    http://localhost:${PORT}/api/participants`);

      console.log(`POST   http://localhost:${PORT}/api/participants`);

      console.log(`GET    http://localhost:${PORT}/api/participants/:id`);

      console.log(
        `PATCH  http://localhost:${PORT}/api/participants/:id/status`,
      );

      console.log(`DELETE http://localhost:${PORT}/api/participants/:id`);

      console.log(`POST   http://localhost:${PORT}/api/projects/submit`);

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

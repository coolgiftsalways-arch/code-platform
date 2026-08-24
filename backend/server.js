import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import participantRoutes from "./routes/participantRoutes.js";
import defenseRoutes from "./routes/defenseRoutes.js";
import winnerRoutes from "./routes/winnerRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

const app = express();

/*
=========================================================
MIDDLEWARE
=========================================================
*/

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

/*
=========================================================
HEALTH CHECK
=========================================================
*/

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HUBWEB backend is running",
    status: "online",
  });
});

/*
=========================================================
API ROUTES
=========================================================
*/

app.use("/api/auth", authRoutes);

app.use("/api/participants", participantRoutes);

app.use("/api/defense", defenseRoutes);

app.use("/api/winners", winnerRoutes);

/*
=========================================================
PROJECT SUBMISSION

Upload.jsx:
POST /api/projects/submit

This creates a Participant in MongoDB.
=========================================================
*/

app.use("/api/projects", projectRoutes);

/*
=========================================================
404
=========================================================
*/

app.use((req, res) => {
  console.log(`❌ API route not found: ${req.method} ${req.originalUrl}`);

  res.status(404).json({
    success: false,
    message: "API route not found",
    method: req.method,
    path: req.originalUrl,
  });
});

/*
=========================================================
ERROR HANDLER
=========================================================
*/

app.use((error, req, res, next) => {
  console.error("❌ Server error:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: error.message,
  });
});

/*
=========================================================
START SERVER
=========================================================
*/

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("");
      console.log("=================================");
      console.log("🚀 HUBWEB BACKEND");
      console.log("=================================");
      console.log(`🌐 Port: ${PORT}`);
      console.log(`🔗 http://localhost:${PORT}`);
      console.log("");
      console.log("📡 API ROUTES");
      console.log("---------------------------------");
      console.log(`POST http://localhost:${PORT}/api/projects/submit`);
      console.log(`GET  http://localhost:${PORT}/api/participants`);
      console.log("=================================");
      console.log("");
    });
  } catch (error) {
    console.error("❌ Unable to start backend:", error.message);

    process.exit(1);
  }
};

startServer();

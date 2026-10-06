import mongoose from "mongoose";

import Participant from "../models/Participant.js";

/* =========================================================
   HELPERS
========================================================= */

function normalizeTechStack(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function isValidMongoId(id) {
  return mongoose.Types.ObjectId.isValid(String(id || ""));
}

/* =========================================================
   CREATE PARTICIPANT
   POST /api/participants
========================================================= */

export const createParticipant = async (req, res) => {
  try {
    const body = req.body || {};

    const payload = {
      ...body,

      email: String(body.email || "")
        .trim()
        .toLowerCase(),

      techStack: normalizeTechStack(body.techStack),

      status: String(body.status || "Application Received").trim(),

      paymentStatus: String(body.paymentStatus || "Pending").trim(),
    };

    const participant = await Participant.create(payload);

    return res.status(201).json({
      success: true,

      message: "Participant created successfully.",

      participant,
    });
  } catch (error) {
    console.error("❌ Create participant error:", error);

    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,

        message:
          "A participant with the same unique information already exists.",
      });
    }

    if (error?.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,

      message: "Failed to create participant.",

      error: error.message,
    });
  }
};

/* =========================================================
   GET ALL PARTICIPANTS
   GET /api/participants
========================================================= */

export const getParticipants = async (_req, res) => {
  try {
    const participants = await Participant.find({}).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,

      count: participants.length,

      participants,
    });
  } catch (error) {
    console.error("❌ Get participants error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch participants.",

      error: error.message,
    });
  }
};

/* =========================================================
   GET ONE PARTICIPANT
   GET /api/participants/:id
========================================================= */

export const getParticipant = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidMongoId(id)) {
      return res.status(400).json({
        success: false,

        message: "Invalid participant ID.",
      });
    }

    const participant = await Participant.findById(id);

    if (!participant) {
      return res.status(404).json({
        success: false,

        message: "Participant not found.",
      });
    }

    return res.status(200).json({
      success: true,
      participant,
    });
  } catch (error) {
    console.error("❌ Get participant error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to fetch participant.",

      error: error.message,
    });
  }
};

/* =========================================================
   UPDATE PARTICIPANT STATUS
   PATCH /api/participants/:id/status
========================================================= */

export const updateParticipantStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const status = String(req.body?.status || "").trim();

    if (!isValidMongoId(id)) {
      return res.status(400).json({
        success: false,

        message: "Invalid participant ID.",
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,

        message: "Status is required.",
      });
    }

    const participant = await Participant.findByIdAndUpdate(
      id,
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!participant) {
      return res.status(404).json({
        success: false,

        message: "Participant not found.",
      });
    }

    return res.status(200).json({
      success: true,

      message: "Participant status updated successfully.",

      participant,
    });
  } catch (error) {
    console.error("❌ Update participant status error:", error);

    if (error?.name === "ValidationError") {
      return res.status(400).json({
        success: false,

        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,

      message: "Failed to update participant status.",

      error: error.message,
    });
  }
};

/* =========================================================
   DELETE PARTICIPANT
   DELETE /api/participants/:id
========================================================= */

export const deleteParticipant = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🗑 DELETE PARTICIPANT REQUEST:", id);

    if (!isValidMongoId(id)) {
      return res.status(400).json({
        success: false,

        message: "Invalid participant ID.",
      });
    }

    const participant = await Participant.findByIdAndDelete(id);

    if (!participant) {
      return res.status(404).json({
        success: false,

        message: "Participant not found.",
      });
    }

    console.log("✅ PARTICIPANT DELETED:", id);

    return res.status(200).json({
      success: true,

      message: "Participant deleted successfully.",

      deletedParticipantId: id,
    });
  } catch (error) {
    console.error("❌ Delete participant error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to delete participant.",

      error: error.message,
    });
  }
};

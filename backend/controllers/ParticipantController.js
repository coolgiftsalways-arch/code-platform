import mongoose from "mongoose";

import Participant from "../models/Participant.js";
import { ENTRY_FEE, createPaymentLink } from "../utils/razorpay.js";

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

// Fields the public form must never set itself (payment, results, admin state).
const PROTECTED_FIELDS = [
  "_id",
  "status",
  "paymentStatus",
  "finalistFee",
  "razorpayOrderId",
  "razorpayPaymentId",
  "razorpayPaymentLinkId",
  "paymentUrl",
  "paymentLinkExpiresAt",
  "paidAt",
  "defenseSlot",
  "defenseStatus",
  "defenseNotes",
  "finalistPass",
  "certificateIssued",
  "isWinner",
  "winnerRank",
  "winnerAt",
  "createdAt",
  "updatedAt",
];

function buildParticipantPayload(body = {}) {
  const payload = { ...body };

  for (const field of PROTECTED_FIELDS) delete payload[field];

  return {
    ...payload,

    email: String(body.email || "")
      .trim()
      .toLowerCase(),

    techStack: normalizeTechStack(body.techStack),

    status: "Application Received",

    paymentStatus: "Pending",

    finalistFee: ENTRY_FEE,
  };
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
    const payload = buildParticipantPayload(req.body);

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
   SUBMIT PROJECT + START ENTRY FEE PAYMENT
   POST /api/projects/submit

   Same flow as lights.bio checkout: build the participant,
   create a fixed-amount Razorpay payment link, then save.
   The participant stays "Pending" until Razorpay confirms.
========================================================= */

export const submitProject = async (req, res) => {
  const participant = new Participant(buildParticipantPayload(req.body));

  try {
    await participant.validate();
  } catch (error) {
    const first = Object.values(error.errors || {})[0];

    return res.status(400).json({
      success: false,
      message: first ? first.message : "Please check your details.",
    });
  }

  try {
    await createPaymentLink(participant, req);
  } catch (error) {
    console.error("❌ Razorpay payment link error:", error.error || error.message);

    return res.status(502).json({
      success: false,
      message: "Couldn't start payment. Please try again.",
    });
  }

  try {
    await participant.save();
  } catch (error) {
    console.error("❌ Submit project error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save your submission. Please try again.",
    });
  }

  return res.status(201).json({
    success: true,
    message: "Project submitted. Complete the entry fee payment.",
    participantId: participant._id,
    amount: participant.finalistFee,
    paymentUrl: participant.paymentUrl,
  });
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

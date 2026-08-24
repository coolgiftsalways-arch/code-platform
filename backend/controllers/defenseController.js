import mongoose from "mongoose";
import Participant from "../models/Participant.js";

// ==========================================
// GET DEFENSE PARTICIPANTS
// ==========================================

export const getDefenseParticipants = async (req, res) => {
  try {
    const participants = await Participant.find({
      $or: [
        {
          defenseStatus: "Scheduled",
        },
        {
          defenseStatus: "Completed",
        },
      ],
    }).sort({
      defenseSlot: 1,
    });

    return res.status(200).json({
      success: true,
      participants,
    });
  } catch (error) {
    console.error("Get defense participants error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch defense participants",
    });
  }
};

// ==========================================
// SCHEDULE DEFENSE
// ==========================================

export const scheduleDefense = async (req, res) => {
  try {
    const { id } = req.params;
    const { defenseSlot } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid participant ID",
      });
    }

    if (!defenseSlot) {
      return res.status(400).json({
        success: false,
        message: "Defense slot is required",
      });
    }

    const slot = new Date(defenseSlot);

    if (Number.isNaN(slot.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid defense date",
      });
    }

    const participant = await Participant.findById(id);

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Participant not found",
      });
    }

    participant.defenseSlot = slot;
    participant.defenseStatus = "Scheduled";
    participant.status = "Defense Scheduled";

    await participant.save();

    return res.status(200).json({
      success: true,
      message: "Defense scheduled successfully",
      participant,
    });
  } catch (error) {
    console.error("Schedule defense error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to schedule defense",
    });
  }
};

// ==========================================
// COMPLETE DEFENSE
// ==========================================

export const completeDefense = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid participant ID",
      });
    }

    const participant = await Participant.findById(id);

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Participant not found",
      });
    }

    participant.defenseStatus = "Completed";
    participant.technicalDefense = true;

    await participant.save();

    return res.status(200).json({
      success: true,
      message: "Defense marked as completed",
      participant,
    });
  } catch (error) {
    console.error("Complete defense error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to complete defense",
    });
  }
};

// ==========================================
// CANCEL DEFENSE
// ==========================================

export const cancelDefense = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid participant ID",
      });
    }

    const participant = await Participant.findById(id);

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Participant not found",
      });
    }

    participant.defenseSlot = null;
    participant.defenseStatus = "Not Scheduled";

    if (participant.status === "Defense Scheduled") {
      participant.status = "Qualified";
    }

    await participant.save();

    return res.status(200).json({
      success: true,
      message: "Defense cancelled",
      participant,
    });
  } catch (error) {
    console.error("Cancel defense error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel defense",
    });
  }
};

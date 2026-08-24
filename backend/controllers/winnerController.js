import Participant from "../models/Participant.js";

// ==========================================
// GET ALL WINNERS
// ==========================================

export const getWinners = async (req, res) => {
  try {
    const winners = await Participant.find({
      isWinner: true,
    }).sort({
      winnerRank: 1,
    });

    return res.status(200).json({
      success: true,
      winners,
    });
  } catch (error) {
    console.error("Get winners error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch winners",
    });
  }
};

// ==========================================
// GET ELIGIBLE FINALISTS
// ==========================================

export const getEligibleFinalists = async (req, res) => {
  try {
    const finalists = await Participant.find({
      $or: [
        {
          status: "Finalist Confirmed",
        },
        {
          finalistPass: true,
        },
      ],
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      finalists,
    });
  } catch (error) {
    console.error("Get finalists error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch finalists",
    });
  }
};

// ==========================================
// MAKE WINNER
// ==========================================

export const makeWinner = async (req, res) => {
  try {
    const { participantId, winnerRank } = req.body;

    if (!participantId || !winnerRank) {
      return res.status(400).json({
        success: false,
        message: "Participant and winner position are required",
      });
    }

    const allowedRanks = ["1st Place", "2nd Place", "3rd Place"];

    if (!allowedRanks.includes(winnerRank)) {
      return res.status(400).json({
        success: false,
        message: "Invalid winner position",
      });
    }

    const participant = await Participant.findById(participantId);

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Participant not found",
      });
    }

    if (
      participant.status !== "Finalist Confirmed" &&
      participant.finalistPass !== true
    ) {
      return res.status(400).json({
        success: false,
        message: "Only confirmed finalists can become winners",
      });
    }

    if (participant.isWinner === true && participant.winnerRank) {
      return res.status(400).json({
        success: false,
        message: `Participant is already ${participant.winnerRank}`,
      });
    }

    const existingWinner = await Participant.findOne({
      winnerRank,
      isWinner: true,
      _id: {
        $ne: participantId,
      },
    });

    if (existingWinner) {
      return res.status(400).json({
        success: false,
        message: `${winnerRank} is already assigned to another participant`,
      });
    }

    participant.isWinner = true;
    participant.winnerRank = winnerRank;
    participant.winnerAt = new Date();

    await participant.save();

    return res.status(200).json({
      success: true,
      message: `${participant.fullName} is now ${winnerRank}`,
      winner: participant,
    });
  } catch (error) {
    console.error("Make winner error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to make winner",
    });
  }
};

// ==========================================
// REMOVE WINNER
// ==========================================

export const removeWinner = async (req, res) => {
  try {
    const { id } = req.params;

    const participant = await Participant.findById(id);

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Participant not found",
      });
    }

    participant.isWinner = false;
    participant.winnerRank = null;
    participant.winnerAt = null;

    await participant.save();

    return res.status(200).json({
      success: true,
      message: "Winner status removed",
      participant,
    });
  } catch (error) {
    console.error("Remove winner error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove winner",
    });
  }
};

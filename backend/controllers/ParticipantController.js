import Participant from "../models/Participant.js";

/*
=========================================================
CREATE PARTICIPANT
POST /api/participants
=========================================================
*/

export const createParticipant = async (req, res) => {
  try {
    const data = req.body;

    console.log("=================================");
    console.log("📥 CREATE PARTICIPANT");
    console.log("=================================");
    console.log(data);

    if (!data.email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    /*
    -------------------------------------------------------
    PREVENT DUPLICATE EMAIL
    -------------------------------------------------------
    */

    const existingParticipant = await Participant.findOne({
      email: data.email.toLowerCase().trim(),
    });

    if (existingParticipant) {
      return res.status(409).json({
        success: false,
        message: "A participant with this email already exists",
        participant: existingParticipant,
      });
    }

    /*
    -------------------------------------------------------
    NORMALIZE TECH STACK
    -------------------------------------------------------
    */

    let techStack = [];

    if (Array.isArray(data.techStack)) {
      techStack = data.techStack;
    } else if (typeof data.techStack === "string") {
      techStack = data.techStack
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    /*
    -------------------------------------------------------
    CREATE PARTICIPANT
    -------------------------------------------------------
    */

    const participant = await Participant.create({
      firstName: data.firstName || "",
      lastName: data.lastName || "",

      fullName:
        data.fullName ||
        `${data.firstName || ""} ${data.lastName || ""}`.trim(),

      age:
        data.age !== undefined && data.age !== null && data.age !== ""
          ? Number(data.age)
          : null,

      mobile: data.mobile || data.phone || "",
      phone: data.phone || data.mobile || "",

      email: data.email.toLowerCase().trim(),

      gmail: data.gmail || data.email || "",

      city: data.city || "",

      address: data.address || "",

      linkedin: data.linkedin || "",

      /*
      -----------------------------------------------------
      INSTITUTE
      -----------------------------------------------------
      */

      instituteName: data.instituteName || "",

      instituteCode: data.instituteCode || "",

      className: data.className || "",

      classAddress: data.classAddress || "",

      /*
      -----------------------------------------------------
      PROJECT
      -----------------------------------------------------
      */

      projectTitle: data.projectTitle || "",

      category: data.category || "",

      techStack,

      githubUrl: data.githubUrl || "",

      liveDemoUrl: data.liveDemoUrl || "",

      /*
      -----------------------------------------------------
      AI / VERIFICATION
      -----------------------------------------------------
      */

      aiTool: data.aiTool || "None",

      technicalDefense:
        data.technicalDefense === true || data.technicalDefense === "true",

      hiringOptIn: data.hiringOptIn === true || data.hiringOptIn === "true",

      /*
      -----------------------------------------------------
      DEFAULT ADMIN VALUES
      -----------------------------------------------------
      */

      status: "Application Received",

      paymentStatus: "Pending",

      finalistFee: 399,

      razorpayOrderId: null,

      razorpayPaymentId: null,

      defenseStatus: "Not Scheduled",

      defenseSlot: null,

      defenseNotes: "",

      finalistPass: false,

      certificateIssued: false,

      isWinner: false,

      winnerRank: null,

      winnerAt: null,

      /*
      -----------------------------------------------------
      ADDONS
      -----------------------------------------------------
      */

      addons: {
        codeFeedback: data.addons?.codeFeedback === true,

        physicalRecognition: data.addons?.physicalRecognition === true,

        championShowcase: data.addons?.championShowcase === true,
      },
    });

    console.log("✅ PARTICIPANT CREATED");
    console.log(participant._id);

    return res.status(201).json({
      success: true,
      message: "Participant registered successfully",
      participant,
    });
  } catch (error) {
    console.error("❌ Create participant error:", error);

    /*
    -------------------------------------------------------
    MONGOOSE VALIDATION ERROR
    -------------------------------------------------------
    */

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((item) => item.message);

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    /*
    -------------------------------------------------------
    DUPLICATE KEY
    -------------------------------------------------------
    */

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A participant with this email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create participant",
      error: error.message,
    });
  }
};

/*
=========================================================
GET ALL PARTICIPANTS
GET /api/participants
=========================================================
*/

export const getParticipants = async (req, res) => {
  try {
    const participants = await Participant.find({})
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: participants.length,
      participants,
    });
  } catch (error) {
    console.error("❌ Get participants error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch participants",
      error: error.message,
    });
  }
};

/*
=========================================================
GET SINGLE PARTICIPANT
GET /api/participants/:id
=========================================================
*/

export const getParticipant = async (req, res) => {
  try {
    const { id } = req.params;

    const participant = await Participant.findById(id).lean();

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Participant not found",
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
      message: "Failed to fetch participant",
      error: error.message,
    });
  }
};

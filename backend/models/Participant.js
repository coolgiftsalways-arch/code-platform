import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    // ==========================================
    // PERSONAL DETAILS
    // ==========================================

    firstName: {
      type: String,
      trim: true,
      default: "",
    },

    lastName: {
      type: String,
      trim: true,
      default: "",
    },

    fullName: {
      type: String,
      trim: true,
      default: "",
    },

    age: {
      type: Number,
      default: null,
    },

    mobile: {
      type: String,
      trim: true,
      default: "",
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    gmail: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      default: "",
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    linkedin: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================================
    // INSTITUTE DETAILS
    // ==========================================

    instituteName: {
      type: String,
      trim: true,
      default: "",
    },

    instituteCode: {
      type: String,
      trim: true,
      default: "",
    },

    className: {
      type: String,
      trim: true,
      default: "",
    },

    classAddress: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================================
    // PROJECT DETAILS
    // ==========================================

    projectTitle: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: String,
      enum: ["Web Dev", "Mobile Apps", "AI / ML", "SaaS", "Cybersecurity", ""],
      default: "",
    },

    techStack: {
      type: [String],
      default: [],
    },

    githubUrl: {
      type: String,
      trim: true,
      default: "",
    },

    liveDemoUrl: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================================
    // AI / VERIFICATION
    // ==========================================

    aiTool: {
      type: String,
      enum: ["Cursor", "ChatGPT", "Claude", "None", ""],
      default: "None",
    },

    technicalDefense: {
      type: Boolean,
      default: false,
    },

    hiringOptIn: {
      type: Boolean,
      default: false,
    },

    // ==========================================
    // QUALIFICATION
    // ==========================================

    status: {
      type: String,
      enum: [
        "Application Received",
        "Screening",
        "Qualified",
        "Defense Scheduled",
        "Finalist Confirmed",
      ],
      default: "Application Received",
    },

    // ==========================================
    // PAYMENT
    // ==========================================

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },

    finalistFee: {
      type: Number,
      default: 399,
    },

    razorpayOrderId: {
      type: String,
      default: null,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
    },

    // ==========================================
    // ADDONS
    // ==========================================

    addons: {
      codeFeedback: {
        type: Boolean,
        default: false,
      },

      physicalRecognition: {
        type: Boolean,
        default: false,
      },

      championShowcase: {
        type: Boolean,
        default: false,
      },
    },

    // ==========================================
    // DEFENSE
    // ==========================================

    defenseSlot: {
      type: Date,
      default: null,
    },

    defenseStatus: {
      type: String,
      enum: ["Not Scheduled", "Scheduled", "Completed"],
      default: "Not Scheduled",
    },

    defenseNotes: {
      type: String,
      default: "",
    },

    // ==========================================
    // FINALIST
    // ==========================================

    finalistPass: {
      type: Boolean,
      default: false,
    },

    certificateIssued: {
      type: Boolean,
      default: false,
    },

    // ==========================================
    // WINNER
    // ==========================================

    isWinner: {
      type: Boolean,
      default: false,
    },

    winnerRank: {
      type: String,
      enum: ["1st Place", "2nd Place", "3rd Place", null],
      default: null,
    },

    winnerAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Participant = mongoose.model("Participant", participantSchema);

export default Participant;

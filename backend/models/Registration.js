import mongoose from "mongoose";

// The steps a student moves through, shown as a tracker on the dashboard.
export const REGISTRATION_STATUSES = [
  "Pending Payment",
  "Registered",
  "Submitted",
  "Screening",
  "Qualified",
  "Defense Scheduled",
  "Finalist",
  "Winner",
  "Not Selected",
];

const submissionSchema = new mongoose.Schema(
  {
    projectTitle: { type: String, trim: true, maxlength: 120, default: "" },
    description: { type: String, trim: true, maxlength: 3000, default: "" },
    techStack: { type: [String], default: [] },
    githubUrl: { type: String, trim: true, default: "" },
    liveDemoUrl: { type: String, trim: true, default: "" },
    videoUrl: { type: String, trim: true, default: "" },
    aiTool: {
      type: String,
      enum: ["Cursor", "ChatGPT", "Claude", "Copilot", "Other", "None", ""],
      default: "",
    },
    submittedAt: { type: Date, default: null },
  },
  { _id: false, timestamps: { createdAt: false, updatedAt: "updatedAt" } },
);

const registrationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    challenge: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge", required: true },

    status: {
      type: String,
      enum: REGISTRATION_STATUSES,
      default: "Pending Payment",
    },

    // ----- payment (same Razorpay payment link flow as lights.bio) -----
    amount: { type: Number, default: 0 }, // rupees, copied from the challenge
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Free"], default: "Pending" },
    razorpayPaymentLinkId: { type: String, default: null, index: true },
    paymentUrl: { type: String, default: null },
    paymentLinkExpiresAt: { type: Date, default: null },
    razorpayPaymentId: { type: String, default: null },
    paidAt: { type: Date, default: null },
    // Set when an admin marks a payment as received outside Razorpay.
    manualPaymentNote: { type: String, trim: true, default: "" },
    // Test coupon used for this registration (see utils/coupon.js).
    couponCode: { type: String, trim: true, default: "" },

    // ----- project -----
    submission: { type: submissionSchema, default: () => ({}) },

    // ----- judging (set by admin) -----
    defenseSlot: { type: Date, default: null },
    winnerRank: { type: String, default: null },
    adminNote: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

// One registration per student per challenge.
registrationSchema.index({ user: 1, challenge: 1 }, { unique: true });

const Registration = mongoose.model("Registration", registrationSchema);

export default Registration;

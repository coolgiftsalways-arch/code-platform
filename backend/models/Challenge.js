import mongoose from "mongoose";

const prizeSchema = new mongoose.Schema(
  {
    place: { type: String, trim: true, required: true },
    reward: { type: String, trim: true, required: true },
  },
  { _id: false },
);

const challengeSchema = new mongoose.Schema(
  {
    // Used in the URL: /challenges/ai-ml-season-01
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, "Slug can only have a-z, 0-9 and -"],
    },

    title: { type: String, required: true, trim: true },
    tagline: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },

    category: {
      type: String,
      enum: ["Web Dev", "Mobile Apps", "AI / ML", "SaaS", "Cybersecurity", "Open"],
      default: "Open",
    },

    coverImage: { type: String, trim: true, default: "" },

    // Entry fee in rupees. 0 = free.
    fee: { type: Number, min: 0, default: 999 },

    registrationDeadline: { type: Date, required: true },
    submissionDeadline: { type: Date, required: true },
    resultsAt: { type: Date, default: null },

    prizes: { type: [prizeSchema], default: [] },
    rules: { type: [String], default: [] },
    eligibility: { type: String, trim: true, default: "" },

    // Only published challenges are shown on the website.
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// open | submissions | judging | ended
export function challengePhase(challenge, now = new Date()) {
  if (now <= challenge.registrationDeadline) return "open";
  if (now <= challenge.submissionDeadline) return "submissions";
  if (!challenge.resultsAt || now < challenge.resultsAt) return "judging";
  return "ended";
}

const Challenge = mongoose.model("Challenge", challengeSchema);

export default Challenge;

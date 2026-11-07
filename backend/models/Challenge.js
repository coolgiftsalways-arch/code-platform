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

    // Who runs it (shown on the card), e.g. "DEVNEX" or a sponsor name.
    host: { type: String, trim: true, default: "DEVNEX" },

    // Total prize money in rupees (used for "Prize amount" sorting).
    prizePool: { type: Number, min: 0, default: 0 },

    // Interest tags shown on the card and used in filters.
    tags: { type: [String], default: [] },

    // Featured challenges are shown first.
    isFeatured: { type: Boolean, default: false },

    // Entry fee in rupees. 0 = free.
    fee: { type: Number, min: 0, default: 999 },

    // When registration opens. Before this the challenge shows as "Upcoming".
    startAt: { type: Date, default: null },

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

// upcoming | open | submissions | judging | ended
export function challengePhase(challenge, now = new Date()) {
  if (challenge.startAt && now < challenge.startAt) return "upcoming";
  if (now <= challenge.registrationDeadline) return "open";
  if (now <= challenge.submissionDeadline) return "submissions";
  if (!challenge.resultsAt || now < challenge.resultsAt) return "judging";
  return "ended";
}

const Challenge = mongoose.model("Challenge", challengeSchema);

export default Challenge;

// Adds / updates the DEVNEX challenges in MongoDB.
// Run from the backend folder:   npm run seed:challenges
// Edit the list below and run it again any time: challenges are matched by slug.
// All dates are India time (+05:30). Amounts are in rupees. All challenges are online.

import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

const { default: connectDB } = await import("../config/db.js");
const { default: Challenge } = await import("../models/Challenge.js");

const ist = (date, time = "23:59:59") => new Date(`${date}T${time}+05:30`);

const RULES = [
  "Your project must be your own work, built for this challenge.",
  "Code must be in a public GitHub repository.",
  "Your project needs a working live demo link.",
  "Say honestly which AI tools you used. Using AI is allowed.",
  "Shortlisted students must explain their code in a live technical defense.",
];

const ELIGIBILITY = "Open to all school and college students in India. Solo participation.";

// Shared settings for the five Season 01 tracks.
const SEASON_01 = {
  host: "DEVNEX",
  fee: 999,
  startAt: ist("2026-11-01", "00:00:00"),
  registrationDeadline: ist("2026-12-15"),
  submissionDeadline: ist("2027-01-10"),
  resultsAt: ist("2027-01-31", "18:00:00"),
  prizePool: 50000,
  prizes: [
    { place: "1st Place", reward: "₹25,000 + Champion trophy + certificate" },
    { place: "2nd Place", reward: "₹15,000 + certificate" },
    { place: "3rd Place", reward: "₹10,000 + certificate" },
    { place: "All finalists", reward: "Finalist certificate + Hall of Fame listing" },
  ],
  rules: RULES,
  eligibility: ELIGIBILITY,
  isPublished: true,
};

const CHALLENGES = [
  {
    ...SEASON_01,
    slug: "ai-ml-s01",
    title: "AI / ML Challenge",
    category: "AI / ML",
    isFeatured: true,
    tags: ["Machine Learning/AI", "Python", "Beginner Friendly"],
    tagline: "Put a model to work on a real use case.",
    description:
      "Train, fine-tune or integrate AI models into a product that does something useful. Show your data, your approach and a working demo.",
  },
  {
    ...SEASON_01,
    slug: "web-dev-s01",
    title: "Web Dev Challenge",
    category: "Web Dev",
    isFeatured: true,
    tags: ["Web", "Full Stack", "Beginner Friendly"],
    tagline: "Build a full-stack web app that solves a real problem.",
    description:
      "Design and ship a web application people would actually use. Frontend, backend and database: show you can build the whole thing and deploy it.",
  },
  {
    ...SEASON_01,
    slug: "mobile-apps-s01",
    title: "Mobile Apps Challenge",
    category: "Mobile Apps",
    tags: ["Mobile", "Android", "iOS", "Flutter"],
    tagline: "Build an Android, iOS or cross-platform app.",
    description:
      "Create a mobile app with a clean experience and a clear purpose. Native, React Native or Flutter are all welcome.",
  },
  {
    ...SEASON_01,
    slug: "saas-s01",
    title: "SaaS Challenge",
    category: "SaaS",
    tags: ["SaaS", "Startups", "Web"],
    tagline: "Build a product someone would pay for.",
    description:
      "Build a software-as-a-service product with sign-up, a core feature that delivers value, and a clear idea of who your customer is.",
  },
  {
    ...SEASON_01,
    slug: "cybersecurity-s01",
    title: "Cybersecurity Challenge",
    category: "Cybersecurity",
    tags: ["Cybersecurity", "Networking", "Open Ended"],
    tagline: "Build a tool that makes something safer.",
    description:
      "Create a security tool, scanner, or a hardened application. Explain the threat you defend against and how your project handles it.",
  },

  // Free entry-level challenge.
  {
    slug: "first-build-48h",
    title: "First Build: 48-Hour Starter Challenge",
    category: "Open",
    host: "DEVNEX Community",
    fee: 0,
    startAt: ist("2026-11-05", "00:00:00"),
    registrationDeadline: ist("2026-11-28"),
    submissionDeadline: ist("2026-11-30"),
    resultsAt: ist("2026-12-07", "18:00:00"),
    prizePool: 10000,
    isFeatured: true,
    tags: ["Beginner Friendly", "Open Ended", "Free"],
    tagline: "Never built a project before? Ship your first one in a weekend.",
    description:
      "A free, low-pressure challenge for first-time builders. Pick any idea, build it in 48 hours and submit. Every valid submission gets a certificate.",
    prizes: [
      { place: "Top 3", reward: "₹3,000 each + DEVNEX swag" },
      { place: "Every valid submission", reward: "Participation certificate" },
    ],
    rules: RULES.slice(0, 4),
    eligibility: ELIGIBILITY,
    isPublished: true,
  },

  // Sponsor-hosted.
  {
    slug: "fintech-buildathon-blr",
    title: "FinTech Buildathon",
    category: "Web Dev",
    host: "DEVNEX × Partners",
    fee: 499,
    startAt: ist("2026-11-10", "00:00:00"),
    registrationDeadline: ist("2026-12-05"),
    submissionDeadline: ist("2026-12-14"),
    resultsAt: ist("2026-12-14", "20:00:00"),
    prizePool: 75000,
    tags: ["FinTech", "Web", "APIs"],
    tagline: "Build the future of payments, savings or lending.",
    description:
      "Build a payments, savings or lending product with guidance from industry mentors in live online sessions.",
    prizes: [
      { place: "Winner", reward: "₹40,000 + internship interview" },
      { place: "Runner-up", reward: "₹20,000" },
      { place: "Best UI", reward: "₹15,000" },
    ],
    rules: RULES,
    eligibility: "Open to all college students in India. Solo participation.",
    isPublished: true,
  },

  // Upcoming: registration not open yet.
  {
    slug: "winter-sprint-2027",
    title: "Winter Sprint 2027",
    category: "Open",
    host: "DEVNEX",
    fee: 999,
    startAt: ist("2027-01-15", "00:00:00"),
    registrationDeadline: ist("2027-02-10"),
    submissionDeadline: ist("2027-03-01"),
    resultsAt: ist("2027-03-15", "18:00:00"),
    prizePool: 100000,
    tags: ["Open Ended", "Machine Learning/AI", "Web"],
    tagline: "Our biggest challenge yet. Any track, any stack.",
    description:
      "Build anything you like. The top 20 projects present live in an online finale.",
    prizes: [
      { place: "Grand prize", reward: "₹50,000" },
      { place: "Runner-ups (5)", reward: "₹10,000 each" },
    ],
    rules: RULES,
    eligibility: ELIGIBILITY,
    isPublished: true,
  },

  // Ended: shows in the "Ended" filter.
  {
    slug: "devnex-pilot-2026",
    title: "DEVNEX Pilot 2026",
    category: "Open",
    host: "DEVNEX",
    fee: 0,
    startAt: ist("2026-08-01", "00:00:00"),
    registrationDeadline: ist("2026-08-20"),
    submissionDeadline: ist("2026-09-05"),
    resultsAt: ist("2026-09-20", "18:00:00"),
    prizePool: 15000,
    tags: ["Open Ended", "Beginner Friendly"],
    tagline: "The pilot that started it all.",
    description: "Our first pilot challenge. See the winners in the Hall of Fame.",
    prizes: [{ place: "Winner", reward: "₹10,000" }, { place: "Runner-up", reward: "₹5,000" }],
    rules: RULES.slice(0, 4),
    eligibility: ELIGIBILITY,
    isPublished: true,
  },
];

try {
  await connectDB();

  for (const challenge of CHALLENGES) {
    await Challenge.updateOne(
      { slug: challenge.slug },
      { $set: challenge, $unset: { mode: "", location: "" } },
      { upsert: true, runValidators: true },
    );
    console.log(`✅ ${challenge.title}`);
  }

  console.log(`\nDone: ${CHALLENGES.length} challenges saved.`);
} catch (error) {
  console.error("❌ Seeding failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}

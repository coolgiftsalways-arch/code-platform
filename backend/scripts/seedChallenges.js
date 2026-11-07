// Adds / updates the DEVNEX challenges in MongoDB.
// Run from the backend folder:   npm run seed:challenges
// Edit the list below and run it again any time: challenges are matched by slug.

import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

const { default: connectDB } = await import("../config/db.js");
const { default: Challenge } = await import("../models/Challenge.js");

const SEASON = {
  fee: 999,
  registrationDeadline: new Date("2026-12-15T23:59:59+05:30"),
  submissionDeadline: new Date("2027-01-10T23:59:59+05:30"),
  resultsAt: new Date("2027-01-31T18:00:00+05:30"),
  isPublished: true,
  eligibility: "Open to all school and college students in India. Solo participation.",
  rules: [
    "Your project must be your own work, built for this challenge.",
    "Code must be in a public GitHub repository.",
    "Your project needs a working live demo link.",
    "Say honestly which AI tools you used. Using AI is allowed.",
    "Shortlisted students must explain their code in a live technical defense.",
  ],
  prizes: [
    { place: "1st Place", reward: "₹25,000 + Champion trophy + certificate" },
    { place: "2nd Place", reward: "₹15,000 + certificate" },
    { place: "3rd Place", reward: "₹10,000 + certificate" },
    { place: "All finalists", reward: "Finalist certificate + Hall of Fame listing" },
  ],
};

const CHALLENGES = [
  {
    slug: "web-dev-s01",
    title: "Web Dev Challenge",
    category: "Web Dev",
    tagline: "Build a full-stack web app that solves a real problem.",
    description:
      "Design and ship a web application people would actually use. Frontend, backend and database: show you can build the whole thing and deploy it.",
  },
  {
    slug: "mobile-apps-s01",
    title: "Mobile Apps Challenge",
    category: "Mobile Apps",
    tagline: "Build an Android, iOS or cross-platform app.",
    description:
      "Create a mobile app with a clean experience and a clear purpose. Native, React Native or Flutter are all welcome.",
  },
  {
    slug: "ai-ml-s01",
    title: "AI / ML Challenge",
    category: "AI / ML",
    tagline: "Put a model to work on a real use case.",
    description:
      "Train, fine-tune or integrate AI models into a product that does something useful. Show your data, your approach and a working demo.",
  },
  {
    slug: "saas-s01",
    title: "SaaS Challenge",
    category: "SaaS",
    tagline: "Build a product someone would pay for.",
    description:
      "Build a software-as-a-service product with sign-up, a core feature that delivers value, and a clear idea of who your customer is.",
  },
  {
    slug: "cybersecurity-s01",
    title: "Cybersecurity Challenge",
    category: "Cybersecurity",
    tagline: "Build a tool that makes something safer.",
    description:
      "Create a security tool, scanner, or a hardened application. Explain the threat you defend against and how your project handles it.",
  },
];

try {
  await connectDB();

  for (const challenge of CHALLENGES) {
    await Challenge.updateOne(
      { slug: challenge.slug },
      { $set: { ...SEASON, ...challenge } },
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

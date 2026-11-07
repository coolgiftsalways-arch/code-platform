// Turns an existing account into an admin.
// 1. Sign up on the website with your email.
// 2. From the backend folder run:   npm run make-admin -- you@example.com
// Add --remove to take admin access away:   npm run make-admin -- you@example.com --remove

import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

const { default: connectDB } = await import("../config/db.js");
const { default: User } = await import("../models/User.js");

const email = String(process.argv[2] || "").trim().toLowerCase();
const remove = process.argv.includes("--remove");

if (!email || !email.includes("@")) {
  console.error("Usage: npm run make-admin -- you@example.com [--remove]");
  process.exit(1);
}

try {
  await connectDB();

  const user = await User.findOneAndUpdate(
    { email },
    { role: remove ? "student" : "admin" },
    { returnDocument: "after" },
  );

  if (!user) {
    console.error(`❌ No account with ${email} in the "${mongoose.connection.name}" database.`);

    // Show the newest accounts so you can spot a typo or a signup that didn't save.
    const recent = await User.find().sort({ createdAt: -1 }).limit(10).select("email role createdAt");

    if (recent.length) {
      console.log("\nNewest accounts in this database:");
      for (const u of recent) {
        console.log(`  ${u.email}${u.role === "admin" ? "  (admin)" : ""}  — ${u.createdAt?.toLocaleString?.() || ""}`);
      }
      console.log("\nIf yours is listed with a different spelling, run the command again with that email.");
    } else {
      console.log("\nThis database has no accounts yet.");
    }

    console.log(
      "If it isn't listed: sign up at http://localhost:5000/signup while `npm start` is running",
      "(the live website may use a different database), then run this again.",
    );
    process.exitCode = 1;
  } else {
    console.log(
      remove
        ? `✅ ${email} is no longer an admin.`
        : `✅ ${email} is now an admin. Log in at /admin/login`,
    );
  }
} catch (error) {
  console.error("❌", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
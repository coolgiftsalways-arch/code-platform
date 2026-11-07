import bcrypt from "bcryptjs";

import User from "../models/User.js";

// Creates / updates the admin account from environment variables, every time
// the server starts. No signup needed.
//
//   ADMIN_EMAIL=admin@devnex.institute
//   ADMIN_PASSWORD=a-long-secret-password
//
// - No account with that email yet -> it is created as an admin.
// - Account exists -> it is made an admin, and its password is set to
//   ADMIN_PASSWORD if you changed it.
// Leave both unset to skip this.
export default async function ensureAdmin() {
  const email = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || "");

  if (!email && !password) return;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.warn("⚠️ ADMIN_EMAIL is not a valid email. Admin account not set up.");
    return;
  }

  if (password.length < 8) {
    console.warn("⚠️ ADMIN_PASSWORD must be at least 8 characters. Admin account not set up.");
    return;
  }

  const user = await User.findOne({ email });

  if (!user) {
    await User.create({
      firstName: "DEVNEX",
      lastName: "Admin",
      email,
      phone: "0000000000",
      password: await bcrypt.hash(password, 12),
      role: "admin",
    });
    console.log(`👑 Admin account created: ${email}`);
    return;
  }

  const changes = {};
  if (user.role !== "admin") changes.role = "admin";
  if (!(await bcrypt.compare(password, user.password))) {
    changes.password = await bcrypt.hash(password, 12);
  }

  if (Object.keys(changes).length) {
    await User.updateOne({ _id: user._id }, { $set: changes });
    console.log(
      `👑 Admin account updated: ${email}${changes.password ? " (password changed)" : ""}`,
    );
  } else {
    console.log(`👑 Admin account ready: ${email}`);
  }
}

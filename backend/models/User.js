import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
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

    address: {
      type: String,
      trim: true,
      default: "",
    },

    institute: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // Optional public links shown on the student's projects.
    github: { type: String, trim: true, default: "" },
    linkedin: { type: String, trim: true, default: "" },

    // Forgot-password: only a hash of the emailed token is stored.
    resetTokenHash: { type: String, default: null },
    resetTokenExpires: { type: Date, default: null },

    // "admin" can open the admin panel. Make one with: npm run make-admin -- you@email.com
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;

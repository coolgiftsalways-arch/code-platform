import mongoose from "mongoose";

// A challenge track shown on /categories. Challenges point to a category by its `name`.
const categorySchema = new mongoose.Schema(
  {
    // Short label stored on challenges and shown on cards, e.g. "Web Dev".
    name: { type: String, required: true, unique: true, trim: true, maxlength: 40 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, "Slug can only have a-z, 0-9 and -"],
    },
    title: { type: String, required: true, trim: true, maxlength: 120 }, // "Web & Full-Stack Development"
    eyebrow: { type: String, trim: true, default: "", maxlength: 60 }, // "WEB SYSTEMS"
    description: { type: String, trim: true, default: "", maxlength: 1000 },
    stack: { type: [String], default: [] }, // technologies
    examples: { type: [String], default: [] }, // project ideas
    icon: { type: String, trim: true, default: "code" }, // one of the icons the website knows
    color: { type: String, trim: true, default: "indigo" }, // card colour theme
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Category = mongoose.model("Category", categorySchema);

export default Category;

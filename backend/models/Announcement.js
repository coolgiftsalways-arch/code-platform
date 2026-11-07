import mongoose from "mongoose";

// A message from DEVNEX shown on students' dashboards.
// challenge = null  -> every student sees it
// challenge = <id>  -> only students registered for that challenge
const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    body: { type: String, required: true, trim: true, maxlength: 5000 },
    challenge: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge", default: null },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true },
);

const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;

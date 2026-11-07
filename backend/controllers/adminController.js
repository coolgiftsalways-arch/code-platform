import mongoose from "mongoose";

import Announcement from "../models/Announcement.js";
import Challenge, { challengePhase } from "../models/Challenge.js";
import Registration, { REGISTRATION_STATUSES } from "../models/Registration.js";
import User from "../models/User.js";
import { shortId } from "../utils/razorpay.js";
import { testCouponCode } from "../utils/coupon.js";

/* =========================================================
   HELPERS
========================================================= */

const isId = (value) => mongoose.isValidObjectId(String(value || ""));
const clean = (value, max = 200) => String(value ?? "").trim().slice(0, max);
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const JOINED = ["Paid", "Free"];

function page(req, defaultLimit = 25) {
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || defaultLimit, 1), 5000);
  const pageNumber = Math.max(parseInt(req.query.page, 10) || 1, 1);
  return { limit, skip: (pageNumber - 1) * limit, page: pageNumber };
}

function fail(res, error, message) {
  console.error(`❌ Admin: ${message}:`, error);
  return res.status(500).json({ success: false, message });
}

const studentSummary = (user) =>
  user && {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    institute: user.institute || "",
    city: user.city || "",
    className: user.className || "",
    role: user.role || "student",
    createdAt: user.createdAt,
  };

function adminRegistration(registration) {
  const challenge = registration.challenge;

  return {
    id: registration._id,
    number: `DVX-${shortId(registration._id)}`,
    status: registration.status,
    paymentStatus: registration.paymentStatus,
    amount: registration.amount,
    razorpayPaymentId: registration.razorpayPaymentId,
    razorpayPaymentLinkId: registration.razorpayPaymentLinkId,
    manualPaymentNote: registration.manualPaymentNote,
    couponCode: registration.couponCode || "",
    paidAt: registration.paidAt,
    submission: registration.submission || {},
    defenseSlot: registration.defenseSlot,
    winnerRank: registration.winnerRank,
    adminNote: registration.adminNote,
    createdAt: registration.createdAt,
    updatedAt: registration.updatedAt,
    student: studentSummary(registration.user),
    challenge: challenge?._id
      ? {
          id: challenge._id,
          slug: challenge.slug,
          title: challenge.title,
          fee: challenge.fee,
          submissionDeadline: challenge.submissionDeadline,
        }
      : null,
  };
}

const USER_FIELDS = "firstName lastName email phone institute city className role createdAt";
const CHALLENGE_FIELDS = "slug title fee submissionDeadline";

// Per-challenge numbers: total registrations, joined (paid/free), submitted, revenue.
async function challengeNumbers(match = {}) {
  const rows = await Registration.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$challenge",
        registrations: { $sum: 1 },
        joined: { $sum: { $cond: [{ $in: ["$paymentStatus", JOINED] }, 1, 0] } },
        pendingPayment: { $sum: { $cond: [{ $eq: ["$paymentStatus", "Pending"] }, 1, 0] } },
        submitted: { $sum: { $cond: [{ $ifNull: ["$submission.submittedAt", false] }, 1, 0] } },
        revenue: { $sum: { $cond: [{ $eq: ["$paymentStatus", "Paid"] }, "$amount", 0] } },
      },
    },
  ]);

  return new Map(rows.map((row) => [String(row._id), row]));
}

const EMPTY_NUMBERS = { registrations: 0, joined: 0, pendingPayment: 0, submitted: 0, revenue: 0 };

/* =========================================================
   OVERVIEW
   GET /api/admin/stats
========================================================= */

export const getStats = async (_req, res) => {
  try {
    const [students, admins, statusRows, totalsRows, challenges, numbers, recent] = await Promise.all([
      User.countDocuments({ role: { $ne: "admin" } }),
      User.countDocuments({ role: "admin" }),
      Registration.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Registration.aggregate([
        {
          $group: {
            _id: null,
            registrations: { $sum: 1 },
            joined: { $sum: { $cond: [{ $in: ["$paymentStatus", JOINED] }, 1, 0] } },
            pendingPayment: { $sum: { $cond: [{ $eq: ["$paymentStatus", "Pending"] }, 1, 0] } },
            submitted: { $sum: { $cond: [{ $ifNull: ["$submission.submittedAt", false] }, 1, 0] } },
            revenue: { $sum: { $cond: [{ $eq: ["$paymentStatus", "Paid"] }, "$amount", 0] } },
          },
        },
      ]),
      Challenge.find().sort({ registrationDeadline: 1 }).select("slug title isPublished registrationDeadline submissionDeadline startAt resultsAt fee"),
      challengeNumbers(),
      Registration.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .populate("user", USER_FIELDS)
        .populate("challenge", CHALLENGE_FIELDS),
    ]);

    const since = new Date(Date.now() - 7 * 86400000);
    const newStudents7d = await User.countDocuments({ role: { $ne: "admin" }, createdAt: { $gte: since } });

    return res.json({
      success: true,
      stats: {
        students,
        admins,
        newStudents7d,
        ...(totalsRows[0] || EMPTY_NUMBERS),
        byStatus: Object.fromEntries(statusRows.map((row) => [row._id, row.count])),
        challenges: challenges.map((c) => ({
          id: c._id,
          slug: c.slug,
          title: c.title,
          isPublished: c.isPublished,
          phase: challengePhase(c),
          registrationDeadline: c.registrationDeadline,
          submissionDeadline: c.submissionDeadline,
          ...(numbers.get(String(c._id)) || EMPTY_NUMBERS),
        })),
        recent: recent.map(adminRegistration),
      },
      config: {
        razorpay: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
        razorpayMode: String(process.env.RAZORPAY_KEY_ID || "").startsWith("rzp_live_") ? "live" : "test",
        publicUrl: process.env.PUBLIC_URL || "",
        testCoupon: testCouponCode(),
      },
    });
  } catch (error) {
    return fail(res, error, "Unable to load stats");
  }
};

/* =========================================================
   CHALLENGES
========================================================= */

const CATEGORIES = ["Web Dev", "Mobile Apps", "AI / ML", "SaaS", "Cybersecurity", "Open"];

const slugify = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

function parseDate(value, label, { optional = false } = {}) {
  if (value === null || value === undefined || value === "") {
    if (optional) return null;
    throw new Error(`${label} is required.`);
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error(`${label} is not a valid date.`);
  return date;
}

function parseMoney(value, label) {
  const number = Number(value ?? 0);
  if (!Number.isFinite(number) || number < 0 || number > 10000000) {
    throw new Error(`${label} must be a number of rupees (0 or more).`);
  }
  return Math.round(number);
}

const stringList = (value, max, maxLength) =>
  (Array.isArray(value) ? value : String(value || "").split("\n"))
    .map((item) => clean(item, maxLength))
    .filter(Boolean)
    .slice(0, max);

// Turns the admin form into a safe Challenge document. Throws a readable Error.
function challengeInput(body = {}) {
  const title = clean(body.title, 120);
  if (!title) throw new Error("Title is required.");

  const slug = slugify(body.slug || title);
  if (!slug) throw new Error("Add a URL slug using letters and numbers.");

  const category = CATEGORIES.includes(body.category) ? body.category : "Open";

  const startAt = parseDate(body.startAt, "Registration opens", { optional: true });
  const registrationDeadline = parseDate(body.registrationDeadline, "Registration closes");
  const submissionDeadline = parseDate(body.submissionDeadline, "Submission deadline");
  const resultsAt = parseDate(body.resultsAt, "Results date", { optional: true });

  if (startAt && startAt > registrationDeadline) {
    throw new Error("Registration must open before it closes.");
  }
  if (registrationDeadline > submissionDeadline) {
    throw new Error("Registration must close on or before the submission deadline.");
  }
  if (resultsAt && resultsAt < submissionDeadline) {
    throw new Error("Results must come after the submission deadline.");
  }

  const prizes = (Array.isArray(body.prizes) ? body.prizes : [])
    .map((prize) => ({ place: clean(prize?.place, 80), reward: clean(prize?.reward, 200) }))
    .filter((prize) => prize.place && prize.reward)
    .slice(0, 20);

  return {
    title,
    slug,
    category,
    tagline: clean(body.tagline, 200),
    description: clean(body.description, 5000),
    host: clean(body.host, 80) || "DEVNEX",
    coverImage: clean(body.coverImage, 500),
    eligibility: clean(body.eligibility, 1000),
    fee: parseMoney(body.fee, "Entry fee"),
    prizePool: parseMoney(body.prizePool, "Prize pool"),
    startAt,
    registrationDeadline,
    submissionDeadline,
    resultsAt,
    prizes,
    rules: stringList(body.rules, 30, 300),
    tags: stringList(body.tags, 10, 40),
    isFeatured: body.isFeatured === true,
    isPublished: body.isPublished === true,
  };
}

function adminChallenge(challenge, numbers = EMPTY_NUMBERS) {
  return {
    ...challenge.toObject(),
    id: challenge._id,
    phase: challengePhase(challenge),
    ...numbers,
  };
}

// GET /api/admin/challenges
export const listChallenges = async (_req, res) => {
  try {
    const [challenges, numbers] = await Promise.all([
      Challenge.find().sort({ createdAt: -1 }),
      challengeNumbers(),
    ]);

    return res.json({
      success: true,
      challenges: challenges.map((c) => adminChallenge(c, numbers.get(String(c._id)))),
    });
  } catch (error) {
    return fail(res, error, "Unable to load challenges");
  }
};

// GET /api/admin/challenges/:id
export const getChallenge = async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(404).json({ success: false, message: "Challenge not found." });

    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ success: false, message: "Challenge not found." });

    const numbers = await challengeNumbers({ challenge: challenge._id });

    return res.json({ success: true, challenge: adminChallenge(challenge, numbers.get(String(challenge._id))) });
  } catch (error) {
    return fail(res, error, "Unable to load challenge");
  }
};

// POST /api/admin/challenges
export const createChallenge = async (req, res) => {
  let input;

  try {
    input = challengeInput(req.body);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }

  try {
    const challenge = await Challenge.create(input);
    return res.status(201).json({ success: true, challenge: adminChallenge(challenge) });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ success: false, message: `The URL slug "${input.slug}" is already used.` });
    }
    if (error?.name === "ValidationError") {
      return res.status(400).json({ success: false, message: Object.values(error.errors)[0]?.message });
    }
    return fail(res, error, "Unable to create challenge");
  }
};

// PUT /api/admin/challenges/:id
export const updateChallenge = async (req, res) => {
  if (!isId(req.params.id)) return res.status(404).json({ success: false, message: "Challenge not found." });

  let input;

  try {
    input = challengeInput(req.body);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }

  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ success: false, message: "Challenge not found." });

    // Changing the URL after students joined would break their links.
    if (input.slug !== challenge.slug && (await Registration.exists({ challenge: challenge._id }))) {
      return res.status(400).json({
        success: false,
        message: "Students have already registered, so the URL slug can't change.",
      });
    }

    challenge.set(input);
    await challenge.save();

    const numbers = await challengeNumbers({ challenge: challenge._id });

    return res.json({ success: true, challenge: adminChallenge(challenge, numbers.get(String(challenge._id))) });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ success: false, message: `The URL slug "${input.slug}" is already used.` });
    }
    if (error?.name === "ValidationError") {
      return res.status(400).json({ success: false, message: Object.values(error.errors)[0]?.message });
    }
    return fail(res, error, "Unable to update challenge");
  }
};

// DELETE /api/admin/challenges/:id   (only when nobody registered)
export const deleteChallenge = async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(404).json({ success: false, message: "Challenge not found." });

    if (await Registration.exists({ challenge: req.params.id })) {
      return res.status(409).json({
        success: false,
        message: "Students have registered for this challenge. Unpublish it instead of deleting.",
      });
    }

    const deleted = await Challenge.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Challenge not found." });

    await Announcement.deleteMany({ challenge: deleted._id });

    return res.json({ success: true });
  } catch (error) {
    return fail(res, error, "Unable to delete challenge");
  }
};

/* =========================================================
   REGISTRATIONS
========================================================= */

// Build a Mongo filter from ?challenge=&status=&payment=&submitted=&q=
async function registrationFilter(query) {
  const filter = {};

  if (isId(query.challenge)) filter.challenge = query.challenge;
  if (REGISTRATION_STATUSES.includes(query.status)) filter.status = query.status;
  if (["Pending", "Paid", "Free"].includes(query.payment)) filter.paymentStatus = query.payment;
  if (query.payment === "joined") filter.paymentStatus = { $in: JOINED };
  if (query.submitted === "yes") filter["submission.submittedAt"] = { $ne: null };
  if (query.submitted === "no") filter["submission.submittedAt"] = null;

  const q = clean(query.q, 100);

  if (q) {
    const or = [];

    // Registration number, e.g. DVX-8C6906
    const number = q.replace(/^dvx-?/i, "");
    if (/^[0-9a-f]{4,24}$/i.test(number)) {
      or.push({
        $expr: { $regexMatch: { input: { $toString: "$_id" }, regex: `${number.toLowerCase()}$` } },
      });
    }

    const regex = new RegExp(escapeRegex(q), "i");
    const users = await User.find({
      $or: [{ firstName: regex }, { lastName: regex }, { email: regex }, { phone: regex }, { institute: regex }],
    })
      .select("_id")
      .limit(1000);

    if (users.length) or.push({ user: { $in: users.map((u) => u._id) } });
    or.push({ "submission.projectTitle": regex });

    filter.$or = or;
  }

  return filter;
}

// GET /api/admin/registrations
export const listRegistrations = async (req, res) => {
  try {
    const filter = await registrationFilter(req.query);
    const { limit, skip, page: pageNumber } = page(req);

    const sort = req.query.sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    const [registrations, total] = await Promise.all([
      Registration.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("user", USER_FIELDS)
        .populate("challenge", CHALLENGE_FIELDS),
      Registration.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      total,
      page: pageNumber,
      pages: Math.max(1, Math.ceil(total / limit)),
      registrations: registrations.map(adminRegistration),
    });
  } catch (error) {
    return fail(res, error, "Unable to load registrations");
  }
};

// GET /api/admin/registrations/:id
export const getRegistration = async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(404).json({ success: false, message: "Registration not found." });

    const registration = await Registration.findById(req.params.id)
      .populate("user", USER_FIELDS)
      .populate("challenge", CHALLENGE_FIELDS);

    if (!registration) return res.status(404).json({ success: false, message: "Registration not found." });

    return res.json({ success: true, registration: adminRegistration(registration) });
  } catch (error) {
    return fail(res, error, "Unable to load registration");
  }
};

const JUDGING_STATUSES = REGISTRATION_STATUSES.filter((s) => s !== "Pending Payment");

// PATCH /api/admin/registrations/:id
// body: { status?, defenseSlot?, winnerRank?, adminNote? }
export const updateRegistration = async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(404).json({ success: false, message: "Registration not found." });

    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ success: false, message: "Registration not found." });

    const body = req.body || {};
    const unpaid = registration.paymentStatus === "Pending";

    if (body.status !== undefined) {
      if (!REGISTRATION_STATUSES.includes(body.status)) {
        return res.status(400).json({ success: false, message: "Unknown status." });
      }
      if (unpaid && body.status !== "Pending Payment") {
        return res.status(400).json({
          success: false,
          message: "This student hasn't paid yet. Mark the payment as received first.",
        });
      }
      if (!unpaid && body.status === "Pending Payment") {
        return res.status(400).json({ success: false, message: "This registration is already paid." });
      }
      registration.status = body.status;
    }

    if (body.defenseSlot !== undefined) {
      registration.defenseSlot = body.defenseSlot ? parseDate(body.defenseSlot, "Defense slot") : null;

      // Scheduling a defense moves earlier statuses forward automatically.
      const before = ["Registered", "Submitted", "Screening", "Qualified"];
      if (registration.defenseSlot && body.status === undefined && before.includes(registration.status)) {
        registration.status = "Defense Scheduled";
      }
    }

    if (body.winnerRank !== undefined) {
      registration.winnerRank = clean(body.winnerRank, 60) || null;
    }

    if (body.adminNote !== undefined) {
      registration.adminNote = clean(body.adminNote, 2000);
    }

    await registration.save();
    await registration.populate("user", USER_FIELDS);
    await registration.populate("challenge", CHALLENGE_FIELDS);

    return res.json({ success: true, registration: adminRegistration(registration) });
  } catch (error) {
    if (error?.message?.includes("not a valid date")) {
      return res.status(400).json({ success: false, message: error.message });
    }
    return fail(res, error, "Unable to update registration");
  }
};

// POST /api/admin/registrations/:id/mark-paid   body: { note }
// For payments received outside Razorpay (cash, bank transfer...).
export const markPaidManually = async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(404).json({ success: false, message: "Registration not found." });

    const note = clean(req.body?.note, 300);
    if (!note) {
      return res.status(400).json({ success: false, message: "Add a note, e.g. 'Paid by UPI, ref 1234'." });
    }

    const registration = await Registration.findOneAndUpdate(
      { _id: req.params.id, paymentStatus: "Pending" },
      {
        paymentStatus: "Paid",
        status: "Registered",
        paidAt: new Date(),
        razorpayPaymentId: "MANUAL",
        manualPaymentNote: `${note} (by ${req.user.email})`,
      },
      { returnDocument: "after" },
    )
      .populate("user", USER_FIELDS)
      .populate("challenge", CHALLENGE_FIELDS);

    if (!registration) {
      return res.status(409).json({ success: false, message: "This registration isn't waiting for payment." });
    }

    return res.json({ success: true, registration: adminRegistration(registration) });
  } catch (error) {
    return fail(res, error, "Unable to mark as paid");
  }
};

// POST /api/admin/registrations/bulk-status   body: { ids: [...], status }
export const bulkStatus = async (req, res) => {
  try {
    const ids = (Array.isArray(req.body?.ids) ? req.body.ids : []).filter(isId).slice(0, 1000);
    const status = req.body?.status;

    if (!ids.length) return res.status(400).json({ success: false, message: "Select at least one registration." });
    if (!JUDGING_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: "Pick a status." });
    }

    // Unpaid registrations are skipped.
    const result = await Registration.updateMany(
      { _id: { $in: ids }, paymentStatus: { $in: JOINED } },
      { status },
    );

    return res.json({
      success: true,
      updated: result.modifiedCount,
      skipped: ids.length - result.matchedCount,
    });
  } catch (error) {
    return fail(res, error, "Unable to update statuses");
  }
};

/* =========================================================
   STUDENTS
========================================================= */

// GET /api/admin/students?q=&role=
export const listStudents = async (req, res) => {
  try {
    const filter = {};
    const q = clean(req.query.q, 100);

    if (q) {
      const regex = new RegExp(escapeRegex(q), "i");
      filter.$or = [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { phone: regex },
        { institute: regex },
        { city: regex },
      ];
    }
    if (["student", "admin"].includes(req.query.role)) {
      filter.role = req.query.role === "student" ? { $ne: "admin" } : "admin";
    }

    const { limit, skip, page: pageNumber } = page(req);

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).select(USER_FIELDS),
      User.countDocuments(filter),
    ]);

    const counts = await Registration.aggregate([
      { $match: { user: { $in: users.map((u) => u._id) } } },
      {
        $group: {
          _id: "$user",
          registrations: { $sum: 1 },
          joined: { $sum: { $cond: [{ $in: ["$paymentStatus", JOINED] }, 1, 0] } },
          spent: { $sum: { $cond: [{ $eq: ["$paymentStatus", "Paid"] }, "$amount", 0] } },
        },
      },
    ]);
    const byUser = new Map(counts.map((row) => [String(row._id), row]));

    return res.json({
      success: true,
      total,
      page: pageNumber,
      pages: Math.max(1, Math.ceil(total / limit)),
      students: users.map((user) => ({
        ...studentSummary(user),
        registrations: byUser.get(String(user._id))?.registrations || 0,
        joined: byUser.get(String(user._id))?.joined || 0,
        spent: byUser.get(String(user._id))?.spent || 0,
      })),
    });
  } catch (error) {
    return fail(res, error, "Unable to load students");
  }
};

// GET /api/admin/students/:id
export const getStudent = async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(404).json({ success: false, message: "Student not found." });

    const user = await User.findById(req.params.id).select(USER_FIELDS);
    if (!user) return res.status(404).json({ success: false, message: "Student not found." });

    const registrations = await Registration.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate("user", USER_FIELDS)
      .populate("challenge", CHALLENGE_FIELDS);

    return res.json({
      success: true,
      student: studentSummary(user),
      registrations: registrations.map(adminRegistration),
    });
  } catch (error) {
    return fail(res, error, "Unable to load student");
  }
};

// PATCH /api/admin/students/:id/role   body: { role: "admin" | "student" }
export const setRole = async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(404).json({ success: false, message: "Student not found." });

    const role = req.body?.role;
    if (!["admin", "student"].includes(role)) {
      return res.status(400).json({ success: false, message: "Role must be admin or student." });
    }

    if (role === "student" && String(req.params.id) === String(req.user._id)) {
      return res.status(400).json({ success: false, message: "You can't remove your own admin access." });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { returnDocument: "after" }).select(USER_FIELDS);
    if (!user) return res.status(404).json({ success: false, message: "Student not found." });

    return res.json({ success: true, student: studentSummary(user) });
  } catch (error) {
    return fail(res, error, "Unable to change role");
  }
};

/* =========================================================
   ANNOUNCEMENTS
========================================================= */

const adminAnnouncement = (a) => ({
  id: a._id,
  title: a.title,
  body: a.body,
  createdAt: a.createdAt,
  challenge: a.challenge?._id ? { id: a.challenge._id, title: a.challenge.title } : null,
  author: a.author?.email || "",
});

// GET /api/admin/announcements
export const listAnnouncements = async (_req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .populate("challenge", "title")
      .populate("author", "email");

    return res.json({ success: true, announcements: announcements.map(adminAnnouncement) });
  } catch (error) {
    return fail(res, error, "Unable to load announcements");
  }
};

// POST /api/admin/announcements   body: { title, body, challenge? }
export const createAnnouncement = async (req, res) => {
  try {
    const title = clean(req.body?.title, 150);
    const body = clean(req.body?.body, 5000);
    const challenge = isId(req.body?.challenge) ? req.body.challenge : null;

    if (!title || !body) {
      return res.status(400).json({ success: false, message: "Add a title and a message." });
    }

    if (challenge && !(await Challenge.exists({ _id: challenge }))) {
      return res.status(400).json({ success: false, message: "That challenge doesn't exist." });
    }

    const announcement = await Announcement.create({ title, body, challenge, author: req.user._id });
    await announcement.populate("challenge", "title");
    await announcement.populate("author", "email");

    return res.status(201).json({ success: true, announcement: adminAnnouncement(announcement) });
  } catch (error) {
    return fail(res, error, "Unable to post announcement");
  }
};

// DELETE /api/admin/announcements/:id
export const deleteAnnouncement = async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(404).json({ success: false, message: "Not found." });

    await Announcement.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch (error) {
    return fail(res, error, "Unable to delete announcement");
  }
};

import mongoose from "mongoose";

import Announcement from "../models/Announcement.js";
import Category from "../models/Category.js";
import Challenge, { challengePhase } from "../models/Challenge.js";
import Registration from "../models/Registration.js";
import { isValidCoupon, priceFor } from "../utils/coupon.js";
import { shortId } from "../utils/razorpay.js";

const JOINED = ["Paid", "Free"];
const isId = (value) => mongoose.isValidObjectId(String(value || ""));
const findPublished = (slug) =>
  Challenge.findOne({ slug: String(slug || "").toLowerCase(), isPublished: true });

/* =========================================================
   HELPERS
========================================================= */

// What the public may see about a project.
function publicProject(registration) {
  const s = registration.submission || {};
  const u = registration.user || {};
  const winner = registration.status === "Winner";

  return {
    id: registration._id,
    projectTitle: s.projectTitle,
    description: s.description,
    techStack: s.techStack || [],
    githubUrl: s.githubUrl,
    liveDemoUrl: s.liveDemoUrl,
    videoUrl: s.videoUrl,
    submittedAt: s.submittedAt,
    badge: winner ? registration.winnerRank || "Winner" : registration.status === "Finalist" ? "Finalist" : null,
    isWinner: winner,
    student: {
      name: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
      institute: u.institute || "",
      city: u.city || "",
      github: u.github || "",
      linkedin: u.linkedin || "",
    },
    challenge: registration.challenge?.slug
      ? { slug: registration.challenge.slug, title: registration.challenge.title }
      : null,
  };
}

const STUDENT_FIELDS = "firstName lastName institute city github linkedin";

// Winners first (in the order admins typed ranks), then finalists, then newest.
const RANK_ORDER = (p) => (p.isWinner ? 0 : p.badge === "Finalist" ? 1 : 2);

/* =========================================================
   CHALLENGE EXTRAS (shown on the challenge page)
   GET /api/challenges/:slug/extras
========================================================= */

export const getChallengeExtras = async (req, res) => {
  try {
    const challenge = await findPublished(req.params.slug);
    if (!challenge) return res.status(404).json({ success: false, message: "Challenge not found." });

    const [updates, winners, projectCount, category] = await Promise.all([
      Announcement.find({ challenge: challenge._id }).sort({ createdAt: -1 }).limit(20),
      Registration.find({ challenge: challenge._id, status: "Winner" })
        .populate("user", STUDENT_FIELDS)
        .populate("challenge", "slug title"),
      challenge.galleryPublic
        ? Registration.countDocuments({ challenge: challenge._id, "submission.submittedAt": { $ne: null } })
        : 0,
      Category.findOne({ name: challenge.category, isActive: true }).select("name slug title icon color"),
    ]);

    return res.json({
      success: true,
      updates: updates.map((u) => ({ id: u._id, title: u.title, body: u.body, createdAt: u.createdAt })),
      winners: winners.map(publicProject).sort((a, b) => String(a.badge).localeCompare(String(b.badge))),
      galleryPublic: challenge.galleryPublic,
      projectCount,
      category,
    });
  } catch (error) {
    console.error("❌ Challenge extras error:", error);
    return res.status(500).json({ success: false, message: "Unable to load challenge details." });
  }
};

/* =========================================================
   PROJECT GALLERY
   GET /api/challenges/:slug/projects   (only when galleryPublic)
========================================================= */

export const listProjects = async (req, res) => {
  try {
    const challenge = await findPublished(req.params.slug);
    if (!challenge) return res.status(404).json({ success: false, message: "Challenge not found." });

    if (!challenge.galleryPublic) {
      return res.status(403).json({
        success: false,
        message: "Projects for this challenge will be shown after judging.",
      });
    }

    const registrations = await Registration.find({
      challenge: challenge._id,
      "submission.submittedAt": { $ne: null },
    })
      .sort({ "submission.submittedAt": -1 })
      .limit(500)
      .populate("user", STUDENT_FIELDS)
      .populate("challenge", "slug title");

    const projects = registrations.map(publicProject).sort((a, b) => RANK_ORDER(a) - RANK_ORDER(b));

    return res.json({
      success: true,
      challenge: { slug: challenge.slug, title: challenge.title, category: challenge.category },
      projects,
    });
  } catch (error) {
    console.error("❌ Project gallery error:", error);
    return res.status(500).json({ success: false, message: "Unable to load projects." });
  }
};

/* =========================================================
   ONE PROJECT
   GET /api/projects/:id   (gallery public, or a winner)
========================================================= */

export const getProject = async (req, res) => {
  try {
    if (!isId(req.params.id)) return res.status(404).json({ success: false, message: "Project not found." });

    const registration = await Registration.findById(req.params.id)
      .populate("user", STUDENT_FIELDS)
      .populate("challenge", "slug title isPublished galleryPublic");

    const visible =
      registration?.submission?.submittedAt &&
      registration.challenge?.isPublished &&
      (registration.challenge.galleryPublic || registration.status === "Winner");

    if (!visible) return res.status(404).json({ success: false, message: "Project not found." });

    return res.json({ success: true, project: publicProject(registration) });
  } catch (error) {
    console.error("❌ Project error:", error);
    return res.status(500).json({ success: false, message: "Unable to load project." });
  }
};

/* =========================================================
   COUPON PREVIEW
   POST /api/challenges/:slug/coupon   { couponCode }   (logged in)
   Lets the page show the new price before registering.
========================================================= */

export const checkCoupon = async (req, res) => {
  try {
    const challenge = await findPublished(req.params.slug);
    if (!challenge) return res.status(404).json({ success: false, message: "Challenge not found." });

    const code = String(req.body?.couponCode || "").trim();

    if (!isValidCoupon(code)) {
      return res.status(400).json({ success: false, message: "That coupon code isn't valid." });
    }

    return res.json({
      success: true,
      couponCode: code.toUpperCase(),
      fee: challenge.fee,
      amount: priceFor(challenge, code),
    });
  } catch (error) {
    console.error("❌ Coupon check error:", error);
    return res.status(500).json({ success: false, message: "Unable to check the coupon." });
  }
};

/* =========================================================
   CERTIFICATES
========================================================= */

// Who gets a certificate, and what it says.
export function certificateFor(registration, challenge) {
  if (!registration.submission?.submittedAt || !JOINED.includes(registration.paymentStatus)) return null;

  const decided = ["Finalist", "Winner"].includes(registration.status);
  const resultsOut = ["ended"].includes(challengePhase(challenge));
  if (!decided && !resultsOut) return null;

  const achievement =
    registration.status === "Winner"
      ? registration.winnerRank || "Winner"
      : registration.status === "Finalist"
        ? "Finalist"
        : "Participant";

  return {
    number: `DVX-${shortId(registration._id)}`,
    achievement,
    kind: registration.status === "Winner" ? "winner" : registration.status === "Finalist" ? "finalist" : "participant",
    issuedAt: challenge.resultsAt && new Date(challenge.resultsAt) < new Date() ? challenge.resultsAt : new Date(),
  };
}

// GET /api/certificates/:number   — public check, e.g. /verify/DVX-2EBEF1
export const verifyCertificate = async (req, res) => {
  try {
    const code = String(req.params.number || "").trim().replace(/^dvx-?/i, "").toLowerCase();

    if (!/^[0-9a-f]{6}$/.test(code)) {
      return res.status(404).json({ success: false, message: "Certificate not found." });
    }

    const candidates = await Registration.find({
      $expr: { $regexMatch: { input: { $toString: "$_id" }, regex: `${code}$` } },
    })
      .limit(5)
      .populate("user", "firstName lastName institute")
      .populate("challenge");

    for (const registration of candidates) {
      if (!registration.challenge) continue;
      const certificate = certificateFor(registration, registration.challenge);
      if (!certificate) continue;

      return res.json({
        success: true,
        certificate: {
          ...certificate,
          name: `${registration.user?.firstName || ""} ${registration.user?.lastName || ""}`.trim(),
          institute: registration.user?.institute || "",
          challenge: registration.challenge.title,
          projectTitle: registration.submission.projectTitle,
        },
      });
    }

    return res.status(404).json({ success: false, message: "Certificate not found." });
  } catch (error) {
    console.error("❌ Verify certificate error:", error);
    return res.status(500).json({ success: false, message: "Unable to check the certificate." });
  }
};

/* =========================================================
   CATEGORIES (public)
   GET /api/categories
========================================================= */

export const listCategories = async (_req, res) => {
  try {
    const [categories, challenges, joined] = await Promise.all([
      Category.find({ isActive: true }).sort({ order: 1, name: 1 }),
      Challenge.find({ isPublished: true }).select(
        "slug title category fee prizePool startAt registrationDeadline submissionDeadline resultsAt isFeatured",
      ),
      Registration.aggregate([
        { $match: { paymentStatus: { $in: JOINED } } },
        { $group: { _id: "$challenge", count: { $sum: 1 } } },
      ]),
    ]);

    const joinedBy = new Map(joined.map((row) => [String(row._id), row.count]));

    const result = categories.map((category) => {
      const mine = challenges.filter((c) => c.category === category.name);
      const live = mine.filter((c) => ["open", "upcoming", "submissions"].includes(challengePhase(c)));

      return {
        id: category._id,
        name: category.name,
        slug: category.slug,
        title: category.title,
        eyebrow: category.eyebrow,
        description: category.description,
        stack: category.stack,
        examples: category.examples,
        icon: category.icon,
        color: category.color,
        stats: {
          challenges: mine.length,
          live: live.length,
          prizePool: live.reduce((sum, c) => sum + (c.prizePool || 0), 0),
          participants: mine.reduce((sum, c) => sum + (joinedBy.get(String(c._id)) || 0), 0),
        },
        challenges: live
          .sort((a, b) => b.isFeatured - a.isFeatured || a.registrationDeadline - b.registrationDeadline)
          .slice(0, 3)
          .map((c) => ({
            slug: c.slug,
            title: c.title,
            fee: c.fee,
            prizePool: c.prizePool,
            phase: challengePhase(c),
            registrationDeadline: c.registrationDeadline,
            startAt: c.startAt,
          })),
      };
    });

    // "Any track" challenges are open to every category.
    const anyTrack = challenges.filter(
      (c) => c.category === "Open" && ["open", "upcoming", "submissions"].includes(challengePhase(c)),
    ).length;

    return res.json({
      success: true,
      categories: result,
      totals: {
        categories: result.length,
        liveChallenges: challenges.filter((c) => ["open", "upcoming", "submissions"].includes(challengePhase(c))).length,
        anyTrack,
        prizePool: challenges
          .filter((c) => ["open", "upcoming", "submissions"].includes(challengePhase(c)))
          .reduce((sum, c) => sum + (c.prizePool || 0), 0),
        participants: [...joinedBy.values()].reduce((a, b) => a + b, 0),
      },
    });
  } catch (error) {
    console.error("❌ Categories error:", error);
    return res.status(500).json({ success: false, message: "Unable to load categories." });
  }
};

import mongoose from "mongoose";

import { challengePhase } from "../models/Challenge.js";
import Registration from "../models/Registration.js";
import { serializeChallenge } from "./challengeController.js";
import {
  createRegistrationPaymentLink,
  shortId,
  syncRegistrationPayment,
} from "../utils/razorpay.js";
import { priceFor } from "../utils/coupon.js";

/* =========================================================
   HELPERS
========================================================= */

function serializeRegistration(registration) {
  const challenge = registration.challenge;

  return {
    id: registration._id,
    number: `DVX-${shortId(registration._id)}`,
    status: registration.status,
    paymentStatus: registration.paymentStatus,
    amount: registration.amount,
    paymentUrl: registration.paymentStatus === "Pending" ? registration.paymentUrl : null,
    paidAt: registration.paidAt,
    submission: registration.submission || {},
    defenseSlot: registration.defenseSlot,
    winnerRank: registration.winnerRank,
    adminNote: registration.adminNote,
    createdAt: registration.createdAt,
    challenge: challenge?.slug ? serializeChallenge(challenge) : null,
    canSubmit:
      ["Paid", "Free"].includes(registration.paymentStatus) &&
      Boolean(challenge?.submissionDeadline) &&
      new Date() <= new Date(challenge.submissionDeadline),
  };
}

// The logged-in student's own registration, or null.
async function findMine(req) {
  if (!mongoose.isValidObjectId(req.params.id)) return null;

  return Registration.findOne({ _id: req.params.id, user: req.user._id }).populate("challenge");
}

const notFound = (res) =>
  res.status(404).json({ success: false, message: "Registration not found." });

const clean = (value, max) => String(value ?? "").trim().slice(0, max);

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/* =========================================================
   MY REGISTRATIONS (dashboard)
   GET /api/registrations/my
========================================================= */

export const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate("challenge")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      registrations: registrations
        .filter((r) => r.challenge)
        .map(serializeRegistration),
    });
  } catch (error) {
    console.error("❌ My registrations error:", error);
    return res.status(500).json({ success: false, message: "Unable to load your dashboard." });
  }
};

/* =========================================================
   ONE REGISTRATION
   GET /api/registrations/:id
========================================================= */

export const getMyRegistration = async (req, res) => {
  try {
    const registration = await findMine(req);
    if (!registration || !registration.challenge) return notFound(res);

    return res.json({ success: true, registration: serializeRegistration(registration) });
  } catch (error) {
    console.error("❌ Get registration error:", error);
    return res.status(500).json({ success: false, message: "Unable to load registration." });
  }
};

/* =========================================================
   PAYMENT STATUS (polled by the payment screen)
   GET /api/registrations/:id/payment-status
========================================================= */

export const getPaymentStatus = async (req, res) => {
  res.set("Cache-Control", "no-store");

  try {
    let registration = await findMine(req);
    if (!registration) return notFound(res);

    let linkStatus = null;

    try {
      linkStatus = await syncRegistrationPayment(registration);
      registration = await Registration.findById(registration._id);
    } catch (error) {
      console.error("❌ Payment status check failed:", error.error || error.message);
    }

    const paid = registration.paymentStatus !== "Pending";

    return res.json({
      success: true,
      // "Paid" for both paid and free so the payment screen can stop waiting.
      paymentStatus: paid ? "Paid" : "Pending",
      status: registration.status,
      expired: !paid && ["expired", "cancelled"].includes(linkStatus),
    });
  } catch (error) {
    console.error("❌ Payment status error:", error);
    return res.status(500).json({ success: false, message: "Unable to check payment." });
  }
};

/* =========================================================
   NEW PAYMENT LINK (when the 1-hour link expired)
   POST /api/registrations/:id/payment-link
========================================================= */

export const renewPaymentLink = async (req, res) => {
  try {
    let registration = await findMine(req);
    if (!registration || !registration.challenge) return notFound(res);

    if (registration.paymentStatus !== "Pending") {
      return res.status(409).json({ success: false, message: "This registration is already paid." });
    }

    const challenge = registration.challenge;

    // Don't replace a link that was paid in the meantime or is still open.
    const linkStatus = await syncRegistrationPayment(registration);
    registration = await Registration.findById(registration._id);

    if (registration.paymentStatus !== "Pending") {
      return res.status(409).json({ success: false, message: "This registration is already paid." });
    }

    if (linkStatus === "created" && registration.paymentUrl) {
      return res.json({
        success: true,
        paymentUrl: registration.paymentUrl,
        amount: registration.amount,
      });
    }

    if (challengePhase(challenge) !== "open") {
      return res.status(400).json({
        success: false,
        message: "Registration for this challenge has closed.",
      });
    }

    registration.amount = priceFor(challenge, registration.couponCode);
    if (registration.amount === challenge.fee) registration.couponCode = "";
    await createRegistrationPaymentLink(registration, { user: req.user, challenge }, req);
    await registration.save();

    return res.json({
      success: true,
      paymentUrl: registration.paymentUrl,
      amount: registration.amount,
    });
  } catch (error) {
    console.error("❌ Renew payment link error:", error.error || error.message);
    return res.status(502).json({
      success: false,
      message: "Couldn't start payment. Please try again.",
    });
  }
};

/* =========================================================
   SAVE / SUBMIT PROJECT
   PUT /api/registrations/:id/submission
   body: { projectTitle, description, techStack, githubUrl,
           liveDemoUrl, videoUrl, aiTool, final: true|false }

   final=false saves a draft. final=true checks everything and
   moves the status to "Submitted". Editable until the deadline.
========================================================= */

const AI_TOOLS = ["Cursor", "ChatGPT", "Claude", "Copilot", "Other", "None"];

export const saveSubmission = async (req, res) => {
  try {
    const registration = await findMine(req);
    if (!registration || !registration.challenge) return notFound(res);

    if (!["Paid", "Free"].includes(registration.paymentStatus)) {
      return res.status(403).json({
        success: false,
        message: "Complete your registration payment before submitting.",
      });
    }

    if (new Date() > new Date(registration.challenge.submissionDeadline)) {
      return res.status(400).json({
        success: false,
        message: "The submission deadline has passed.",
      });
    }

    const body = req.body || {};
    const final = body.final === true;

    const techStack = (
      Array.isArray(body.techStack) ? body.techStack : String(body.techStack || "").split(",")
    )
      .map((item) => clean(item, 40))
      .filter(Boolean)
      .slice(0, 15);

    const submission = {
      projectTitle: clean(body.projectTitle, 120),
      description: clean(body.description, 3000),
      techStack,
      githubUrl: clean(body.githubUrl, 300),
      liveDemoUrl: clean(body.liveDemoUrl, 300),
      videoUrl: clean(body.videoUrl, 300),
      aiTool: AI_TOOLS.includes(body.aiTool) ? body.aiTool : "",
    };

    for (const field of ["githubUrl", "liveDemoUrl", "videoUrl"]) {
      if (submission[field] && !isHttpUrl(submission[field])) {
        return res.status(400).json({ success: false, message: "Links must start with https://" });
      }
    }

    if (final) {
      if (!submission.projectTitle) {
        return res.status(400).json({ success: false, message: "Add your project title." });
      }

      if (submission.description.length < 50) {
        return res.status(400).json({
          success: false,
          message: "Describe your project in at least 50 characters.",
        });
      }

      if (!/^https?:\/\/(www\.)?github\.com\/[^/]+\/[^/]+/i.test(submission.githubUrl)) {
        return res.status(400).json({
          success: false,
          message: "Add a public GitHub repository link (github.com/you/project).",
        });
      }

      if (!submission.techStack.length) {
        return res.status(400).json({ success: false, message: "Add at least one technology." });
      }

      if (!submission.aiTool) {
        return res.status(400).json({ success: false, message: "Tell us which AI tool you used." });
      }
    }

    const wasSubmitted = Boolean(registration.submission?.submittedAt);

    registration.submission = {
      ...submission,
      submittedAt: final ? new Date() : registration.submission?.submittedAt || null,
    };

    // Only move forward from "Registered"; never undo judging progress.
    if ((final || wasSubmitted) && registration.status === "Registered") {
      registration.status = "Submitted";
    }

    await registration.save();
    await registration.populate("challenge");

    return res.json({
      success: true,
      message: final ? "Project submitted!" : "Draft saved.",
      registration: serializeRegistration(registration),
    });
  } catch (error) {
    console.error("❌ Save submission error:", error);
    return res.status(500).json({ success: false, message: "Unable to save your project." });
  }
};

import Challenge, { challengePhase } from "../models/Challenge.js";
import Registration from "../models/Registration.js";
import {
  cancelPaymentLink,
  createRegistrationPaymentLink,
  syncRegistrationPayment,
} from "../utils/razorpay.js";
import { isValidCoupon, priceFor } from "../utils/coupon.js";

/* =========================================================
   HELPERS
========================================================= */

export function serializeChallenge(challenge, extra = {}) {
  return {
    id: challenge._id,
    slug: challenge.slug,
    title: challenge.title,
    tagline: challenge.tagline,
    description: challenge.description,
    category: challenge.category,
    coverImage: challenge.coverImage,
    host: challenge.host,
    prizePool: challenge.prizePool,
    tags: challenge.tags,
    isFeatured: challenge.isFeatured,
    fee: challenge.fee,
    startAt: challenge.startAt,
    registrationDeadline: challenge.registrationDeadline,
    submissionDeadline: challenge.submissionDeadline,
    resultsAt: challenge.resultsAt,
    prizes: challenge.prizes,
    rules: challenge.rules,
    eligibility: challenge.eligibility,
    phase: challengePhase(challenge),
    createdAt: challenge.createdAt,
    ...extra,
  };
}

// Registrations that count as "joined" (paid or free).
const JOINED = { paymentStatus: { $in: ["Paid", "Free"] } };

async function participantCounts(challengeIds) {
  const rows = await Registration.aggregate([
    { $match: { challenge: { $in: challengeIds }, ...JOINED } },
    { $group: { _id: "$challenge", count: { $sum: 1 } } },
  ]);

  return new Map(rows.map((row) => [String(row._id), row.count]));
}

/* =========================================================
   LIST
   GET /api/challenges
========================================================= */

export const listChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ isPublished: true }).sort({
      registrationDeadline: 1,
    });

    const counts = await participantCounts(challenges.map((c) => c._id));

    // Which ones has this student already joined?
    const mine = req.user
      ? new Map(
          (
            await Registration.find({
              user: req.user._id,
              challenge: { $in: challenges.map((c) => c._id) },
            }).select("challenge status paymentStatus")
          ).map((r) => [String(r.challenge), r]),
        )
      : new Map();

    return res.json({
      success: true,
      challenges: challenges.map((challenge) => {
        const reg = mine.get(String(challenge._id));

        return serializeChallenge(challenge, {
          participants: counts.get(String(challenge._id)) || 0,
          myRegistration: reg
            ? { id: reg._id, status: reg.status, paymentStatus: reg.paymentStatus }
            : null,
        });
      }),
    });
  } catch (error) {
    console.error("❌ List challenges error:", error);
    return res.status(500).json({ success: false, message: "Unable to load challenges." });
  }
};

/* =========================================================
   DETAIL
   GET /api/challenges/:slug
========================================================= */

export const getChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findOne({
      slug: String(req.params.slug || "").toLowerCase(),
      isPublished: true,
    });

    if (!challenge) {
      return res.status(404).json({ success: false, message: "Challenge not found." });
    }

    const counts = await participantCounts([challenge._id]);

    const reg = req.user
      ? await Registration.findOne({ user: req.user._id, challenge: challenge._id }).select(
          "status paymentStatus",
        )
      : null;

    return res.json({
      success: true,
      challenge: serializeChallenge(challenge, {
        participants: counts.get(String(challenge._id)) || 0,
        myRegistration: reg
          ? { id: reg._id, status: reg.status, paymentStatus: reg.paymentStatus }
          : null,
      }),
    });
  } catch (error) {
    console.error("❌ Get challenge error:", error);
    return res.status(500).json({ success: false, message: "Unable to load challenge." });
  }
};

/* =========================================================
   REGISTER FOR A CHALLENGE
   POST /api/challenges/:slug/register   (logged in)

   Free challenge  -> registered straight away.
   Paid challenge  -> Razorpay payment link (QR + button),
                      registered once Razorpay confirms.
========================================================= */

export const registerForChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findOne({
      slug: String(req.params.slug || "").toLowerCase(),
      isPublished: true,
    });

    if (!challenge) {
      return res.status(404).json({ success: false, message: "Challenge not found." });
    }

    let registration = await Registration.findOne({
      user: req.user._id,
      challenge: challenge._id,
    });

    // Already joined.
    if (registration && registration.paymentStatus !== "Pending") {
      return res.status(200).json({
        success: true,
        registrationId: registration._id,
        paymentStatus: registration.paymentStatus,
      });
    }

    if (challengePhase(challenge) === "upcoming") {
      return res.status(400).json({
        success: false,
        message: "Registration for this challenge hasn't opened yet.",
      });
    }

    if (challengePhase(challenge) !== "open") {
      return res.status(400).json({
        success: false,
        message: "Registration for this challenge has closed.",
      });
    }

    // Optional test coupon (only works while TEST_COUPON_CODE is set).
    const typedCoupon = String(req.body?.couponCode || "").trim();

    if (typedCoupon && !isValidCoupon(typedCoupon)) {
      return res.status(400).json({ success: false, message: "That coupon code isn't valid." });
    }

    // A coupon typed now wins; otherwise keep one used earlier (if still active).
    const couponCode = typedCoupon
      ? typedCoupon.toUpperCase()
      : isValidCoupon(registration?.couponCode)
        ? registration.couponCode
        : "";
    const amount = priceFor(challenge, couponCode);

    // Started earlier but didn't pay: reuse the link if it is still open.
    if (registration) {
      let linkStatus = null;

      try {
        linkStatus = await syncRegistrationPayment(registration);
      } catch (error) {
        console.error("❌ Payment status check failed:", error.error || error.message);
      }

      registration = await Registration.findById(registration._id);

      if (registration.paymentStatus === "Paid") {
        return res.json({
          success: true,
          registrationId: registration._id,
          paymentStatus: "Paid",
        });
      }

      const stillOpen =
        registration.paymentUrl &&
        registration.amount === amount &&
        linkStatus === "created";

      if (stillOpen) {
        return res.json({
          success: true,
          registrationId: registration._id,
          paymentStatus: "Pending",
          amount: registration.amount,
          paymentUrl: registration.paymentUrl,
        });
      }

      // The price changed (coupon added/removed): close the old link so the
      // student can't pay both.
      if (linkStatus === "created") await cancelPaymentLink(registration.razorpayPaymentLinkId);
    } else {
      registration = new Registration({
        user: req.user._id,
        challenge: challenge._id,
      });
    }

    registration.amount = amount;
    registration.couponCode = amount < challenge.fee ? couponCode : "";

    // ----- Free challenge -----
    if (!challenge.fee) {
      registration.paymentStatus = "Free";
      registration.status = "Registered";
      await registration.save();

      return res.status(201).json({
        success: true,
        registrationId: registration._id,
        paymentStatus: "Free",
      });
    }

    // ----- Paid challenge: Razorpay payment link -----
    try {
      await createRegistrationPaymentLink(registration, { user: req.user, challenge }, req);
    } catch (error) {
      console.error("❌ Razorpay payment link error:", error.error || error.message);
      return res.status(502).json({
        success: false,
        message: "Couldn't start payment. Please try again.",
      });
    }

    await registration.save();

    return res.status(201).json({
      success: true,
      registrationId: registration._id,
      paymentStatus: "Pending",
      amount: registration.amount,
      paymentUrl: registration.paymentUrl,
    });
  } catch (error) {
    // Two clicks at once: the unique index stops a second registration.
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You're already registering for this challenge. Refresh the page.",
      });
    }

    console.error("❌ Register for challenge error:", error);
    return res.status(500).json({ success: false, message: "Unable to register. Please try again." });
  }
};

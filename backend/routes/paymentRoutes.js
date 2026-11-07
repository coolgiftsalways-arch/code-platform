import express from "express";
import mongoose from "mongoose";

import Participant from "../models/Participant.js";
import Registration from "../models/Registration.js";
import {
  createPaymentLink,
  getPublicUrl,
  isValidCallbackSignature,
  markPaid,
  markRegistrationPaid,
  syncPayment,
} from "../utils/razorpay.js";

const router = express.Router();

/* =========================================================
   CALLBACK
   GET /api/payments/callback
   Razorpay sends the participant here after paying via the link.
========================================================= */

router.get("/callback", async (req, res) => {
  const site = getPublicUrl(req);

  const params = {
    razorpay_payment_id: req.query.razorpay_payment_id,
    razorpay_payment_link_id: req.query.razorpay_payment_link_id,
    razorpay_payment_link_reference_id: req.query.razorpay_payment_link_reference_id,
    razorpay_payment_link_status: req.query.razorpay_payment_link_status,
    razorpay_signature: req.query.razorpay_signature,
  };

  const referenceId = typeof params.razorpay_payment_link_reference_id === "string"
    ? params.razorpay_payment_link_reference_id
    : "";

  const linkId = typeof params.razorpay_payment_link_id === "string"
    ? params.razorpay_payment_link_id
    : "";

  // Challenge registrations go back to their dashboard page,
  // the old single-form flow goes back to /upload.
  const registration = linkId
    ? await Registration.findOne({ razorpayPaymentLinkId: linkId }).catch(() => null)
    : null;

  const back = (result) =>
    registration
      ? res.redirect(`${site}/dashboard/registrations/${registration._id}?payment=${result}`)
      : res.redirect(
          `${site}/upload?payment=${result}${referenceId ? `&id=${encodeURIComponent(referenceId)}` : ""}`,
        );

  try {
    if (!Object.values(params).every((v) => typeof v === "string")) return back("failed");

    if (!isValidCallbackSignature(params) || params.razorpay_payment_link_status !== "paid") {
      return back("failed");
    }

    if (registration) {
      await markRegistrationPaid(registration._id, params.razorpay_payment_id);
      return back("success");
    }

    const participant = await Participant.findOne({ razorpayPaymentLinkId: linkId });

    if (participant) await markPaid(participant._id, params.razorpay_payment_id);

    return back("success");
  } catch (error) {
    console.error("❌ Razorpay callback error:", error.message);
    return back("failed");
  }
});

/* =========================================================
   STATUS
   GET /api/payments/:id/status
   The payment screen polls this while showing the QR.
========================================================= */

router.get("/:id/status", async (req, res) => {
  res.set("Cache-Control", "no-store");

  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ success: false, message: "Registration not found." });
  }

  let participant = await Participant.findById(req.params.id);

  if (!participant) {
    return res.status(404).json({ success: false, message: "Registration not found." });
  }

  let linkStatus = null;

  try {
    linkStatus = await syncPayment(participant);
    participant = await Participant.findById(participant._id);
  } catch (error) {
    console.error("❌ Payment status check failed:", error.error || error.message);
  }

  return res.json({
    success: true,
    paymentStatus: participant.paymentStatus,
    expired: participant.paymentStatus !== "Paid" && ["expired", "cancelled"].includes(linkStatus),
  });
});

/* =========================================================
   NEW LINK
   POST /api/payments/:id/link
   For a pending participant whose 1-hour link expired.
========================================================= */

router.post("/:id/link", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ success: false, message: "Registration not found." });
  }

  const participant = await Participant.findById(req.params.id);

  if (!participant) {
    return res.status(404).json({ success: false, message: "Registration not found." });
  }

  if (participant.paymentStatus === "Paid") {
    return res.status(409).json({ success: false, message: "This entry fee is already paid." });
  }

  try {
    // Don't replace a link that was paid in the meantime or is still open.
    const linkStatus = await syncPayment(participant);
    const fresh = await Participant.findById(participant._id);

    if (fresh.paymentStatus === "Paid") {
      return res.status(409).json({ success: false, message: "This entry fee is already paid." });
    }

    if (linkStatus !== "expired" && linkStatus !== "cancelled" && fresh.paymentUrl) {
      return res.json({ success: true, paymentUrl: fresh.paymentUrl, amount: fresh.finalistFee });
    }

    await createPaymentLink(fresh, req);
    await fresh.save();

    return res.json({ success: true, paymentUrl: fresh.paymentUrl, amount: fresh.finalistFee });
  } catch (error) {
    console.error("❌ Razorpay payment link error:", error.error || error.message);
    return res.status(502).json({ success: false, message: "Couldn't start payment. Please try again." });
  }
});

export default router;

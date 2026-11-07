import crypto from "node:crypto";
import Razorpay from "razorpay";

import Participant from "../models/Participant.js";
import Registration from "../models/Registration.js";

// Same flow as lights.bio: a fixed-amount Razorpay Payment Link, shown as a
// QR + "Pay with Razorpay" button. The page polls a status endpoint, and
// Razorpay also redirects back to /api/payments/callback (signature-checked).

// Fee for the old single-form flow (/api/projects/submit), in rupees.
export const ENTRY_FEE = Number(process.env.ENTRY_FEE) || 999;

const LINK_LIFETIME_SECONDS = 60 * 60; // 1 hour

let client = null;

// Created on first use so the server still starts without Razorpay keys.
export function getRazorpay() {
  if (client) return client;

  const key_id = process.env.RAZORPAY_KEY_ID?.trim();
  const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim();

  if (!key_id || !key_secret) {
    throw new Error("RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set.");
  }

  client = new Razorpay({ key_id, key_secret });
  return client;
}

// Public address of this site (Express serves both the API and the React app).
export function getPublicUrl(req) {
  const fromEnv = String(process.env.PUBLIC_URL || "").trim().replace(/\/+$/, "");
  if (fromEnv) return fromEnv;

  const proto = String(req.get("x-forwarded-proto") || req.protocol).split(",")[0].trim();
  return `${proto}://${req.get("host")}`;
}

export function shortId(id) {
  return String(id).slice(-6).toUpperCase();
}

// Kept for the old participant flow.
export const participantNumber = (participant) => shortId(participant._id);

function cleanPhone(value) {
  const phone = String(value || "")
    .replace(/\D/g, "")
    .replace(/^(91|0)(?=\d{10}$)/, "");
  return /^\d{10}$/.test(phone) ? `+91${phone}` : null;
}

// Create a fixed-amount payment link and store it on `doc`
// (a Participant or Registration that has not necessarily been saved yet).
async function attachPaymentLink(doc, req, { amountRupees, description, customer, notes }) {
  const contact = cleanPhone(customer.phone);

  const link = await getRazorpay().paymentLink.create({
    amount: Math.round(amountRupees * 100), // paise
    currency: "INR",
    accept_partial: false,
    reference_id: String(doc._id),
    description: String(description).slice(0, 250),
    customer: {
      name: String(customer.name || "DEVNEX Participant").slice(0, 100),
      email: customer.email,
      ...(contact ? { contact } : {}),
    },
    notify: { sms: false, email: false },
    reminder_enable: false,
    expire_by: Math.floor(Date.now() / 1000) + LINK_LIFETIME_SECONDS,
    callback_url: `${getPublicUrl(req)}/api/payments/callback`,
    callback_method: "get",
    notes: { brand: "DEVNEX", ...notes },
  });

  if (!link?.id || !link?.short_url) {
    throw new Error("Razorpay did not return a payment link.");
  }

  doc.razorpayPaymentLinkId = link.id;
  doc.paymentUrl = link.short_url;
  doc.paymentLinkExpiresAt = new Date(link.expire_by * 1000);
}

/* =========================================================
   CHALLENGE REGISTRATIONS
========================================================= */

export function createRegistrationPaymentLink(registration, { user, challenge }, req) {
  return attachPaymentLink(registration, req, {
    amountRupees: registration.amount,
    description: `DEVNEX — ${challenge.title} registration${
      registration.couponCode ? ` (test coupon ${registration.couponCode})` : ""
    }`,
    customer: {
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      email: user.email,
      phone: user.phone,
    },
    notes: {
      type: "registration",
      registrationId: String(registration._id),
      registrationNumber: shortId(registration._id),
      challenge: challenge.slug,
      ...(registration.couponCode ? { coupon: registration.couponCode } : {}),
    },
  });
}

// Close a payment link so it can't be paid any more (best effort).
export async function cancelPaymentLink(linkId) {
  if (!linkId) return;
  try {
    await getRazorpay().paymentLink.cancel(linkId);
  } catch (error) {
    console.warn("Couldn't cancel old payment link:", error.error?.description || error.message);
  }
}

export function markRegistrationPaid(registrationId, paymentId) {
  return Registration.findOneAndUpdate(
    { _id: registrationId, paymentStatus: "Pending" },
    {
      paymentStatus: "Paid",
      status: "Registered",
      razorpayPaymentId: paymentId,
      paidAt: new Date(),
    },
    { returnDocument: "after" },
  );
}

// Ask Razorpay whether a pending registration's link has been paid.
// Returns the Razorpay link status (created | paid | expired | cancelled ...).
export async function syncRegistrationPayment(registration) {
  if (registration.paymentStatus !== "Pending" || !registration.razorpayPaymentLinkId) return null;

  const link = await getRazorpay().paymentLink.fetch(registration.razorpayPaymentLinkId);

  if (link.status === "paid") {
    await markRegistrationPaid(registration._id, link.payments?.[0]?.payment_id || "link-payment");
  }

  return link.status;
}

/* =========================================================
   OLD SINGLE-FORM FLOW (Participant, /api/projects/submit)
========================================================= */

export function createPaymentLink(participant, req) {
  const name =
    participant.fullName ||
    `${participant.firstName || ""} ${participant.lastName || ""}`.trim();

  return attachPaymentLink(participant, req, {
    amountRupees: ENTRY_FEE,
    description: `DEVNEX Season 01 entry fee — ${participant.projectTitle || name || "project"}`,
    customer: { name, email: participant.email, phone: participant.mobile || participant.phone },
    notes: {
      type: "participant",
      participantId: String(participant._id),
      participantNumber: shortId(participant._id),
    },
  });
}

export function markPaid(participantId, paymentId) {
  return Participant.findOneAndUpdate(
    { _id: participantId, paymentStatus: "Pending" },
    { paymentStatus: "Paid", razorpayPaymentId: paymentId, paidAt: new Date() },
    { returnDocument: "after" },
  );
}

export async function syncPayment(participant) {
  if (participant.paymentStatus !== "Pending" || !participant.razorpayPaymentLinkId) return null;

  const link = await getRazorpay().paymentLink.fetch(participant.razorpayPaymentLinkId);

  if (link.status === "paid") {
    await markPaid(participant._id, link.payments?.[0]?.payment_id || "link-payment");
  }

  return link.status;
}

/* =========================================================
   CALLBACK SIGNATURE
========================================================= */

// Prove a callback redirect really came from Razorpay (not a faked URL).
export function isValidCallbackSignature({
  razorpay_payment_id,
  razorpay_payment_link_id,
  razorpay_payment_link_reference_id,
  razorpay_payment_link_status,
  razorpay_signature,
}) {
  const secret = process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!secret) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(
      `${razorpay_payment_link_id}|${razorpay_payment_link_reference_id}|${razorpay_payment_link_status}|${razorpay_payment_id}`,
    )
    .digest("hex");

  return (
    expected.length === razorpay_signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature))
  );
}

// Loads what an email needs and sends it in the background.
// Every function here is safe to call without awaiting: it never throws.

import Registration from "../models/Registration.js";
import {
  registrationConfirmedEmail,
  sendEmail,
  statusUpdateEmail,
  submissionReceivedEmail,
} from "./mailer.js";

async function load(registrationId) {
  return Registration.findById(registrationId).populate("user").populate("challenge");
}

function run(task) {
  Promise.resolve()
    .then(task)
    .catch((error) => console.error("❌ Email task failed:", error.message));
}

// After a payment is confirmed (Razorpay, manual) or a free registration.
export function notifyRegistrationConfirmed(registrationId) {
  run(async () => {
    const r = await load(registrationId);
    if (!r?.user || !r.challenge) return;
    await sendEmail(registrationConfirmedEmail({ user: r.user, challenge: r.challenge, registration: r }));
  });
}

export function notifySubmissionReceived(registrationId) {
  run(async () => {
    const r = await load(registrationId);
    if (!r?.user || !r.challenge) return;
    await sendEmail(submissionReceivedEmail({ user: r.user, challenge: r.challenge, registration: r }));
  });
}

// For admin status changes (one at a time or in bulk).
export function notifyStatusChanged(registrationIds) {
  run(async () => {
    for (const id of [].concat(registrationIds)) {
      const r = await load(id);
      if (!r?.user || !r.challenge) continue;
      const message = statusUpdateEmail({ user: r.user, challenge: r.challenge, registration: r });
      if (message) await sendEmail(message);
    }
  });
}

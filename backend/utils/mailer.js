import nodemailer from "nodemailer";

// Sends DEVNEX emails through your Hostinger mailbox (admin@devnex.institute).
//
// Environment variables (backend/.env locally, Hostinger env vars live):
//   SMTP_USER=admin@devnex.institute
//   SMTP_PASS=<the mailbox password from Hostinger → Emails>
//   SMTP_HOST=smtp.hostinger.com      (default)
//   SMTP_PORT=465                      (default, SSL)
//   MAIL_FROM="DEVNEX <admin@devnex.institute>"   (optional)
//
// If SMTP_USER / SMTP_PASS are missing, emails are skipped (logged) and
// nothing else breaks.

let transporter = null;

export function emailConfigured() {
  return Boolean(process.env.SMTP_USER?.trim() && process.env.SMTP_PASS);
}

function getTransporter() {
  if (transporter) return transporter;

  const port = Number(process.env.SMTP_PORT) || 465;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST?.trim() || "smtp.hostinger.com",
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER.trim(), pass: process.env.SMTP_PASS },
    ...(process.env.SMTP_TLS_INSECURE === "1" ? { tls: { rejectUnauthorized: false } } : {}),
  });

  return transporter;
}

const fromAddress = () =>
  process.env.MAIL_FROM?.trim() || `DEVNEX <${process.env.SMTP_USER?.trim()}>`;

export function siteUrl() {
  return String(process.env.PUBLIC_URL || "https://devnex.institute").replace(/\/+$/, "");
}

const escape = (text) =>
  String(text ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const inr = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount || 0);

const dateTime = (value) =>
  new Date(value).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }) + " IST";

/* =========================================================
   LAYOUT
========================================================= */

// One branded layout for every email. `rows` = [label, value] pairs for a details box.
function layout({ preheader, title, intro, rows = [], button, outro }) {
  const rowsHtml = rows.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;border:1px solid #e2e8f0;border-radius:12px;">
        ${rows
          .map(
            ([label, value], i) => `<tr>
              <td style="padding:10px 14px;font-size:13px;color:#64748b;${i ? "border-top:1px solid #f1f5f9;" : ""}">${escape(label)}</td>
              <td style="padding:10px 14px;font-size:13px;color:#0f172a;font-weight:700;text-align:right;${i ? "border-top:1px solid #f1f5f9;" : ""}">${escape(value)}</td>
            </tr>`,
          )
          .join("")}
      </table>`
    : "";

  const buttonHtml = button
    ? `<p style="margin:24px 0;"><a href="${escape(button.url)}" style="display:inline-block;background:#4f46e5;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 22px;border-radius:10px;">${escape(button.label)}</a></p>`
    : "";

  return `<!doctype html>
<html><body style="margin:0;background:#f1f5f9;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
<span style="display:none;max-height:0;overflow:hidden;">${escape(preheader || title)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:24px 12px;">
<tr><td align="center">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:18px;overflow:hidden;">
    <tr><td style="background:linear-gradient(135deg,#312e81,#4f46e5);padding:22px 28px;">
      <span style="color:#ffffff;font-size:20px;font-weight:900;letter-spacing:-0.5px;">&lt;/&gt; DEVNEX</span>
    </td></tr>
    <tr><td style="padding:28px;">
      <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#0f172a;">${escape(title)}</h1>
      <div style="font-size:15px;line-height:1.6;color:#334155;">${intro}</div>
      ${rowsHtml}
      ${buttonHtml}
      ${outro ? `<div style="font-size:14px;line-height:1.6;color:#475569;">${outro}</div>` : ""}
    </td></tr>
    <tr><td style="padding:18px 28px;border-top:1px solid #f1f5f9;font-size:12px;color:#94a3b8;">
      DEVNEX · Online student coding challenges · <a href="${siteUrl()}" style="color:#6366f1;">${siteUrl().replace(/^https?:\/\//, "")}</a><br/>
      You're getting this because you have a DEVNEX account.
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
}

const plain = ({ title, introText, rows = [], button }) =>
  [title, "", introText, "", ...rows.map(([l, v]) => `${l}: ${v}`), button ? `\n${button.label}: ${button.url}` : ""]
    .join("\n")
    .trim();

/* =========================================================
   SEND
========================================================= */

// Never throws: email problems are logged, the request carries on.
export async function sendEmail({ to, subject, html, text }) {
  if (!to) return { skipped: true };

  if (!emailConfigured()) {
    console.log(`✉️  (email not configured) would send "${subject}" to ${to}`);
    return { skipped: true };
  }

  try {
    const info = await getTransporter().sendMail({ from: fromAddress(), to, subject, html, text });
    console.log(`✉️  Sent "${subject}" to ${to}`);
    return { sent: true, id: info.messageId };
  } catch (error) {
    console.error(`❌ Email "${subject}" to ${to} failed:`, error.message);
    return { error: error.message };
  }
}

// Fire and forget (for use inside request handlers).
export const sendLater = (message) => {
  sendEmail(message).catch(() => {});
};

/* =========================================================
   TEMPLATES
========================================================= */

const firstName = (user) => user?.firstName || "there";

export function welcomeEmail(user) {
  const title = `Welcome to DEVNEX, ${firstName(user)}!`;
  const introText = "Your account is ready. Pick a challenge, register, and submit your project from your dashboard.";
  const button = { label: "Browse challenges", url: `${siteUrl()}/challenges` };
  return {
    to: user.email,
    subject: "Welcome to DEVNEX 🚀",
    html: layout({ title, intro: `<p>${escape(introText)}</p>`, button }),
    text: plain({ title, introText, button }),
  };
}

export function registrationConfirmedEmail({ user, challenge, registration }) {
  const paid = registration.paymentStatus === "Paid";
  const title = "You're registered! 🎉";
  const introText = `Hi ${firstName(user)}, your spot in ${challenge.title} is confirmed${paid ? " and your payment was received" : ""}.`;
  const rows = [
    ["Challenge", challenge.title],
    ["Registration no.", `DVX-${String(registration._id).slice(-6).toUpperCase()}`],
    ...(paid
      ? [
          ["Amount paid", inr(registration.amount)],
          ["Payment ID", registration.razorpayPaymentId || "—"],
          ["Paid on", dateTime(registration.paidAt || new Date())],
        ]
      : [["Entry", "Free"]]),
    ["Submit your project by", dateTime(challenge.submissionDeadline)],
  ];
  const button = { label: "Open my dashboard", url: `${siteUrl()}/dashboard/registrations/${registration._id}` };
  return {
    to: user.email,
    subject: `Registration confirmed: ${challenge.title}`,
    html: layout({
      title,
      intro: `<p>${escape(introText)}</p>`,
      rows,
      button,
      outro: "<p>Keep this email as your receipt. Good luck, and build something great!</p>",
    }),
    text: plain({ title, introText, rows, button }),
  };
}

export function submissionReceivedEmail({ user, challenge, registration }) {
  const s = registration.submission || {};
  const title = "We got your project ✅";
  const introText = `Hi ${firstName(user)}, your project for ${challenge.title} has been submitted. You can still edit it until the deadline.`;
  const rows = [
    ["Project", s.projectTitle],
    ["GitHub", s.githubUrl],
    ...(s.liveDemoUrl ? [["Live demo", s.liveDemoUrl]] : []),
    ["Editable until", dateTime(challenge.submissionDeadline)],
  ];
  const button = { label: "View my submission", url: `${siteUrl()}/dashboard/registrations/${registration._id}` };
  return {
    to: user.email,
    subject: `Project submitted: ${s.projectTitle}`,
    html: layout({ title, intro: `<p>${escape(introText)}</p>`, rows, button }),
    text: plain({ title, introText, rows, button }),
  };
}

const STATUS_COPY = {
  Screening: ["Your project is being reviewed", "Our judges have started reviewing your project."],
  Qualified: ["You qualified! 🙌", "Your project made it to the next round."],
  "Defense Scheduled": ["Your technical defense is scheduled", "You'll explain your project and code live to our judges."],
  Finalist: ["You're a finalist! 🏅", "Your project is one of the finalists."],
  Winner: ["Congratulations, you won! 🏆", "Your project is one of the winners."],
  "Not Selected": ["Thank you for building with DEVNEX", "Your project wasn't selected for the next round this time. We hope to see you in the next challenge!"],
};

export function statusUpdateEmail({ user, challenge, registration }) {
  const copy = STATUS_COPY[registration.status];
  if (!copy) return null;

  const [title, line] = copy;
  const introText = `Hi ${firstName(user)}, an update on ${challenge.title}: ${line}`;
  const rows = [
    ["Challenge", challenge.title],
    ["Status", registration.status],
    ...(registration.winnerRank ? [["Award", registration.winnerRank]] : []),
    ...(registration.defenseSlot ? [["Defense slot", dateTime(registration.defenseSlot)]] : []),
  ];
  const note = registration.adminNote
    ? `<p style="margin-top:8px;padding:12px 14px;background:#eef2ff;border-radius:10px;"><strong>Message from DEVNEX:</strong><br/>${escape(registration.adminNote).replace(/\n/g, "<br/>")}</p>`
    : "";
  const button = { label: "Open my dashboard", url: `${siteUrl()}/dashboard/registrations/${registration._id}` };
  return {
    to: user.email,
    subject: `${title.replace(/ [^\w\s!,]+$/u, "")}: ${challenge.title}`,
    html: layout({ title, intro: `<p>${escape(introText)}</p>`, rows, button, outro: note }),
    text: plain({ title, introText: introText + (registration.adminNote ? `\n\n${registration.adminNote}` : ""), rows, button }),
  };
}

export function announcementEmail({ user, announcement, challengeTitle }) {
  const title = announcement.title;
  const introText = announcement.body;
  const button = { label: "Open my dashboard", url: `${siteUrl()}/dashboard` };
  return {
    to: user.email,
    subject: `${challengeTitle ? `[${challengeTitle}] ` : ""}${announcement.title}`,
    html: layout({ title, intro: `<p>${escape(introText).replace(/\n/g, "<br/>")}</p>`, button }),
    text: plain({ title, introText, button }),
  };
}

export function passwordResetEmail({ user, url }) {
  const title = "Reset your password";
  const introText = `Hi ${firstName(user)}, click the button to choose a new password. The link works for 1 hour. If you didn't ask for this, ignore this email.`;
  const button = { label: "Choose a new password", url };
  return {
    to: user.email,
    subject: "Reset your DEVNEX password",
    html: layout({ title, intro: `<p>${escape(introText)}</p>`, button }),
    text: plain({ title, introText, button }),
  };
}

export function testEmail(to) {
  const title = "Email is working ✅";
  const introText = "This test email was sent from the DEVNEX admin panel.";
  return { to, subject: "DEVNEX test email", html: layout({ title, intro: `<p>${introText}</p>` }), text: plain({ title, introText }) };
}

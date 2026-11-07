// Download rows as a CSV file that opens in Excel / Google Sheets.
export function downloadCsv(filename, columns, rows) {
  const escape = (value) => {
    const text = value === null || value === undefined ? "" : String(value);
    // Stop spreadsheet formulas being run from student-entered text.
    const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
    return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
  };

  const lines = [
    columns.map((c) => escape(c.label)).join(","),
    ...rows.map((row) => columns.map((c) => escape(c.value(row))).join(",")),
  ];

  const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// Columns for registration exports.
export const REGISTRATION_CSV = [
  { label: "Registration", value: (r) => r.number },
  { label: "Challenge", value: (r) => r.challenge?.title },
  { label: "First name", value: (r) => r.student?.firstName },
  { label: "Last name", value: (r) => r.student?.lastName },
  { label: "Email", value: (r) => r.student?.email },
  { label: "Phone", value: (r) => r.student?.phone },
  { label: "Institute", value: (r) => r.student?.institute },
  { label: "City", value: (r) => r.student?.city },
  { label: "Status", value: (r) => r.status },
  { label: "Payment", value: (r) => r.paymentStatus },
  { label: "Amount", value: (r) => r.amount },
  { label: "Paid at", value: (r) => (r.paidAt ? new Date(r.paidAt).toISOString() : "") },
  { label: "Razorpay payment", value: (r) => r.razorpayPaymentId },
  { label: "Coupon", value: (r) => r.couponCode },
  { label: "Project", value: (r) => r.submission?.projectTitle },
  { label: "GitHub", value: (r) => r.submission?.githubUrl },
  { label: "Live demo", value: (r) => r.submission?.liveDemoUrl },
  { label: "Video", value: (r) => r.submission?.videoUrl },
  { label: "Tech stack", value: (r) => (r.submission?.techStack || []).join(", ") },
  { label: "AI tool", value: (r) => r.submission?.aiTool },
  { label: "Submitted at", value: (r) => (r.submission?.submittedAt ? new Date(r.submission.submittedAt).toISOString() : "") },
  { label: "Defense slot", value: (r) => (r.defenseSlot ? new Date(r.defenseSlot).toISOString() : "") },
  { label: "Winner rank", value: (r) => r.winnerRank },
  { label: "Registered at", value: (r) => new Date(r.createdAt).toISOString() },
];

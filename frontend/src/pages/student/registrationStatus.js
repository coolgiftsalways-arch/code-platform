// Steps shown in the dashboard tracker, in order.
export const STEPS = [
  "Registered",
  "Submitted",
  "Screening",
  "Qualified",
  "Defense Scheduled",
  "Finalist",
  "Winner",
];

export const STATUS_STYLE = {
  "Pending Payment": "bg-amber-50 text-amber-700 border-amber-200",
  Registered: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Submitted: "bg-sky-50 text-sky-700 border-sky-200",
  Screening: "bg-sky-50 text-sky-700 border-sky-200",
  Qualified: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Defense Scheduled": "bg-purple-50 text-purple-700 border-purple-200",
  Finalist: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Winner: "bg-yellow-50 text-yellow-800 border-yellow-300",
  "Not Selected": "bg-slate-100 text-slate-500 border-slate-200",
};

// What the student should do next, for the dashboard card.
export function nextAction(registration) {
  const { status, paymentStatus, submission, canSubmit, challenge } = registration;

  if (paymentStatus === "Pending") return "Complete your payment to confirm your spot.";
  if (status === "Registered" && canSubmit) return "Submit your project before the deadline.";
  if (status === "Registered") return "The submission deadline has passed.";
  if (status === "Submitted" && canSubmit) return "Submitted. You can still edit until the deadline.";
  if (status === "Submitted") return "Submitted. Judging starts after the deadline.";
  if (status === "Defense Scheduled") return "Your technical defense is scheduled.";
  if (status === "Winner") return "Congratulations, you won!";
  if (status === "Not Selected") return "Thanks for taking part. See you next season!";
  if (submission?.submittedAt) return `Your project is in ${status.toLowerCase()}.`;
  return challenge?.title || "";
}

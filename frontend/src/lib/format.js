export const formatInr = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

export const formatDate = (value, withTime = false) =>
  value
    ? new Date(value).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
      })
    : "—";

// "12 days left", "5 hours left", "Closed"
export function timeLeft(value) {
  const ms = new Date(value).getTime() - Date.now();
  if (!value || ms <= 0) return "Closed";

  const days = Math.floor(ms / 86400000);
  if (days >= 1) return `${days} day${days === 1 ? "" : "s"} left`;

  const hours = Math.max(1, Math.floor(ms / 3600000));
  return `${hours} hour${hours === 1 ? "" : "s"} left`;
}

// "Nov 01 – Jan 10, 2027"
export function formatRange(start, end) {
  if (!end) return "—";
  const e = new Date(end);
  const endText = e.toLocaleDateString("en-IN", { month: "short", day: "2-digit", year: "numeric" });
  if (!start) return endText;
  const startText = new Date(start).toLocaleDateString("en-IN", { month: "short", day: "2-digit" });
  return `${startText} – ${endText}`;
}

// "₹50,000" / "₹1.5L" style short amount for cards
export const formatInrShort = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: amount >= 100000 ? "compact" : "standard",
    maximumFractionDigits: amount >= 100000 ? 1 : 0,
  }).format(amount || 0);

// "Starts in 12 days"
export function startsIn(value) {
  const ms = new Date(value).getTime() - Date.now();
  const days = Math.ceil(ms / 86400000);
  return days <= 1 ? "Starts tomorrow" : `Starts in ${days} days`;
}

export const PHASE_LABEL = {
  upcoming: "Upcoming",
  open: "Registration open",
  submissions: "Submissions open",
  judging: "Judging",
  ended: "Ended",
};

export const PHASE_STYLE = {
  upcoming: "bg-orange-50 text-orange-700 border-orange-200",
  open: "bg-emerald-50 text-emerald-700 border-emerald-200",
  submissions: "bg-indigo-50 text-indigo-700 border-indigo-200",
  judging: "bg-amber-50 text-amber-700 border-amber-200",
  ended: "bg-slate-100 text-slate-500 border-slate-200",
};

// The "Open" category means any track; don't confuse it with "open for registration".
export const categoryLabel = (category) => (category === "Open" ? "Any track" : category);

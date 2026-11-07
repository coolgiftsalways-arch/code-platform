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

export const PHASE_LABEL = {
  open: "Registration open",
  submissions: "Submissions open",
  judging: "Judging",
  ended: "Ended",
};

export const PHASE_STYLE = {
  open: "bg-emerald-50 text-emerald-700 border-emerald-200",
  submissions: "bg-indigo-50 text-indigo-700 border-indigo-200",
  judging: "bg-amber-50 text-amber-700 border-amber-200",
  ended: "bg-slate-100 text-slate-500 border-slate-200",
};

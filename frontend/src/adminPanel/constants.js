// Shared styles + lists for the admin panel.

export const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 disabled:bg-slate-50 disabled:text-slate-500";

export const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60",
  danger:
    "inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60",
  small:
    "inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60",
};

export const STATUSES = [
  "Pending Payment",
  "Registered",
  "Submitted",
  "Screening",
  "Qualified",
  "Defense Scheduled",
  "Finalist",
  "Winner",
  "Not Selected",
];

// Statuses an admin can move a paid registration to.
export const JUDGING_STATUSES = STATUSES.filter((s) => s !== "Pending Payment");

export const CATEGORIES = ["Web Dev", "Mobile Apps", "AI / ML", "SaaS", "Cybersecurity", "Open"];

export const PAYMENT_STYLE = {
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Free: "bg-sky-50 text-sky-700 border-sky-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
};

export const studentName = (s) => (s ? `${s.firstName || ""} ${s.lastName || ""}`.trim() : "—");

// Table cell styles
export const th =
  "border-b border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500";
export const td = "border-b border-slate-100 px-4 py-3 align-top";

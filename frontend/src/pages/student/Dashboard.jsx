import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../../lib/api.js";
import { categoryLabel, formatDate, timeLeft } from "../../lib/format.js";
import { useAuth } from "../../context/auth.js";
import { PageLoader } from "../../components/RequireAuth.jsx";
import { STATUS_STYLE, STEPS, nextAction } from "./registrationStatus.js";

export default function Dashboard() {
  const { user, logout } = useAuth();

  const [registrations, setRegistrations] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/registrations/my")
      .then((data) => setRegistrations(data.registrations))
      .catch((err) => setError(err.message));

    api("/api/announcements")
      .then((data) => setAnnouncements(data.announcements))
      .catch(() => {});
  }, []);

  return (
    <section className="px-4 pb-20 pt-8">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
              Student dashboard
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
              Hi, {user.firstName} 👋
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {user.email}
              {user.institute ? ` · ${user.institute}` : ""}
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              to="/challenges"
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              Browse challenges
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-slate-300"
            >
              Log out
            </button>
          </div>
        </div>

        {/* ANNOUNCEMENTS FROM DEVNEX */}
        {announcements.length > 0 && (
          <div className="mt-8 space-y-3">
            <h2 className="text-lg font-black text-slate-950">Announcements</h2>
            {announcements.slice(0, 5).map((a) => (
              <article key={a.id} className="rounded-[20px] border border-indigo-100 bg-indigo-50/60 p-5">
                <p className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
                  {a.challenge ? a.challenge.title : "DEVNEX"} · {formatDate(a.createdAt)}
                </p>
                <h3 className="mt-1 font-black text-slate-950">{a.title}</h3>
                <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-700">{a.body}</p>
              </article>
            ))}
          </div>
        )}

        {/* MY CHALLENGES */}
        <h2 className="mt-10 text-lg font-black text-slate-950">My challenges</h2>

        {error ? (
          <p className="mt-4 text-sm font-semibold text-rose-600">{error}</p>
        ) : !registrations ? (
          <PageLoader />
        ) : registrations.length === 0 ? (
          <div className="mt-4 rounded-[24px] border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <p className="text-base font-black text-slate-900">You haven't joined a challenge yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Pick a challenge, register, and your submission section will appear here.
            </p>
            <Link
              to="/challenges"
              className="mt-5 inline-block rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              See challenges
            </Link>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {registrations.map((registration) => (
              <RegistrationCard key={registration.id} registration={registration} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function RegistrationCard({ registration }) {
  const { challenge, status, paymentStatus } = registration;
  const stepIndex = STEPS.indexOf(status);

  let cta = "Open";
  if (paymentStatus === "Pending") cta = "Complete payment";
  else if (status === "Registered" && registration.canSubmit) cta = "Submit project";
  else if (status === "Submitted" && registration.canSubmit) cta = "Edit submission";

  return (
    <Link
      to={`/dashboard/registrations/${registration.id}`}
      className="block rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-600/5 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
            {categoryLabel(challenge.category)} · {registration.number}
          </p>
          <h3 className="mt-1 text-lg font-black text-slate-950">{challenge.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{nextAction(registration)}</p>
        </div>

        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${STATUS_STYLE[status]}`}>
          {status}
        </span>
      </div>

      {stepIndex >= 0 && (
        <div className="mt-5 flex gap-1.5" aria-hidden="true">
          {STEPS.map((step, index) => (
            <span
              key={step}
              className={`h-1.5 flex-1 rounded-full ${index <= stepIndex ? "bg-indigo-600" : "bg-slate-200"}`}
            />
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <span>
          Submit by {formatDate(challenge.submissionDeadline)}
          {registration.canSubmit ? ` · ${timeLeft(challenge.submissionDeadline)}` : ""}
        </span>
        <span className="font-bold text-indigo-600">{cta} →</span>
      </div>
    </Link>
  );
}

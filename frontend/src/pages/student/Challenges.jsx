import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../../lib/api.js";
import { formatDate, formatInr, PHASE_LABEL, PHASE_STYLE, timeLeft } from "../../lib/format.js";
import { useAuth } from "../../context/auth.js";
import { PageLoader } from "../../components/RequireAuth.jsx";

export default function Challenges() {
  const { user, loading: authLoading } = useAuth();

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("All");

  // Reload once we know who is logged in, so "Registered" badges are right.
  useEffect(() => {
    if (authLoading) return;

    api("/api/challenges")
      .then((data) => setChallenges(data.challenges))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [authLoading, user]);

  const categories = ["All", ...new Set(challenges.map((c) => c.category))];
  const shown = category === "All" ? challenges : challenges.filter((c) => c.category === category);

  return (
    <section className="px-4 pb-20 pt-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
            DEVNEX Season 01
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Choose your challenge
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
            Pick the track that fits what you build. Register, then submit your project from your
            dashboard before the deadline.
          </p>

          {!user && !authLoading && (
            <p className="mt-4 text-sm text-slate-600">
              <Link to="/signup" className="font-bold text-indigo-600 hover:underline">
                Create an account
              </Link>{" "}
              to register for a challenge.
            </p>
          )}
        </div>

        {categories.length > 2 && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {categories.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setCategory(name)}
                className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                  category === name
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <PageLoader />
        ) : error ? (
          <p className="mt-10 text-center text-sm font-semibold text-rose-600">{error}</p>
        ) : shown.length === 0 ? (
          <p className="mt-10 text-center text-sm text-slate-500">
            No challenges are open right now. Check back soon.
          </p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ChallengeCard({ challenge }) {
  const joined = challenge.myRegistration && challenge.myRegistration.paymentStatus !== "Pending";

  return (
    <Link
      to={`/challenges/${challenge.slug}`}
      className="group flex flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-600/5"
    >
      <div className="relative h-32 bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-500">
        {challenge.coverImage && (
          <img src={challenge.coverImage} alt="" className="h-full w-full object-cover" />
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-indigo-700">
          {challenge.category}
        </span>
        {joined && (
          <span className="absolute right-4 top-4 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
            ✓ Registered
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span
          className={`w-fit rounded-full border px-2.5 py-1 text-[10px] font-bold ${PHASE_STYLE[challenge.phase]}`}
        >
          {PHASE_LABEL[challenge.phase]}
        </span>

        <h2 className="mt-3 text-lg font-black text-slate-950 group-hover:text-indigo-600">
          {challenge.title}
        </h2>
        <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{challenge.tagline}</p>

        <dl className="mt-auto grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center">
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fee</dt>
            <dd className="mt-0.5 text-sm font-black text-slate-900">
              {challenge.fee ? formatInr(challenge.fee) : "Free"}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Joined</dt>
            <dd className="mt-0.5 text-sm font-black text-slate-900">{challenge.participants}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Register by
            </dt>
            <dd className="mt-0.5 text-sm font-black text-slate-900" title={formatDate(challenge.registrationDeadline, true)}>
              {challenge.phase === "open" ? timeLeft(challenge.registrationDeadline) : "Closed"}
            </dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}

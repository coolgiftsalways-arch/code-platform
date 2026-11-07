import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Check, Sparkles, Trophy, Users, Zap } from "lucide-react";

import { api } from "../lib/api.js";
import { formatInrShort, startsIn, timeLeft } from "../lib/format.js";
import { categoryColor } from "../lib/categoryTheme.js";
import CategoryIcon from "../components/CategoryIcon.jsx";
import { useAuth } from "../context/auth.js";
import { PageLoader } from "../components/RequireAuth.jsx";

// What judges look for (from the original Categories page).
const STRENGTHS = [
  ["Problem & Purpose", "Clearly explain why the project exists, who it helps, and what problem it solves."],
  ["Technical Execution", "The core functionality works properly and shows meaningful engineering or design effort."],
  ["Code & Architecture", "Structure, maintainability, data flow, APIs and implementation choices make sense."],
  ["Original Contribution", "You can explain what you personally created, changed, designed or improved."],
  ["Product Experience", "Understandable, usable, responsive, and presented with attention to the experience."],
  ["Documentation", "A clear README covering setup, features, decisions and how it works."],
];

export default function CategoriesPage() {
  const { user } = useAuth();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/categories")
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  // /categories#ai-machine-learning scrolls to that card once loaded.
  useEffect(() => {
    if (!data || !location.hash) return;
    const el = document.getElementById(location.hash.slice(1));
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }, [data, location.hash]);

  return (
    <div className="pb-20">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-violet-900 px-4 pb-16 pt-14 text-white sm:pb-20 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-[0.06] [background-size:28px_28px]" />
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-500/30 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-[120px]" />

        <div className="relative mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">
            <Sparkles className="h-3.5 w-3.5" /> Choose your track
          </span>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
            Build what you love.
            <br />
            <span className="bg-gradient-to-r from-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">We'll judge it fairly.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-indigo-100 sm:text-base">
            Every DEVNEX challenge belongs to a track. Pick the one that matches your skills, see what's live right now, and start building — fully online.
          </p>

          {data && (
            <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Tracks", data.totals.categories],
                ["Live challenges", data.totals.liveChallenges],
                ["In prizes", formatInrShort(data.totals.prizePool)],
                ["Students joined", data.totals.participants],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur">
                  <p className="text-2xl font-black sm:text-3xl">{value}</p>
                  <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-indigo-200">{label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="relative z-10 mx-auto -mt-8 max-w-6xl px-4">
        {error && <p className="rounded-2xl bg-white p-6 text-center text-sm font-semibold text-rose-600 shadow">{error}</p>}
        {!data && !error && (
          <div className="rounded-[28px] bg-white shadow">
            <PageLoader />
          </div>
        )}

        {data && (
          <>
            <div className="grid gap-5 lg:grid-cols-2">
              {data.categories.map((category, index) => (
                <CategoryCard key={category.id} category={category} number={index + 1} />
              ))}
            </div>

            {data.totals.anyTrack > 0 && (
              <Link
                to="/challenges?category=Open"
                className="mt-5 flex flex-col items-start gap-3 rounded-[24px] border border-indigo-200 bg-gradient-to-r from-indigo-50 to-violet-50 p-5 transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <span>
                  <span className="block text-base font-black text-slate-950">Not sure which track?</span>
                  <span className="text-sm text-slate-600">
                    {data.totals.anyTrack} live challenge{data.totals.anyTrack === 1 ? "" : "s"} accept projects from any track.
                  </span>
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600">
                  See any-track challenges <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            )}
          </>
        )}
      </section>

      {/* WHAT MAKES A STRONG PROJECT */}
      <section className="mx-auto mt-20 max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">How we judge</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">What makes a strong project</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">Whichever track you choose, judges look at the same six things.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STRENGTHS.map(([title, text], index) => (
            <div key={title} className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
              <span className="text-xs font-black text-indigo-600">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 font-black text-slate-950">{title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto mt-16 max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-indigo-600 to-violet-600 px-6 py-10 text-center text-white sm:py-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-10 [background-size:24px_24px]" />
          <h2 className="relative text-2xl font-black sm:text-4xl">Ready to build?</h2>
          <p className="relative mx-auto mt-2 max-w-lg text-sm text-indigo-100 sm:text-base">
            Pick a challenge, register in a minute, and submit from your dashboard.
          </p>
          <div className="relative mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/challenges" className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50">
              Browse challenges
            </Link>
            {!user && (
              <Link to="/signup" className="rounded-xl bg-white/15 px-6 py-3 text-sm font-bold text-white ring-1 ring-white/30 transition hover:bg-white/25">
                Create a free account
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function CategoryCard({ category, number }) {
  const theme = categoryColor(category.color);
  const { stats } = category;

  return (
    <article
      id={category.slug}
      className="group flex scroll-mt-28 flex-col overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm transition hover:shadow-xl hover:shadow-indigo-600/5"
    >
      <div className="flex items-start gap-4 p-5 sm:p-6">
        <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${theme.gradient}`}>
          <CategoryIcon name={category.icon} className="h-7 w-7" />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
            {String(number).padStart(2, "0")} · {category.eyebrow || category.name}
          </p>
          <h2 className="mt-1 text-xl font-black leading-tight text-slate-950">{category.title}</h2>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 sm:px-6 sm:pb-6">
        <p className="text-sm leading-6 text-slate-600">{category.description}</p>

        {category.stack?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {category.stack.slice(0, 8).map((tech) => (
              <span key={tech} className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${theme.soft}`}>{tech}</span>
            ))}
          </div>
        )}

        {category.examples?.length > 0 && (
          <ul className="mt-4 grid grid-cols-1 gap-1.5 text-sm text-slate-700 sm:grid-cols-2">
            {category.examples.map((example) => (
              <li key={example} className="flex items-center gap-2">
                <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                {example}
              </li>
            ))}
          </ul>
        )}

        {/* Live numbers */}
        <div className="mt-5 grid grid-cols-3 divide-x divide-slate-100 rounded-2xl border border-slate-100 bg-slate-50 text-center">
          <div className="px-2 py-3">
            <p className="flex items-center justify-center gap-1 text-lg font-black text-slate-950"><Zap className="h-4 w-4 text-emerald-500" />{stats.live}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live</p>
          </div>
          <div className="px-2 py-3">
            <p className="flex items-center justify-center gap-1 text-lg font-black text-slate-950"><Trophy className="h-4 w-4 text-amber-500" />{formatInrShort(stats.prizePool)}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Prizes</p>
          </div>
          <div className="px-2 py-3">
            <p className="flex items-center justify-center gap-1 text-lg font-black text-slate-950"><Users className="h-4 w-4 text-indigo-500" />{stats.participants}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Joined</p>
          </div>
        </div>

        {/* Live challenges in this track */}
        {category.challenges.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {category.challenges.map((c) => (
              <li key={c.slug}>
                <Link
                  to={`/challenges/${c.slug}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm transition hover:border-indigo-200 hover:bg-indigo-50/40"
                >
                  <span className="min-w-0 truncate font-bold text-slate-900">{c.title}</span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      c.phase === "open" ? "bg-emerald-100 text-emerald-800" : c.phase === "upcoming" ? "bg-orange-100 text-orange-800" : "bg-indigo-100 text-indigo-800"
                    }`}
                  >
                    {c.phase === "open" ? timeLeft(c.registrationDeadline) : c.phase === "upcoming" ? startsIn(c.startAt) : "Submissions open"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 rounded-xl border border-dashed border-slate-200 px-3.5 py-3 text-center text-xs text-slate-500">
            No live challenges in this track right now — check back soon.
          </p>
        )}

        <Link
          to={`/challenges?category=${encodeURIComponent(category.name)}`}
          className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-bold text-indigo-600 hover:gap-2"
        >
          All {category.name} challenges <ArrowRight className="h-4 w-4 transition-all" />
        </Link>
      </div>
    </article>
  );
}

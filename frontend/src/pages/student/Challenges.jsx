import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  CalendarDays,
  Flag,
  Globe,
  Search,
  SlidersHorizontal,
  Tag,
  Users,
} from "lucide-react";

import { api } from "../../lib/api.js";
import {
  formatInr,
  formatInrShort,
  formatRange,
  startsIn,
  timeLeft,
  categoryLabel,
} from "../../lib/format.js";
import { useAuth } from "../../context/auth.js";
import { PageLoader } from "../../components/RequireAuth.jsx";

/* =========================================================
   FILTER / SORT CONFIG
========================================================= */

// Our 5 phases grouped into 4 statuses a student understands.
const STATUS_OF_PHASE = {
  upcoming: "Upcoming",
  open: "Open",
  submissions: "In progress",
  judging: "In progress",
  ended: "Ended",
};

const STATUS_DOT = {
  Upcoming: "bg-orange-500",
  Open: "bg-emerald-500",
  "In progress": "bg-indigo-500",
  Ended: "bg-slate-400",
};

const STATUSES = ["Upcoming", "Open", "In progress", "Ended"];
const ENTRY = ["Free", "Paid"];

const SORTS = [
  { id: "relevant", label: "Most relevant" },
  { id: "deadline", label: "Deadline" },
  { id: "recent", label: "Recently added" },
  { id: "prize", label: "Prize amount" },
];

const PHASE_ORDER = { open: 0, upcoming: 1, submissions: 2, judging: 3, ended: 4 };

const time = (value) => (value ? new Date(value).getTime() : Infinity);

function sortChallenges(list, sort) {
  const copy = [...list];

  if (sort === "prize") return copy.sort((a, b) => b.prizePool - a.prizePool);
  if (sort === "recent") return copy.sort((a, b) => time(b.createdAt) - time(a.createdAt));

  if (sort === "deadline") {
    // Soonest registration deadline first; ended ones last.
    return copy.sort(
      (a, b) =>
        (a.phase === "ended") - (b.phase === "ended") ||
        time(a.registrationDeadline) - time(b.registrationDeadline),
    );
  }

  // Most relevant: featured, then open > upcoming > in progress > ended, then deadline.
  return copy.sort(
    (a, b) =>
      b.isFeatured - a.isFeatured ||
      PHASE_ORDER[a.phase] - PHASE_ORDER[b.phase] ||
      time(a.registrationDeadline) - time(b.registrationDeadline),
  );
}

// Gradient thumbnails when a challenge has no cover image.
const THUMBS = {
  "Web Dev": "from-sky-500 to-indigo-600",
  "Mobile Apps": "from-emerald-500 to-teal-600",
  "AI / ML": "from-violet-500 to-fuchsia-600",
  SaaS: "from-amber-500 to-orange-600",
  Cybersecurity: "from-slate-700 to-slate-900",
  Open: "from-indigo-500 to-purple-600",
};

const initials = (title) =>
  title
    .replace(/[^A-Za-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

/* =========================================================
   PAGE
========================================================= */

export default function Challenges() {
  const { user, loading: authLoading } = useAuth();

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("relevant");
  // Links like /challenges?category=AI%20%2F%20ML or ?tag=Web start pre-filtered.
  const [params] = useSearchParams();
  const [filters, setFilters] = useState(() => ({
    status: [],
    entry: [],
    category: params.get("category") ? [params.get("category")] : [],
    tags: params.get("tag") ? [params.get("tag")] : [],
  }));
  const [showFilters, setShowFilters] = useState(false);

  // Reload once we know who is logged in, so "Registered" badges are right.
  useEffect(() => {
    if (authLoading) return;

    api("/api/challenges")
      .then((data) => setChallenges(data.challenges))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [authLoading, user]);

  // Every tag that appears, most common first.
  const allCategories = useMemo(
    () => [...new Set(challenges.map((c) => c.category))].sort((a, b) => (a === "Open") - (b === "Open") || a.localeCompare(b)),
    [challenges],
  );

  const allTags = useMemo(() => {
    const counts = new Map();
    for (const c of challenges) {
      for (const t of new Set(c.tags || [])) {
        if (t && t !== "Open") counts.set(t, (counts.get(t) || 0) + 1);
      }
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
  }, [challenges]);

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();

    const matches = challenges.filter((c) => {
      const tags = [c.category, ...(c.tags || [])];

      if (q && ![c.title, c.tagline, c.host, ...tags].join(" ").toLowerCase().includes(q)) {
        return false;
      }
      if (filters.status.length && !filters.status.includes(STATUS_OF_PHASE[c.phase])) return false;
      if (filters.entry.length && !filters.entry.includes(c.fee ? "Paid" : "Free")) return false;
      if (filters.category.length && !filters.category.includes(c.category)) return false;
      if (filters.tags.length && !filters.tags.some((t) => tags.includes(t))) return false;
      return true;
    });

    return sortChallenges(matches, sort);
  }, [challenges, search, filters, sort]);

  const activeCount = Object.values(filters).reduce((n, list) => n + list.length, 0);

  const toggle = (group, value) =>
    setFilters((previous) => ({
      ...previous,
      [group]: previous[group].includes(value)
        ? previous[group].filter((v) => v !== value)
        : [...previous[group], value],
    }));

  const clearAll = () => {
    setFilters({ status: [], entry: [], category: [], tags: [] });
    setQuery("");
    setSearch("");
  };

  return (
    <div className="pb-20">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 px-4 py-12 text-center sm:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-[0.07] [background-size:28px_28px]" />
        <div className="relative mx-auto max-w-3xl">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-300">
            DEVNEX Challenges
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">
            Build. Compete. Get noticed.
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
            Join online student coding challenges from anywhere in India, submit your project and win prizes,
            certificates and a spot in the Hall of Fame.
          </p>
          {!user && !authLoading && (
            <p className="mt-3 text-sm text-indigo-100">
              <Link to="/signup" className="font-bold text-white underline underline-offset-4">
                Create a free account
              </Link>{" "}
              to register.
            </p>
          )}
        </div>
      </section>

      {/* SEARCH */}
      <div className="border-b border-slate-200 bg-white px-4 py-5">
        <form
          className="mx-auto flex max-w-4xl gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            setSearch(query);
          }}
        >
          <label className="relative flex-1">
            <span className="sr-only">Search challenges</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                if (!event.target.value) setSearch("");
              }}
              placeholder="Search by challenge title, tag or keyword"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm text-slate-800 outline-none transition focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/10"
            />
          </label>
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white transition hover:bg-indigo-700 sm:px-8"
          >
            Search
          </button>
        </form>
      </div>

      <div className="mx-auto mt-8 grid max-w-6xl gap-8 px-4 lg:grid-cols-[230px_1fr]">
        {/* FILTERS */}
        <aside>
          <button
            type="button"
            onClick={() => setShowFilters((open) => !open)}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 lg:hidden"
            aria-expanded={showFilters}
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" /> Filters
              {activeCount > 0 && (
                <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] text-white">{activeCount}</span>
              )}
            </span>
            <span>{showFilters ? "▲" : "▼"}</span>
          </button>

          <div className={`${showFilters ? "mt-4 block" : "hidden"} space-y-7 lg:mt-0 lg:block`}>
            <button
              type="button"
              onClick={clearAll}
              disabled={!activeCount && !search}
              className="flex items-center gap-2 text-sm font-semibold text-indigo-600 disabled:text-slate-400"
            >
              Clear filters
              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                {activeCount}
              </span>
            </button>

            <FilterGroup title="Status">
              {STATUSES.map((status) => (
                <Check key={status} checked={filters.status.includes(status)} onChange={() => toggle("status", status)}>
                  {status}
                  <span className={`ml-1.5 inline-block h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} />
                </Check>
              ))}
            </FilterGroup>

            {allCategories.length > 1 && (
              <FilterGroup title="Category">
                {allCategories.map((name) => (
                  <Check key={name} checked={filters.category.includes(name)} onChange={() => toggle("category", name)}>
                    {categoryLabel(name)}
                  </Check>
                ))}
              </FilterGroup>
            )}

            <FilterGroup title="Entry fee">
              {ENTRY.map((entry) => (
                <Check key={entry} checked={filters.entry.includes(entry)} onChange={() => toggle("entry", entry)}>
                  {entry}
                </Check>
              ))}
            </FilterGroup>

            {allTags.length > 0 && (
              <FilterGroup title="Interest tags">
                {allTags.map((tag) => (
                  <Check key={tag} checked={filters.tags.includes(tag)} onChange={() => toggle("tags", tag)}>
                    {tag}
                  </Check>
                ))}
              </FilterGroup>
            )}
          </div>
        </aside>

        {/* RESULTS */}
        <main className="min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600">
              Showing <strong className="text-slate-900">{shown.length}</strong>{" "}
              {shown.length === 1 ? "challenge" : "challenges"}
            </p>

            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-700">Sort:</span>
              <div className="flex overflow-x-auto rounded-xl border border-slate-200 bg-white p-1">
                {SORTS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSort(option.id)}
                    className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      sort === option.id ? "bg-indigo-600 text-white" : "text-slate-600 hover:text-indigo-600"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <PageLoader />
          ) : error ? (
            <p className="mt-10 text-center text-sm font-semibold text-rose-600">{error}</p>
          ) : shown.length === 0 ? (
            <div className="mt-6 rounded-[20px] border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <p className="text-base font-black text-slate-900">
                {challenges.length ? "No challenges match your filters" : "No challenges yet"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {challenges.length ? "Try removing a filter or searching for something else." : "Check back soon."}
              </p>
              {challenges.length > 0 && (
                <button type="button" onClick={clearAll} className="mt-4 text-sm font-bold text-indigo-600 hover:underline">
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {shown.map((challenge) => (
                <ChallengeRow key={challenge.id} challenge={challenge} onTag={(t) => toggle("tags", t)} activeTags={filters.tags} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   PIECES
========================================================= */

function FilterGroup({ title, children }) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-sm font-black text-slate-900">{title}</legend>
      <div className="space-y-2">{children}</div>
    </fieldset>
  );
}

function Check({ checked, onChange, children }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600 hover:text-slate-900">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
      />
      <span className="flex items-center">{children}</span>
    </label>
  );
}

function StatusPill({ challenge }) {
  const { phase } = challenge;

  if (phase === "upcoming") {
    return <Pill className="bg-orange-100 text-orange-800">{startsIn(challenge.startAt)}</Pill>;
  }
  if (phase === "open") {
    return <Pill className="bg-emerald-100 text-emerald-800">{timeLeft(challenge.registrationDeadline)}</Pill>;
  }
  if (phase === "submissions") {
    return <Pill className="bg-indigo-100 text-indigo-800">Submissions open</Pill>;
  }
  if (phase === "judging") return <Pill className="bg-amber-100 text-amber-800">Judging</Pill>;
  return <Pill className="bg-slate-100 text-slate-600">Ended</Pill>;
}

function Pill({ className, children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

function ChallengeRow({ challenge, onTag, activeTags }) {
  const joined = challenge.myRegistration && challenge.myRegistration.paymentStatus !== "Pending";
  const tags = [...new Set([challenge.category !== "Open" ? challenge.category : null, ...(challenge.tags || [])])].filter(Boolean);
  const ended = challenge.phase === "ended";

  return (
    <article
      className={`relative overflow-hidden rounded-[20px] border bg-white shadow-sm transition hover:shadow-lg hover:shadow-indigo-600/5 ${
        challenge.isFeatured && !ended ? "border-indigo-200" : "border-slate-200"
      } ${ended ? "opacity-80" : ""}`}
    >
      {challenge.isFeatured && !ended && <span className="absolute inset-y-0 left-0 w-1 bg-indigo-600" />}

      <div className="grid md:grid-cols-[1fr_250px]">
        {/* LEFT */}
        <Link to={`/challenges/${challenge.slug}`} className="group flex gap-4 p-4 sm:p-5">
          <div
            className={`flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br text-xl font-black text-white sm:h-28 sm:w-28 sm:text-3xl ${
              THUMBS[challenge.category] || THUMBS.Open
            }`}
          >
            {challenge.coverImage ? (
              <img src={challenge.coverImage} alt="" className="h-full w-full object-cover" />
            ) : (
              initials(challenge.title)
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {challenge.isFeatured && !ended && (
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">★ Featured</span>
              )}
              {joined && (
                <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                  ✓ Registered
                </span>
              )}
            </div>

            <h2 className="mt-0.5 text-lg font-black leading-snug text-slate-950 group-hover:text-indigo-600 sm:text-xl">
              {challenge.title}
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
              <StatusPill challenge={challenge} />
              <span className="flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-slate-400" />
                Online
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-600">
              {challenge.prizePool > 0 && (
                <span>
                  <strong className="text-slate-900">{formatInrShort(challenge.prizePool)}</strong> in prizes
                </span>
              )}
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                <strong className="text-slate-900">{challenge.participants}</strong>{" "}
                {challenge.participants === 1 ? "participant" : "participants"}
              </span>
              <span>
                <strong className="text-slate-900">{challenge.fee ? formatInr(challenge.fee) : "Free"}</strong>
                {" entry"}
              </span>
            </div>
          </div>
        </Link>

        {/* RIGHT */}
        <div className="space-y-2.5 border-t border-slate-100 px-4 py-4 text-sm text-slate-600 sm:px-5 md:border-l md:border-t-0">
          <p className="flex items-center gap-2">
            <Flag className="h-4 w-4 shrink-0 text-slate-400" />
            <span className="truncate rounded-full border border-indigo-200 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
              {challenge.host || "DEVNEX"}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
            {formatRange(challenge.startAt, challenge.submissionDeadline)}
          </p>
          {tags.length > 0 && (
            <div className="flex gap-2">
              <Tag className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
              <div className="flex flex-wrap gap-1.5">
                {tags.slice(0, 4).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => onTag(tag)}
                    className={`rounded-md px-2 py-0.5 text-xs font-semibold transition ${
                      activeTags.includes(tag)
                        ? "bg-indigo-600 text-white"
                        : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

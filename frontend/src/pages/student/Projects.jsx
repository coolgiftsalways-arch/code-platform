import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ExternalLink, Play, Search, Trophy } from "lucide-react";

import { api } from "../../lib/api.js";
import { formatDate } from "../../lib/format.js";
import { PageLoader } from "../../components/RequireAuth.jsx";

const GRADIENTS = [
  "from-indigo-500 to-violet-600",
  "from-sky-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-pink-500 to-rose-600",
  "from-violet-500 to-fuchsia-600",
];

const gradientFor = (id) => GRADIENTS[parseInt(String(id).slice(-2), 16) % GRADIENTS.length];
const initials = (text) =>
  String(text || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

function Badge({ badge }) {
  if (!badge) return null;
  const winner = badge !== "Finalist";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-black ${winner ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
      {winner ? <Trophy className="h-3 w-3" /> : null}
      {badge}
    </span>
  );
}

/* =========================================================
   GALLERY  /challenges/:slug/projects
========================================================= */

export function ProjectGallery() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    api(`/api/challenges/${encodeURIComponent(slug)}/projects`)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [slug]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!data) return [];
    if (!q) return data.projects;
    return data.projects.filter((p) =>
      [p.projectTitle, p.description, p.student.name, p.student.institute, ...(p.techStack || [])]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [data, query]);

  if (error) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="text-sm font-semibold text-slate-600">{error}</p>
        <Link to={`/challenges/${slug}`} className="mt-4 inline-block text-sm font-bold text-indigo-600 hover:underline">
          ← Back to the challenge
        </Link>
      </div>
    );
  }

  if (!data) return <PageLoader />;

  return (
    <section className="px-4 pb-20 pt-6">
      <div className="mx-auto max-w-6xl">
        <Link to={`/challenges/${slug}`} className="text-sm font-bold text-slate-500 hover:text-indigo-600">
          ← {data.challenge.title}
        </Link>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Project gallery</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">{data.projects.length} projects</h1>
            <p className="mt-1 text-sm text-slate-500">Everything students built for {data.challenge.title}.</p>
          </div>
          <label className="relative w-full sm:w-72">
            <span className="sr-only">Search projects</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects, tech, names"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10"
            />
          </label>
        </div>

        {shown.length === 0 ? (
          <p className="mt-10 text-center text-sm text-slate-500">No projects match.</p>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => (
              <Link
                key={p.id}
                to={`/projects/${p.id}`}
                className="group flex flex-col overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-600/5"
              >
                <div className={`relative flex h-32 items-center justify-center bg-gradient-to-br text-4xl font-black text-white ${gradientFor(p.id)}`}>
                  {initials(p.projectTitle)}
                  {p.badge && (
                    <span className="absolute left-3 top-3">
                      <Badge badge={p.badge} />
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-lg font-black text-slate-950 group-hover:text-indigo-600">{p.projectTitle}</h2>
                  <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-600">{p.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {(p.techStack || []).slice(0, 4).map((t) => (
                      <span key={t} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">{t}</span>
                    ))}
                  </div>
                  <p className="mt-auto pt-4 text-xs font-semibold text-slate-500">
                    {p.student.name}
                    {p.student.institute ? ` · ${p.student.institute}` : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* =========================================================
   ONE PROJECT  /projects/:id
========================================================= */

function videoEmbed(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname === "youtu.be") return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
  } catch {
    return null;
  }
  return null;
}

export function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/api/projects/${id}`)
      .then((d) => setProject(d.project))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="text-sm font-semibold text-slate-600">{error}</p>
        <Link to="/challenges" className="mt-4 inline-block text-sm font-bold text-indigo-600 hover:underline">← Challenges</Link>
      </div>
    );
  }
  if (!project) return <PageLoader />;

  const embed = project.videoUrl ? videoEmbed(project.videoUrl) : null;
  const linkBtn = "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition";

  return (
    <section className="px-4 pb-20 pt-6">
      <div className="mx-auto max-w-4xl">
        {project.challenge && (
          <Link to={`/challenges/${project.challenge.slug}/projects`} className="text-sm font-bold text-slate-500 hover:text-indigo-600">
            ← {project.challenge.title} projects
          </Link>
        )}

        <div className={`mt-4 rounded-[28px] bg-gradient-to-br p-6 text-white sm:p-10 ${gradientFor(project.id)}`}>
          <Badge badge={project.badge} />
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{project.projectTitle}</h1>
          <p className="mt-3 text-sm text-white/85">
            by <strong>{project.student.name}</strong>
            {project.student.institute ? ` · ${project.student.institute}` : ""}
            {project.student.city ? `, ${project.student.city}` : ""}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.liveDemoUrl && (
              <a href={project.liveDemoUrl} target="_blank" rel="noreferrer" className={`${linkBtn} bg-white text-slate-900 hover:bg-slate-100`}>
                <ExternalLink className="h-4 w-4" /> Live demo
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className={`${linkBtn} bg-white/15 text-white ring-1 ring-white/30 hover:bg-white/25`}>
                Source code
              </a>
            )}
            {project.videoUrl && !embed && (
              <a href={project.videoUrl} target="_blank" rel="noreferrer" className={`${linkBtn} bg-white/15 text-white ring-1 ring-white/30 hover:bg-white/25`}>
                <Play className="h-4 w-4" /> Demo video
              </a>
            )}
          </div>
        </div>

        {embed && (
          <div className="mt-6 aspect-video overflow-hidden rounded-[22px] border border-slate-200 bg-black">
            <iframe src={embed} title="Demo video" className="h-full w-full" allow="encrypted-media; picture-in-picture" allowFullScreen />
          </div>
        )}

        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_240px]">
          <div className="rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">About the project</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">{project.description}</p>
          </div>
          <aside className="space-y-4">
            <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Built with</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(project.techStack || []).map((t) => (
                  <span key={t} className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">{t}</span>
                ))}
              </div>
            </div>
            <div className="rounded-[22px] border border-slate-200 bg-white p-5 text-sm shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Builder</p>
              <p className="mt-1 font-black text-slate-900">{project.student.name}</p>
              {project.student.institute && <p className="text-slate-500">{project.student.institute}</p>}
              <div className="mt-2 flex gap-3 text-xs font-bold">
                {project.student.github && <a href={project.student.github} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">GitHub</a>}
                {project.student.linkedin && <a href={project.student.linkedin} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">LinkedIn</a>}
              </div>
              {project.submittedAt && <p className="mt-3 text-xs text-slate-400">Submitted {formatDate(project.submittedAt)}</p>}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

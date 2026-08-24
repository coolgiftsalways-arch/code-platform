import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Loader2,
  AlertCircle,
  ExternalLink,
  Code2,
} from "lucide-react";

const API = "http://localhost:5000/api/participants";

export default function Submissions() {
  const [participants, setParticipants] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load submissions");
      }

      setParticipants(data.participants || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const submissions = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return participants;

    return participants.filter((p) =>
      [
        p.fullName,
        p.projectTitle,
        p.category,
        p.instituteName,
        p.githubUrl,
        p.liveDemoUrl,
      ]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [participants, search]);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-5 text-slate-900 sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-indigo-600">
            HUBWEB / ADMIN
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Submissions
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Review submitted projects and technical details.
          </p>
        </div>

        <button
          onClick={fetchParticipants}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-black text-white hover:bg-indigo-600"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search project, participant, institute, category..."
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-indigo-400 focus:bg-white"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-sm font-bold text-red-600">
            {error}
          </span>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-slate-200 bg-white">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" />
            <p className="mt-3 text-sm font-bold text-slate-500">
              Loading submissions...
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white">
          <table className="w-full min-w-[1100px] border-collapse">
            <thead>
              <tr className="bg-slate-50">
                {[
                  "Participant",
                  "Project",
                  "Category",
                  "Tech Stack",
                  "GitHub",
                  "Live Demo",
                  "AI Tool",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="border-r border-slate-200 px-6 py-4 text-left text-[9px] font-black uppercase tracking-wider text-slate-400 last:border-r-0"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {submissions.map((p) => (
                <tr
                  key={p._id}
                  className="border-t border-slate-200 hover:bg-slate-50"
                >
                  <td className="border-r border-slate-200 px-6 py-5 last:border-r-0">
                    <p className="font-black">
                      {p.fullName || "—"}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {p.email || "—"}
                    </p>
                  </td>

                  <td className="border-r border-slate-200 px-6 py-5">
                    <p className="font-black">
                      {p.projectTitle || "—"}
                    </p>
                  </td>

                  <td className="border-r border-slate-200 px-6 py-5">
                    <span className="rounded-full bg-purple-50 px-3 py-2 text-xs font-black text-purple-600">
                      {p.category || "—"}
                    </span>
                  </td>

                  <td className="border-r border-slate-200 px-6 py-5">
                    <div className="flex max-w-[220px] flex-wrap gap-2">
                      {(p.techStack || []).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600"
                        >
                          {tech}
                        </span>
                      ))}

                      {!p.techStack?.length && (
                        <span className="text-xs text-slate-400">
                          No tech stack
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="border-r border-slate-200 px-6 py-5">
                    {p.githubUrl ? (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-xs font-black text-indigo-600"
                      >
                        <span className="text-sm">↗</span>
                        GitHub
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="border-r border-slate-200 px-6 py-5">
                    {p.liveDemoUrl ? (
                      <a
                        href={p.liveDemoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-xs font-black text-indigo-600"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Demo
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <Code2 className="h-4 w-4 text-indigo-500" />
                      {p.aiTool || "—"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!submissions.length && (
            <div className="p-12 text-center text-sm font-bold text-slate-400">
              No submissions found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
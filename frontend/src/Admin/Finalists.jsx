import { useEffect, useState } from "react";
import {
  Trophy,
  RefreshCw,
  Loader2,
  Award,
  ShieldCheck,
} from "lucide-react";

const API = "http://localhost:5000/api/participants";

export default function Finalists() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchParticipants = async () => {
    try {
      setLoading(true);

      const response = await fetch(API);
      const data = await response.json();

      setParticipants(data.participants || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const finalists = participants.filter(
    (p) =>
      p.status === "Finalist Confirmed" ||
      p.finalistPass === true
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-5 sm:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-indigo-600">
            HUBWEB / COMPETITION
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Finalists
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Manage confirmed finalist participants.
          </p>
        </div>

        <button
          onClick={fetchParticipants}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-black text-white"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <Trophy className="h-6 w-6 text-indigo-600" />
              <p className="mt-4 text-xs font-black uppercase text-slate-400">
                Finalists
              </p>
              <p className="mt-2 text-3xl font-black">
                {finalists.length}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
              <p className="mt-4 text-xs font-black uppercase text-slate-400">
                Pass Issued
              </p>
              <p className="mt-2 text-3xl font-black">
                {
                  finalists.filter(
                    (p) => p.finalistPass
                  ).length
                }
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6">
              <Award className="h-6 w-6 text-purple-600" />
              <p className="mt-4 text-xs font-black uppercase text-slate-400">
                Certificates
              </p>
              <p className="mt-2 text-3xl font-black">
                {
                  finalists.filter(
                    (p) => p.certificateIssued
                  ).length
                }
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  {[
                    "Participant",
                    "Project",
                    "Category",
                    "Payment",
                    "Finalist Pass",
                    "Certificate",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="border-r border-slate-200 px-6 py-4 text-left text-[9px] font-black uppercase text-slate-400 last:border-r-0"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {finalists.map((p) => (
                  <tr
                    key={p._id}
                    className="border-t border-slate-200"
                  >
                    <td className="border-r border-slate-200 px-6 py-5">
                      <p className="font-black">
                        {p.fullName || "—"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {p.email}
                      </p>
                    </td>

                    <td className="border-r border-slate-200 px-6 py-5 font-bold">
                      {p.projectTitle || "—"}
                    </td>

                    <td className="border-r border-slate-200 px-6 py-5">
                      {p.category || "—"}
                    </td>

                    <td className="border-r border-slate-200 px-6 py-5 font-bold">
                      {p.paymentStatus}
                    </td>

                    <td className="border-r border-slate-200 px-6 py-5">
                      {p.finalistPass ? (
                        <span className="text-xs font-black text-emerald-600">
                          Issued
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">
                          Not issued
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-5">
                      {p.certificateIssued ? (
                        <span className="text-xs font-black text-emerald-600">
                          Issued
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!finalists.length && (
              <div className="p-12 text-center text-sm font-bold text-slate-400">
                No finalists yet.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
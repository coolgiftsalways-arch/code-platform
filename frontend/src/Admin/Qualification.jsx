import { useEffect, useState } from "react";

import {
  Search,
  RefreshCw,
  Loader2,
  UserCheck,
  ChevronDown,
} from "lucide-react";

const API = "http://localhost:5000/api/participants";

const statuses = [
  "Application Received",
  "Screening",
  "Qualified",
  "Defense Scheduled",
  "Finalist Confirmed",
];

export default function Qualification() {
  const [participants, setParticipants] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // =====================================================
  // FETCH PARTICIPANTS
  // =====================================================

  const fetchParticipants = async () => {
    try {
      setLoading(true);

      const response = await fetch(API);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch participants"
        );
      }

      setParticipants(data.participants || []);
    } catch (error) {
      console.error("Fetch participants error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD PARTICIPANTS
  // =====================================================

  useEffect(() => {
    fetchParticipants();
  }, []);

  // =====================================================
  // UPDATE STATUS
  // =====================================================

  const updateStatus = async (participantId, newStatus) => {
    try {
      setUpdatingId(participantId);

      const response = await fetch(
        `${API}/${participantId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update status"
        );
      }

      // -------------------------------------------------
      // UPDATE UI IMMEDIATELY
      // -------------------------------------------------

      setParticipants((prev) =>
        prev.map((participant) =>
          participant._id === participantId
            ? {
                ...participant,
                status: data.participant.status,
                finalistPass:
                  data.participant.finalistPass,
              }
            : participant
        )
      );

      console.log(data.message);
    } catch (error) {
      console.error("Update status error:", error);

      alert(
        error.message || "Failed to update participant status"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filtered = participants.filter((p) =>
    [
      p.fullName,
      p.email,
      p.projectTitle,
      p.instituteName,
      p.status,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Qualified":
        return "bg-emerald-50 text-emerald-600";

      case "Screening":
        return "bg-amber-50 text-amber-600";

      case "Defense Scheduled":
        return "bg-blue-50 text-blue-600";

      case "Finalist Confirmed":
        return "bg-purple-50 text-purple-600";

      default:
        return "bg-indigo-50 text-indigo-600";
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-5 sm:p-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-indigo-600">
            HUBWEB / STUDENT MANAGEMENT
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Qualification
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Manage participant qualification stages.
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

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5">

        <div className="relative">

          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search participant, project or institute..."
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-indigo-400 focus:bg-white"
          />

        </div>
      </div>

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading ? (

        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-slate-200 bg-white">

          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />

        </div>

      ) : (

        /* =====================================================
           TABLE
        ===================================================== */

        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white">

          <table className="w-full min-w-[1000px] border-collapse">

            <thead>

              <tr className="bg-slate-50">

                <th className="border-r border-slate-200 px-6 py-4 text-left text-[9px] font-black uppercase text-slate-400">
                  Participant
                </th>

                <th className="border-r border-slate-200 px-6 py-4 text-left text-[9px] font-black uppercase text-slate-400">
                  Project
                </th>

                <th className="border-r border-slate-200 px-6 py-4 text-left text-[9px] font-black uppercase text-slate-400">
                  Current Status
                </th>

                <th className="px-6 py-4 text-left text-[9px] font-black uppercase text-slate-400">
                  Qualification
                </th>

              </tr>

            </thead>

            <tbody>

              {filtered.length === 0 ? (

                <tr>

                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-sm text-slate-400"
                  >
                    No participants found.
                  </td>

                </tr>

              ) : (

                filtered.map((p) => (

                  <tr
                    key={p._id}
                    className="border-t border-slate-200 hover:bg-slate-50"
                  >

                    {/* PARTICIPANT */}

                    <td className="border-r border-slate-200 px-6 py-5">

                      <p className="font-black">
                        {p.fullName || "—"}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {p.email}
                      </p>

                    </td>

                    {/* PROJECT */}

                    <td className="border-r border-slate-200 px-6 py-5">

                      <p className="font-black">
                        {p.projectTitle || "—"}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {p.category || "—"}
                      </p>

                    </td>

                    {/* CURRENT STATUS */}

                    <td className="border-r border-slate-200 px-6 py-5">

                      <span
                        className={`rounded-full px-3 py-2 text-[10px] font-black ${getStatusClass(
                          p.status
                        )}`}
                      >
                        {p.status}
                      </span>

                    </td>

                    {/* QUALIFICATION */}

                    <td className="px-6 py-5">

                      <div className="relative w-64">

                        <UserCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-500" />

                        <select
                          value={
                            p.status ||
                            "Application Received"
                          }
                          disabled={
                            updatingId === p._id
                          }
                          onChange={(e) =>
                            updateStatus(
                              p._id,
                              e.target.value
                            )
                          }
                          className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-9 text-xs font-bold outline-none focus:border-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                          {statuses.map((status) => (

                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>

                          ))}

                        </select>

                        {updatingId === p._id ? (

                          <Loader2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-indigo-500" />

                        ) : (

                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        )}

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}
import { useEffect, useState } from "react";

import {
  Search,
  RefreshCw,
  Loader2,
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  CalendarClock,
} from "lucide-react";

const API = "http://localhost:5000/api/defense";

export default function DefenseSchedule() {
  const [participants, setParticipants] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const [selectedParticipant, setSelectedParticipant] =
    useState(null);

  const [defenseDate, setDefenseDate] = useState("");
  const [defenseTime, setDefenseTime] = useState("");

  // =====================================================
  // FETCH DEFENSE PARTICIPANTS
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
      console.error("Fetch defense participants error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  // =====================================================
  // OPEN SCHEDULE MODAL
  // =====================================================

  const openSchedule = (participant) => {
    setSelectedParticipant(participant);

    if (participant.defenseSlot) {
      const date = new Date(participant.defenseSlot);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      setDefenseDate(`${year}-${month}-${day}`);
      setDefenseTime(`${hours}:${minutes}`);
    } else {
      setDefenseDate("");
      setDefenseTime("");
    }
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeSchedule = () => {
    setSelectedParticipant(null);
    setDefenseDate("");
    setDefenseTime("");
  };

  // =====================================================
  // SCHEDULE DEFENSE
  // =====================================================

  const saveDefense = async () => {
    if (!selectedParticipant) return;

    if (!defenseDate || !defenseTime) {
      alert("Please select date and time.");
      return;
    }

    const defenseSlot = new Date(
      `${defenseDate}T${defenseTime}`
    );

    if (defenseSlot <= new Date()) {
      alert("Please select a future date and time.");
      return;
    }

    try {
      setSavingId(selectedParticipant._id);

      const response = await fetch(
        `${API}/${selectedParticipant._id}/schedule`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            defenseSlot: defenseSlot.toISOString(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to schedule defense"
        );
      }

      setParticipants((prev) =>
        prev.map((participant) =>
          participant._id === selectedParticipant._id
            ? data.participant
            : participant
        )
      );

      closeSchedule();

      alert("Defense scheduled successfully.");
    } catch (error) {
      console.error("Schedule defense error:", error);

      alert(
        error.message || "Failed to schedule defense"
      );
    } finally {
      setSavingId(null);
    }
  };

  // =====================================================
  // COMPLETE DEFENSE
  // =====================================================

  const completeDefense = async (id) => {
    const confirmed = window.confirm(
      "Mark this technical defense as completed?"
    );

    if (!confirmed) return;

    try {
      setSavingId(id);

      const response = await fetch(
        `${API}/${id}/complete`,
        {
          method: "PATCH",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to complete defense"
        );
      }

      setParticipants((prev) =>
        prev.map((participant) =>
          participant._id === id
            ? data.participant
            : participant
        )
      );
    } catch (error) {
      console.error("Complete defense error:", error);

      alert(
        error.message || "Failed to complete defense"
      );
    } finally {
      setSavingId(null);
    }
  };

  // =====================================================
  // CANCEL DEFENSE
  // =====================================================

  const cancelDefense = async (id) => {
    const confirmed = window.confirm(
      "Cancel this defense schedule?"
    );

    if (!confirmed) return;

    try {
      setSavingId(id);

      const response = await fetch(
        `${API}/${id}/cancel`,
        {
          method: "PATCH",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to cancel defense"
        );
      }

      setParticipants((prev) =>
        prev.map((participant) =>
          participant._id === id
            ? data.participant
            : participant
        )
      );
    } catch (error) {
      console.error("Cancel defense error:", error);

      alert(
        error.message || "Failed to cancel defense"
      );
    } finally {
      setSavingId(null);
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filtered = participants.filter((participant) =>
    [
      participant.fullName,
      participant.email,
      participant.projectTitle,
      participant.instituteName,
      participant.status,
      participant.defenseStatus,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getDefenseStatusClass = (status) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-50 text-blue-600";

      case "Completed":
        return "bg-emerald-50 text-emerald-600";

      default:
        return "bg-amber-50 text-amber-600";
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (slot) => {
    if (!slot) return "—";

    return new Date(slot).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (slot) => {
    if (!slot) return "—";

    return new Date(slot).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
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
            Defense Schedule
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Manage 5-minute technical defense interviews.
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
          TABLE
      ===================================================== */}

      {loading ? (

        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-slate-200 bg-white">

          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />

        </div>

      ) : (

        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white">

          <table className="w-full min-w-[1200px] border-collapse">

            <thead>

              <tr className="bg-slate-50">

                <th className="border-r border-slate-200 px-6 py-4 text-left text-[9px] font-black uppercase text-slate-400">
                  Participant
                </th>

                <th className="border-r border-slate-200 px-6 py-4 text-left text-[9px] font-black uppercase text-slate-400">
                  Project
                </th>

                <th className="border-r border-slate-200 px-6 py-4 text-left text-[9px] font-black uppercase text-slate-400">
                  Qualification
                </th>

                <th className="border-r border-slate-200 px-6 py-4 text-left text-[9px] font-black uppercase text-slate-400">
                  Defense Status
                </th>

                <th className="border-r border-slate-200 px-6 py-4 text-left text-[9px] font-black uppercase text-slate-400">
                  Scheduled Slot
                </th>

                <th className="px-6 py-4 text-left text-[9px] font-black uppercase text-slate-400">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filtered.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-sm text-slate-400"
                  >
                    No defense participants found.
                  </td>

                </tr>

              ) : (

                filtered.map((participant) => (

                  <tr
                    key={participant._id}
                    className="border-t border-slate-200 hover:bg-slate-50"
                  >

                    {/* PARTICIPANT */}

                    <td className="border-r border-slate-200 px-6 py-5">

                      <p className="font-black">
                        {participant.fullName || "—"}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {participant.email || "—"}
                      </p>

                    </td>

                    {/* PROJECT */}

                    <td className="border-r border-slate-200 px-6 py-5">

                      <p className="font-black">
                        {participant.projectTitle || "—"}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {participant.category || "—"}
                      </p>

                    </td>

                    {/* QUALIFICATION */}

                    <td className="border-r border-slate-200 px-6 py-5">

                      <span className="rounded-full bg-purple-50 px-3 py-2 text-[10px] font-black text-purple-600">
                        {participant.status}
                      </span>

                    </td>

                    {/* DEFENSE STATUS */}

                    <td className="border-r border-slate-200 px-6 py-5">

                      <span
                        className={`rounded-full px-3 py-2 text-[10px] font-black ${getDefenseStatusClass(
                          participant.defenseStatus
                        )}`}
                      >
                        {participant.defenseStatus}
                      </span>

                    </td>

                    {/* SLOT */}

                    <td className="border-r border-slate-200 px-6 py-5">

                      {participant.defenseSlot ? (

                        <div>

                          <div className="flex items-center gap-2 text-sm font-black text-slate-700">

                            <CalendarDays className="h-4 w-4 text-indigo-500" />

                            {formatDate(
                              participant.defenseSlot
                            )}

                          </div>

                          <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">

                            <Clock className="h-3.5 w-3.5" />

                            {formatTime(
                              participant.defenseSlot
                            )}

                            <span>• 5 min</span>

                          </div>

                        </div>

                      ) : (

                        <span className="text-sm text-slate-400">
                          Not scheduled
                        </span>

                      )}

                    </td>

                    {/* ACTION */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-2">

                        {participant.defenseStatus !==
                          "Completed" && (

                          <button
                            onClick={() =>
                              openSchedule(participant)
                            }
                            disabled={
                              savingId ===
                              participant._id
                            }
                            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-black text-white hover:bg-indigo-700 disabled:opacity-50"
                          >

                            {participant.defenseStatus ===
                            "Scheduled" ? (
                              <>
                                <CalendarClock className="h-4 w-4" />
                                Reschedule
                              </>
                            ) : (
                              <>
                                <CalendarDays className="h-4 w-4" />
                                Schedule
                              </>
                            )}

                          </button>

                        )}

                        {participant.defenseStatus ===
                          "Scheduled" && (

                          <button
                            onClick={() =>
                              completeDefense(
                                participant._id
                              )
                            }
                            disabled={
                              savingId ===
                              participant._id
                            }
                            className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 hover:bg-emerald-100 disabled:opacity-50"
                            title="Mark completed"
                          >

                            <CheckCircle2 className="h-4 w-4" />

                          </button>

                        )}

                        {participant.defenseStatus ===
                          "Scheduled" && (

                          <button
                            onClick={() =>
                              cancelDefense(
                                participant._id
                              )
                            }
                            disabled={
                              savingId ===
                              participant._id
                            }
                            className="rounded-xl bg-red-50 p-2.5 text-red-500 hover:bg-red-100 disabled:opacity-50"
                            title="Cancel defense"
                          >

                            <XCircle className="h-4 w-4" />

                          </button>

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

      {/* =====================================================
          SCHEDULE MODAL
      ===================================================== */}

      {selectedParticipant && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-5 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-2xl">

            {/* HEADER */}

            <div className="mb-6">

              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50">

                <CalendarDays className="h-6 w-6 text-indigo-600" />

              </div>

              <h2 className="text-2xl font-black text-slate-900">
                Schedule Technical Defense
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Select a 5-minute virtual defense slot.
              </p>

            </div>

            {/* PARTICIPANT */}

            <div className="mb-5 rounded-2xl bg-slate-50 p-4">

              <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                Participant
              </p>

              <p className="mt-1 font-black text-slate-900">
                {selectedParticipant.fullName}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {selectedParticipant.projectTitle}
              </p>

            </div>

            {/* DATE */}

            <div className="mb-4">

              <label className="mb-2 block text-xs font-black uppercase text-slate-500">
                Defense Date
              </label>

              <input
                type="date"
                value={defenseDate}
                onChange={(e) =>
                  setDefenseDate(e.target.value)
                }
                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm font-bold outline-none focus:border-indigo-400"
              />

            </div>

            {/* TIME */}

            <div className="mb-7">

              <label className="mb-2 block text-xs font-black uppercase text-slate-500">
                Defense Time
              </label>

              <input
                type="time"
                value={defenseTime}
                onChange={(e) =>
                  setDefenseTime(e.target.value)
                }
                className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm font-bold outline-none focus:border-indigo-400"
              />

            </div>

            {/* BUTTONS */}

            <div className="flex gap-3">

              <button
                onClick={closeSchedule}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={saveDefense}
                disabled={savingId === selectedParticipant._id}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-black text-white hover:bg-indigo-700 disabled:opacity-50"
              >

                {savingId === selectedParticipant._id ? (

                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>

                ) : (

                  <>
                    <CalendarDays className="h-4 w-4" />
                    Schedule Defense
                  </>

                )}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
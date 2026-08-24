import { useEffect, useState } from "react";

import {
  Crown,
  Medal,
  Trophy,
  UserRound,
  CheckCircle,
  X,
  Loader2,
} from "lucide-react";

export default function Winners() {
  const [winners, setWinners] = useState([]);
  const [finalists, setFinalists] = useState([]);

  const [selectedParticipant, setSelectedParticipant] = useState("");
  const [selectedRank, setSelectedRank] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const API = "http://localhost:5000/api";

  // =====================================================
  // FETCH DATA
  // =====================================================

  const fetchData = async () => {
    try {
      setLoading(true);

      const [winnersResponse, finalistsResponse] =
        await Promise.all([
          fetch(`${API}/winners`),
          fetch(`${API}/winners/finalists`),
        ]);

      const winnersData = await winnersResponse.json();
      const finalistsData = await finalistsResponse.json();

      if (winnersData.success) {
        setWinners(winnersData.winners);
      }

      if (finalistsData.success) {
        setFinalists(finalistsData.finalists);
      }
    } catch (error) {
      console.error("Failed to fetch winner data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =====================================================
  // MAKE WINNER
  // =====================================================

  const handleMakeWinner = async () => {
    if (!selectedParticipant || !selectedRank) {
      alert("Please select a participant and winner position.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`${API}/winners/make`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participantId: selectedParticipant,
          winnerRank: selectedRank,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to make winner");
        return;
      }

      alert(data.message);

      setSelectedParticipant("");
      setSelectedRank("");

      fetchData();
    } catch (error) {
      console.error("Make winner error:", error);

      alert("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // REMOVE WINNER
  // =====================================================

  const handleRemoveWinner = async (id) => {
    const confirmRemove = window.confirm(
      "Remove this participant from winners?"
    );

    if (!confirmRemove) return;

    try {
      const response = await fetch(
        `${API}/winners/remove/${id}`,
        {
          method: "PATCH",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to remove winner");
        return;
      }

      fetchData();
    } catch (error) {
      console.error("Remove winner error:", error);
      alert("Something went wrong.");
    }
  };

  // =====================================================
  // FIND WINNER BY RANK
  // =====================================================

  const firstPlace = winners.find(
    (winner) => winner.winnerRank === "1st Place"
  );

  const secondPlace = winners.find(
    (winner) => winner.winnerRank === "2nd Place"
  );

  const thirdPlace = winners.find(
    (winner) => winner.winnerRank === "3rd Place"
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f8fafc] p-10">

      {/* HEADER */}

      <div className="mb-10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
          HUBWEB / COMPETITION
        </p>

        <h1 className="mt-2 text-4xl font-black text-slate-900">
          Winners
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Manage competition winners and rankings.
        </p>
      </div>

      {/* WINNER CARDS */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* FIRST */}

        <WinnerCard
          rank="1ST PLACE"
          title="Winner"
          winner={firstPlace}
          icon={<Crown size={38} />}
          type="first"
          onRemove={handleRemoveWinner}
        />

        {/* SECOND */}

        <WinnerCard
          rank="2ND PLACE"
          title="Runner Up"
          winner={secondPlace}
          icon={<Medal size={38} />}
          type="second"
          onRemove={handleRemoveWinner}
        />

        {/* THIRD */}

        <WinnerCard
          rank="3RD PLACE"
          title="Second Runner Up"
          winner={thirdPlace}
          icon={<Trophy size={38} />}
          type="third"
          onRemove={handleRemoveWinner}
        />

      </div>

      {/* MAKE WINNER */}

      <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

        <div className="mb-7">

          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-600">
            WINNER MANAGEMENT
          </p>

          <h2 className="mt-2 text-2xl font-black text-slate-900">
            Make a Winner
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Select a finalist and assign their competition position.
          </p>

        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

          {/* PARTICIPANT */}

          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
              Participant
            </label>

            <select
              value={selectedParticipant}
              onChange={(e) =>
                setSelectedParticipant(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-500"
            >
              <option value="">
                Select finalist
              </option>

              {finalists.map((participant) => (
                <option
                  key={participant._id}
                  value={participant._id}
                >
                  {participant.fullName ||
                    `${participant.firstName || ""} ${
                      participant.lastName || ""
                    }`}
                </option>
              ))}
            </select>
          </div>

          {/* POSITION */}

          <div>
            <label className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">
              Position
            </label>

            <select
              value={selectedRank}
              onChange={(e) =>
                setSelectedRank(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-500"
            >
              <option value="">
                Select position
              </option>

              <option value="1st Place">
                🥇 1st Place
              </option>

              <option value="2nd Place">
                🥈 2nd Place
              </option>

              <option value="3rd Place">
                🥉 3rd Place
              </option>
            </select>
          </div>

          {/* BUTTON */}

          <div className="flex items-end">

            <button
              onClick={handleMakeWinner}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-black text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />

                  Make Winner
                </>
              )}
            </button>

          </div>

        </div>
      </div>

      {/* ELIGIBLE FINALISTS */}

      <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

        <div className="mb-6">

          <h2 className="text-2xl font-black text-slate-900">
            Eligible Finalists
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Participants who can be selected as competition winners.
          </p>

        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2
              size={28}
              className="animate-spin text-indigo-600"
            />
          </div>
        ) : finalists.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">
            <UserRound
              size={35}
              className="mx-auto text-slate-400"
            />

            <p className="mt-3 font-bold text-slate-600">
              No finalists available yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full border-collapse">

              <thead>
                <tr className="border-b border-slate-200 text-left">

                  <th className="px-4 py-4 text-xs font-black uppercase tracking-wider text-slate-400">
                    Participant
                  </th>

                  <th className="px-4 py-4 text-xs font-black uppercase tracking-wider text-slate-400">
                    Project
                  </th>

                  <th className="px-4 py-4 text-xs font-black uppercase tracking-wider text-slate-400">
                    Category
                  </th>

                  <th className="px-4 py-4 text-xs font-black uppercase tracking-wider text-slate-400">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody>

                {finalists.map((participant) => (

                  <tr
                    key={participant._id}
                    className="border-b border-slate-100"
                  >

                    <td className="px-4 py-5">

                      <div className="font-bold text-slate-900">
                        {participant.fullName || "—"}
                      </div>

                      <div className="mt-1 text-xs text-slate-400">
                        {participant.email || "—"}
                      </div>

                    </td>

                    <td className="px-4 py-5 font-semibold text-slate-700">
                      {participant.projectTitle || "—"}
                    </td>

                    <td className="px-4 py-5">

                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
                        {participant.category || "—"}
                      </span>

                    </td>

                    <td className="px-4 py-5">

                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
                        {participant.status}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

// =====================================================
// WINNER CARD
// =====================================================

function WinnerCard({
  rank,
  title,
  winner,
  icon,
  type,
  onRemove,
}) {
  const styles = {
    first: {
      card: "border-yellow-200 bg-yellow-50",
      icon: "text-yellow-600",
      rank: "text-yellow-700",
    },

    second: {
      card: "border-slate-200 bg-white",
      icon: "text-slate-500",
      rank: "text-slate-600",
    },

    third: {
      card: "border-orange-200 bg-orange-50",
      icon: "text-orange-600",
      rank: "text-orange-700",
    },
  };

  const style = styles[type];

  return (
    <div
      className={`rounded-3xl border p-8 ${style.card}`}
    >

      <div className={style.icon}>
        {icon}
      </div>

      <p
        className={`mt-7 text-sm font-black ${style.rank}`}
      >
        {rank}
      </p>

      {winner ? (
        <>
          <h2 className="mt-3 text-3xl font-black text-slate-900">
            {winner.fullName || "Winner"}
          </h2>

          <p className="mt-2 text-sm font-semibold text-slate-500">
            {winner.projectTitle || "Project not available"}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {winner.email}
          </p>

          <button
            onClick={() => onRemove(winner._id)}
            className="mt-6 flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-xs font-black text-red-500 transition hover:bg-red-50"
          >
            <X size={15} />

            Remove Winner
          </button>
        </>
      ) : (
        <>
          <h2 className="mt-3 text-3xl font-black text-slate-900">
            {title}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Winner will appear here.
          </p>
        </>
      )}

    </div>
  );
}
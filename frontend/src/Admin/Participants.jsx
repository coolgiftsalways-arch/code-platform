import { useEffect, useMemo, useState } from "react";

import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  CalendarDays,
  RefreshCw,
  Loader2,
  AlertCircle,
  Eye,
  X,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Trophy,
  Bot,
  Code2,
  CheckCircle2,
  Clock3,
  CircleUserRound,
} from "lucide-react";

export default function Participants() {
  // =========================================================
  // STATE
  // =========================================================

  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  // =========================================================
  // FETCH PARTICIPANTS
  // =========================================================

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/participants");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch participants");
      }

      setParticipants(data.participants || []);
    } catch (error) {
      console.error("Fetch participants error:", error);

      setError(error.message || "Unable to connect to the backend server.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchParticipants();
  }, []);

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredParticipants = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    if (!searchValue) {
      return participants;
    }

    return participants.filter((participant) => {
      const values = [
        participant.fullName,
        participant.email,
        participant.mobile,
        participant.city,
        participant.instituteName,
        participant.instituteCode,
        participant.projectTitle,
        participant.category,
        participant.status,
        participant.paymentStatus,
      ];

      return values.some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(searchValue),
      );
    });
  }, [participants, search]);

  // =========================================================
  // STATS
  // =========================================================

  const totalParticipants = participants.length;

  const applications = participants.filter(
    (participant) => participant.status === "Application Received",
  ).length;

  const paidParticipants = participants.filter(
    (participant) => participant.paymentStatus === "Paid",
  ).length;

  const qualifiedParticipants = participants.filter(
    (participant) => participant.status === "Qualified",
  ).length;

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // STATUS COLORS
  // =========================================================

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

  // =========================================================
  // PAYMENT COLORS
  // =========================================================

  const getPaymentClass = (status) => {
    if (status === "Paid") {
      return "bg-emerald-50 text-emerald-600";
    }

    return "bg-amber-50 text-amber-600";
  };

  // =========================================================
  // BOOLEAN BADGE
  // =========================================================

  const BooleanBadge = ({ value, trueText = "Yes", falseText = "No" }) => {
    return value ? (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black text-emerald-600">
        <CheckCircle2 className="h-3 w-3" />
        {trueText}
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black text-slate-500">
        {falseText}
      </span>
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="flex min-h-20 items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-indigo-600">
            HUBWEB / ADMIN
          </p>

          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
            Participants
          </h1>

          <p className="mt-1 text-xs text-slate-400">
            Manage all registered participants.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchParticipants}
          disabled={loading}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-slate-900
            px-4
            py-3
            text-xs
            font-black
            text-white
            transition
            hover:bg-indigo-600
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />

          <span className="hidden sm:inline">Refresh</span>
        </button>
      </header>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="p-5 sm:p-8">
        {/* ===================================================
            STAT CARDS
        =================================================== */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* TOTAL */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Total Participants
                </p>

                <h2 className="mt-2 text-3xl font-black text-slate-900">
                  {totalParticipants}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* APPLICATIONS */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Applications
                </p>

                <h2 className="mt-2 text-3xl font-black text-slate-900">
                  {applications}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <GraduationCap className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* QUALIFIED */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Qualified
                </p>

                <h2 className="mt-2 text-3xl font-black text-slate-900">
                  {qualifiedParticipants}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Trophy className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* PAID */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                  Paid
                </p>

                <h2 className="mt-2 text-3xl font-black text-slate-900">
                  {paidParticipants}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <CreditCard className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            SEARCH
        =================================================== */}

        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, project, institute, category..."
              className="
                h-12
                w-full
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                pl-11
                pr-4
                text-sm
                font-medium
                text-slate-700
                outline-none
                transition
                focus:border-indigo-400
                focus:bg-white
              "
            />
          </div>
        </div>

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-red-100 bg-red-50 p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500" />

              <div>
                <p className="text-sm font-black text-red-700">
                  Unable to load participants
                </p>

                <p className="mt-1 text-xs text-red-500">{error}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchParticipants}
              className="rounded-xl bg-red-600 px-4 py-2 text-xs font-black text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ===================================================
            LOADING
        =================================================== */}

        {loading && (
          <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-slate-200 bg-white">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-600" />

              <p className="mt-3 text-sm font-bold text-slate-500">
                Loading participants...
              </p>
            </div>
          </div>
        )}

        {/* ===================================================
            TABLE
        =================================================== */}

        {!loading && !error && (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-black">All Participants</h2>

                <p className="mt-1 text-xs text-slate-400">
                  Showing {filteredParticipants.length} of {participants.length}{" "}
                  participants
                </p>
              </div>
            </div>

            {filteredParticipants.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1200px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-left">
                      <th className="border-r border-slate-200 px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-400 last:border-r-0">
                        Participant
                      </th>

                      <th className="border-r border-slate-200 px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-400 last:border-r-0">
                        Institute
                      </th>

                      <th className="border-r border-slate-200 px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-400 last:border-r-0">
                        Project
                      </th>

                      <th className="border-r border-slate-200 px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-400 last:border-r-0">
                        Category
                      </th>

                      <th className="border-r border-slate-200 px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-400 last:border-r-0">
                        Contact
                      </th>

                      <th className="border-r border-slate-200 px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-400 last:border-r-0">
                        Status
                      </th>

                      <th className="border-r border-slate-200 px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-400 last:border-r-0">
                        Payment
                      </th>

                      <th className="border-r border-slate-200 px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-400 last:border-r-0">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredParticipants.map((participant) => (
                      <tr
                        key={participant._id}
                        className="border-b border-slate-100 transition hover:bg-indigo-50/30"
                      >
                        {/* PARTICIPANT */}

                        <td className="border-r border-slate-200 px-6 py-5 last:border-r-0">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-black text-indigo-600">
                              {participant.fullName?.charAt(0)?.toUpperCase() ||
                                "?"}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-black text-slate-900">
                                {participant.fullName || "—"}
                              </p>

                              <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                                <Mail className="h-3 w-3" />
                                {participant.email || "—"}
                              </p>

                              <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                                <MapPin className="h-3 w-3" />
                                {participant.city || "—"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* INSTITUTE */}

                        <td className="border-r border-slate-200 px-6 py-5 last:border-r-0">
                          <p className="max-w-[180px] text-xs font-black text-slate-700">
                            {participant.instituteName || "—"}
                          </p>

                          <p className="mt-1 text-[10px] text-slate-400">
                            Code: {participant.instituteCode || "—"}
                          </p>
                        </td>

                        {/* PROJECT */}

                        <td className="border-r border-slate-200 px-6 py-5 last:border-r-0">
                          <p className="max-w-[190px] truncate text-xs font-black text-slate-700">
                            {participant.projectTitle || "—"}
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                            <Code2 className="h-3 w-3" />

                            {participant.techStack?.length
                              ? participant.techStack.slice(0, 3).join(", ")
                              : "No tech stack"}
                          </p>
                        </td>

                        {/* CATEGORY */}

                        <td className="border-r border-slate-200 px-6 py-5 last:border-r-0">
                          <span className="inline-flex rounded-full bg-purple-50 px-3 py-1 text-[10px] font-black text-purple-600">
                            {participant.category || "—"}
                          </span>
                        </td>

                        {/* CONTACT */}

                        <td className="border-r border-slate-200 px-6 py-5 last:border-r-0">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                            <Phone className="h-3.5 w-3.5 text-indigo-500" />

                            {participant.mobile || "—"}
                          </div>

                          <p className="mt-1 text-[10px] text-slate-400">
                            Age: {participant.age || "—"}
                          </p>
                        </td>

                        {/* STATUS */}

                        <td className="border-r border-slate-200 px-6 py-5 last:border-r-0">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black ${getStatusClass(
                              participant.status,
                            )}`}
                          >
                            {participant.status || "Application Received"}
                          </span>
                        </td>

                        {/* PAYMENT */}

                        <td className="border-r border-slate-200 px-6 py-5 last:border-r-0">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black ${getPaymentClass(
                              participant.paymentStatus,
                            )}`}
                          >
                            {participant.paymentStatus || "Pending"}
                          </span>

                          <p className="mt-1 text-[10px] font-bold text-slate-400">
                            ₹{participant.finalistFee || 399}
                          </p>
                        </td>

                        {/* ACTION */}

                        <td className="border-r border-slate-200 px-6 py-5 last:border-r-0">
                          <button
                            type="button"
                            onClick={() => setSelectedParticipant(participant)}
                            className="
    flex
    h-10
    w-10
    items-center
    justify-center
    rounded-xl
    border
    border-slate-200
    bg-white
    text-slate-400
    shadow-sm
    transition-all
    duration-200
    hover:border-indigo-200
    hover:bg-indigo-50
    hover:text-indigo-600
    hover:shadow-md
  "
                            title="View participant"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Users className="h-6 w-6" />
                </div>

                <h3 className="mt-4 text-lg font-black">
                  No participants found
                </h3>

                <p className="mt-1 max-w-sm text-xs text-slate-400">
                  Try changing your search or submit a new participant through
                  the website.
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* =====================================================
          PARTICIPANT DETAILS MODAL
      ===================================================== */}

      {selectedParticipant && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-slate-950/50
            p-4
            backdrop-blur-sm
          "
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedParticipant(null);
            }
          }}
        >
          <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 sm:px-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-black text-indigo-600">
                  {selectedParticipant.fullName?.charAt(0)?.toUpperCase() ||
                    "?"}
                </div>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-indigo-600">
                    Participant Details
                  </p>

                  <h2 className="mt-1 text-xl font-black text-slate-900">
                    {selectedParticipant.fullName || "—"}
                  </h2>

                  <p className="mt-1 text-xs text-slate-400">
                    Registered {formatDate(selectedParticipant.createdAt)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedParticipant(null)}
                className="rounded-xl p-2.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* MODAL CONTENT */}

            <div className="max-h-[calc(90vh-90px)] overflow-y-auto p-6 sm:p-8">
              {/* STUDENT PROFILE */}

              <section>
                <SectionTitle
                  icon={<CircleUserRound className="h-4 w-4" />}
                  title="Student Profile"
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <InfoItem
                    label="Full Name"
                    value={selectedParticipant.fullName}
                  />

                  <InfoItem
                    label="Age"
                    value={
                      selectedParticipant.age
                        ? `${selectedParticipant.age} years`
                        : "—"
                    }
                  />

                  <InfoItem label="Mobile" value={selectedParticipant.mobile} />

                  <InfoItem label="Email" value={selectedParticipant.email} />

                  <InfoItem label="City" value={selectedParticipant.city} />

                  <InfoItem
                    label="LinkedIn"
                    value={
                      selectedParticipant.linkedin ? (
                        <a
                          href={selectedParticipant.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-indigo-600 hover:underline"
                        >
                          View Profile
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        "Not provided"
                      )
                    }
                  />
                </div>
              </section>

              {/* INSTITUTE */}

              <section className="mt-8">
                <SectionTitle
                  icon={<GraduationCap className="h-4 w-4" />}
                  title="Institute Details"
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoItem
                    label="Institute Name"
                    value={selectedParticipant.instituteName}
                  />

                  <InfoItem
                    label="Institute Code"
                    value={selectedParticipant.instituteCode}
                  />
                </div>
              </section>

              {/* PROJECT */}

              <section className="mt-8">
                <SectionTitle
                  icon={<Code2 className="h-4 w-4" />}
                  title="Project Details"
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoItem
                    label="Project Title"
                    value={selectedParticipant.projectTitle}
                  />

                  <InfoItem
                    label="Category"
                    value={
                      <span className="inline-flex rounded-full bg-purple-50 px-3 py-1 text-[10px] font-black text-purple-600">
                        {selectedParticipant.category || "—"}
                      </span>
                    }
                  />

                  <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                      Tech Stack
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedParticipant.techStack?.length ? (
                        selectedParticipant.techStack.map((tech, index) => (
                          <span
                            key={`${tech}-${index}`}
                            className="rounded-full bg-white px-3 py-1.5 text-[10px] font-black text-slate-600 shadow-sm ring-1 ring-slate-200"
                          >
                            {tech}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">
                          No tech stack provided
                        </span>
                      )}
                    </div>
                  </div>

                  <InfoItem
                    label="GitHub"
                    value={
                      selectedParticipant.githubUrl ? (
                        <a
                          href={selectedParticipant.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-indigo-600 hover:underline"
                        >
                          Open GitHub
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        "—"
                      )
                    }
                  />

                  <InfoItem
                    label="Live Demo"
                    value={
                      selectedParticipant.liveDemoUrl ? (
                        <a
                          href={selectedParticipant.liveDemoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-indigo-600 hover:underline"
                        >
                          Open Demo
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        "—"
                      )
                    }
                  />
                </div>
              </section>

              {/* AI + VERIFICATION */}

              <section className="mt-8">
                <SectionTitle
                  icon={<Bot className="h-4 w-4" />}
                  title="AI & Verification"
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <InfoItem
                    label="AI Tool"
                    value={selectedParticipant.aiTool}
                  />

                  <InfoItem
                    label="Technical Defense"
                    value={
                      <BooleanBadge
                        value={selectedParticipant.technicalDefense}
                      />
                    }
                  />

                  <InfoItem
                    label="Hiring Opt-In"
                    value={
                      <BooleanBadge value={selectedParticipant.hiringOptIn} />
                    }
                  />
                </div>
              </section>

              {/* QUALIFICATION */}

              <section className="mt-8">
                <SectionTitle
                  icon={<ShieldCheck className="h-4 w-4" />}
                  title="Qualification"
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoItem
                    label="Current Status"
                    value={
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black ${getStatusClass(
                          selectedParticipant.status,
                        )}`}
                      >
                        {selectedParticipant.status || "Application Received"}
                      </span>
                    }
                  />

                  <InfoItem
                    label="Finalist Pass"
                    value={
                      <BooleanBadge value={selectedParticipant.finalistPass} />
                    }
                  />
                </div>
              </section>

              {/* PAYMENT */}

              <section className="mt-8">
                <SectionTitle
                  icon={<CreditCard className="h-4 w-4" />}
                  title="Payment"
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <InfoItem
                    label="Payment Status"
                    value={
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black ${getPaymentClass(
                          selectedParticipant.paymentStatus,
                        )}`}
                      >
                        {selectedParticipant.paymentStatus || "Pending"}
                      </span>
                    }
                  />

                  <InfoItem
                    label="Finalist Fee"
                    value={`₹${selectedParticipant.finalistFee || 399}`}
                  />

                  <InfoItem
                    label="Razorpay Order"
                    value={selectedParticipant.razorpayOrderId || "Not created"}
                  />

                  <InfoItem
                    label="Razorpay Payment"
                    value={selectedParticipant.razorpayPaymentId || "Not paid"}
                  />
                </div>
              </section>

              {/* ADDONS */}

              <section className="mt-8">
                <SectionTitle
                  icon={<Trophy className="h-4 w-4" />}
                  title="Add-ons"
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <InfoItem
                    label="Code & Portfolio Feedback"
                    value={
                      <BooleanBadge
                        value={selectedParticipant.addons?.codeFeedback}
                      />
                    }
                  />

                  <InfoItem
                    label="Physical Recognition"
                    value={
                      <BooleanBadge
                        value={selectedParticipant.addons?.physicalRecognition}
                      />
                    }
                  />

                  <InfoItem
                    label="Champion Showcase"
                    value={
                      <BooleanBadge
                        value={selectedParticipant.addons?.championShowcase}
                      />
                    }
                  />
                </div>
              </section>

              {/* DEFENSE */}

              <section className="mt-8">
                <SectionTitle
                  icon={<Clock3 className="h-4 w-4" />}
                  title="Technical Defense"
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoItem
                    label="Defense Status"
                    value={selectedParticipant.defenseStatus || "Not Scheduled"}
                  />

                  <InfoItem
                    label="Defense Slot"
                    value={
                      selectedParticipant.defenseSlot
                        ? new Date(
                            selectedParticipant.defenseSlot,
                          ).toLocaleString("en-IN")
                        : "Not scheduled"
                    }
                  />
                </div>
              </section>

              {/* FINALIST */}

              <section className="mt-8">
                <SectionTitle
                  icon={<Trophy className="h-4 w-4" />}
                  title="Finalist"
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoItem
                    label="Finalist Pass"
                    value={
                      <BooleanBadge value={selectedParticipant.finalistPass} />
                    }
                  />

                  <InfoItem
                    label="Certificate Issued"
                    value={
                      <BooleanBadge
                        value={selectedParticipant.certificateIssued}
                      />
                    }
                  />
                </div>
              </section>

              

              {/* RECORD INFORMATION */}

              <section className="mt-8">
                <SectionTitle
                  icon={<CalendarDays className="h-4 w-4" />}
                  title="Record Information"
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoItem
                    label="Registered"
                    value={formatDate(selectedParticipant.createdAt)}
                  />

                  <InfoItem
                    label="Last Updated"
                    value={formatDate(selectedParticipant.updatedAt)}
                  />
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({ icon, title }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        {icon}
      </div>

      <h3 className="text-sm font-black text-slate-900">{title}</h3>
    </div>
  );
}

/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-[9px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <div className="mt-2 break-words text-xs font-bold text-slate-700">
        {value || "—"}
      </div>
    </div>
  );
}

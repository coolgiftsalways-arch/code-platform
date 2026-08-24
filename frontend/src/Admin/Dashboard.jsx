import { useEffect, useState } from "react";

import {
  Globe,
  Upload,
  Users,
  Trophy,
  Download,
  Eye,
  CheckCircle2,
  Clock3,
  XCircle,
  Mail,
  Monitor,
  Smartphone,
  MoreHorizontal,
  Search,
} from "lucide-react";

/* =========================================================
   SAMPLE SUBMISSIONS
========================================================= */

const submissions = [
  {
    id: 1,
    name: "Aarav Sharma",
    project: "Obsidian Studio",
    email: "aarav@gmail.com",
    category: "Creative",
    status: "Approved",
    views: 18420,
    device: "Desktop",
    date: "18 Aug 2026",
  },
  {
    id: 2,
    name: "Zoya Khan",
    project: "Luma Architecture",
    email: "zoya@gmail.com",
    category: "Architecture",
    status: "Pending",
    views: 12340,
    device: "Mobile",
    date: "18 Aug 2026",
  },
  {
    id: 3,
    name: "Rohan Patel",
    project: "Mono Commerce",
    email: "rohan@gmail.com",
    category: "E-Commerce",
    status: "Approved",
    views: 9870,
    device: "Desktop",
    date: "17 Aug 2026",
  },
  {
    id: 4,
    name: "Sara Ahmed",
    project: "Forma Digital",
    email: "sara@gmail.com",
    category: "Digital",
    status: "Rejected",
    views: 5320,
    device: "Tablet",
    date: "17 Aug 2026",
  },
  {
    id: 5,
    name: "Kabir Mehta",
    project: "Northstar",
    email: "kabir@gmail.com",
    category: "Portfolio",
    status: "Approved",
    views: 22190,
    device: "Desktop",
    date: "16 Aug 2026",
  },
  {
    id: 6,
    name: "Anaya Singh",
    project: "Atelier One",
    email: "anaya@gmail.com",
    category: "Fashion",
    status: "Pending",
    views: 7650,
    device: "Mobile",
    date: "16 Aug 2026",
  },
  {
    id: 7,
    name: "Arjun Verma",
    project: "Pulse Labs",
    email: "arjun@gmail.com",
    category: "Technology",
    status: "Approved",
    views: 15670,
    device: "Desktop",
    date: "15 Aug 2026",
  },
  {
    id: 8,
    name: "Maya Kapoor",
    project: "Casa Forma",
    email: "maya@gmail.com",
    category: "Interior",
    status: "Approved",
    views: 11230,
    device: "Mobile",
    date: "15 Aug 2026",
  },
];

/* =========================================================
   WINNERS
========================================================= */

const winners = [
  {
    rank: 1,
    name: "Obsidian Studio",
    creator: "Aarav Sharma",
    category: "Creative / Digital",
    views: "48.2K",
  },
  {
    rank: 2,
    name: "Luma Architecture",
    creator: "Zoya Khan",
    category: "Architecture",
    views: "42.8K",
  },
  {
    rank: 3,
    name: "Northstar",
    creator: "Kabir Mehta",
    category: "Portfolio",
    views: "38.4K",
  },
];

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {
  if (status === "Approved") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-600">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Approved
      </span>
    );
  }

  if (status === "Pending") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-600">
        <Clock3 className="h-3.5 w-3.5" />
        Pending
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-[11px] font-bold text-red-600">
      <XCircle className="h-3.5 w-3.5" />
      Rejected
    </span>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({ title, value, change, icon: Icon }) {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {title}
          </p>

          <h3 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
            {value}
          </h3>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition group-hover:scale-110">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5">
        <span className="text-xs font-bold text-emerald-600">{change}</span>

        <span className="ml-2 text-xs font-medium text-slate-400">
          vs last month
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

export default function Dashboard() {
  const [search, setSearch] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("All");

  /* =====================================================
     BODY BACKGROUND
  ===================================================== */

  useEffect(() => {
    document.body.style.background = "#f8fafc";

    return () => {
      document.body.style.background = "";
    };
  }, []);

  /* =====================================================
     FILTER SUBMISSIONS
  ===================================================== */

  const filteredSubmissions = submissions.filter((item) => {
    const searchValue = search.toLowerCase();

    const searchMatch =
      item.name.toLowerCase().includes(searchValue) ||
      item.project.toLowerCase().includes(searchValue) ||
      item.email.toLowerCase().includes(searchValue);

    const statusMatch =
      selectedStatus === "All" || item.status === selectedStatus;

    return searchMatch && statusMatch;
  });

  /* =====================================================
     EXPORT DATA
  ===================================================== */

  const exportExcel = () => {
    const headers = [
      "ID",
      "Name",
      "Project",
      "Email",
      "Category",
      "Status",
      "Views",
      "Device",
      "Date",
    ];

    const rows = submissions.map((item) => [
      item.id,
      item.name,
      item.project,
      item.email,
      item.category,
      item.status,
      item.views,
      item.device,
      item.date,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "hubweb-dashboard-data.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-900">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="flex min-h-20 items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-indigo-600">
            HUBWEB / ADMIN
          </p>

          <h1 className="mt-1 text-xl font-black tracking-tight text-slate-900">
            Overview
          </h1>
        </div>

        <button
          type="button"
          onClick={exportExcel}
          className="flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-black text-white transition hover:bg-indigo-600"
        >
          <Download className="h-4 w-4" />

          <span className="hidden sm:inline">Export Excel</span>

          <span className="sm:hidden">Export</span>
        </button>
      </header>

      {/* =================================================
          MOBILE SEARCH
      ================================================= */}

      <div className="border-b border-slate-200 bg-white p-4 lg:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search submissions..."
            className="
              h-11
              w-full
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              pl-10
              pr-4
              text-xs
              font-medium
              outline-none
              focus:border-indigo-400
              focus:bg-white
            "
          />
        </div>
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <main className="p-5 sm:p-8">
        {/* =================================================
            HERO
        ================================================= */}

        <section className="relative mb-8 overflow-hidden rounded-[28px] bg-slate-900 p-6 text-white sm:p-8">
          <div className="relative z-10">
            <p className="mb-3 text-[9px] font-black uppercase tracking-[0.25em] text-indigo-300">
              WebHub Control Center
            </p>

            <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
              Everything your
              <br />
              platform needs.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400">
              Manage your website submissions, users, winners, traffic and
              platform performance from one clean workspace.
            </p>

            <div className="mt-6">
              <button
                type="button"
                onClick={exportExcel}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  bg-white
                  px-5
                  py-3
                  text-xs
                  font-black
                  text-slate-900
                  transition
                  hover:bg-indigo-500
                  hover:text-white
                "
              >
                <Download className="h-4 w-4" />
                Export All Data
              </button>
            </div>
          </div>

          <div className="pointer-events-none absolute -right-20 -top-40 h-[400px] w-[400px] rounded-full border border-indigo-400/20" />

          <div className="pointer-events-none absolute -right-5 -top-20 h-[280px] w-[280px] rounded-full border border-indigo-400/10" />

          <div className="pointer-events-none absolute right-10 top-10 h-20 w-20 rounded-full bg-indigo-600/20 blur-3xl" />
        </section>

        {/* =================================================
            STATS
        ================================================= */}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Users"
            value="20,482"
            change="+18.4%"
            icon={Users}
          />

          <StatCard
            title="Websites"
            value="10,842"
            change="+12.8%"
            icon={Globe}
          />

          <StatCard
            title="Submissions"
            value="7,392"
            change="+24.2%"
            icon={Upload}
          />

          <StatCard
            title="Total Views"
            value="1.84M"
            change="+31.6%"
            icon={Eye}
          />
        </section>

        {/* =================================================
            TRAFFIC + DEVICES
        ================================================= */}

        <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
          {/* TRAFFIC */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
              Performance
            </p>

            <h3 className="mt-1 text-xl font-black">Website traffic</h3>

            <div className="mt-8 flex h-56 items-end gap-2 sm:gap-4">
              {[35, 52, 42, 67, 55, 76, 63, 88, 72, 94, 82, 100].map(
                (height, index) => (
                  <div
                    key={index}
                    className="group flex h-full flex-1 items-end"
                  >
                    <div
                      style={{
                        height: `${height}%`,
                      }}
                      className="w-full rounded-t-lg bg-indigo-100 transition duration-300 group-hover:bg-indigo-600"
                    />
                  </div>
                ),
              )}
            </div>

            <div className="mt-3 flex justify-between text-[9px] font-bold text-slate-400">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>

          {/* DEVICES */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
              Visitors
            </p>

            <h3 className="mt-1 text-xl font-black">Device usage</h3>

            <div className="mt-7 space-y-5">
              {/* DESKTOP */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-indigo-600" />

                    <span className="text-xs font-bold">Desktop</span>
                  </div>

                  <span className="text-xs font-black">58%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[58%] rounded-full bg-indigo-600" />
                </div>
              </div>

              {/* MOBILE */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-indigo-600" />

                    <span className="text-xs font-bold">Mobile</span>
                  </div>

                  <span className="text-xs font-black">34%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[34%] rounded-full bg-indigo-400" />
                </div>
              </div>

              {/* TABLET */}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-indigo-600" />

                    <span className="text-xs font-bold">Tablet</span>
                  </div>

                  <span className="text-xs font-black">8%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full w-[8%] rounded-full bg-indigo-300" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            TOP WINNERS
        ================================================= */}

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-indigo-600">
            Hall of Fame
          </p>

          <h3 className="mt-1 text-2xl font-black">Top winners</h3>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {winners.map((winner) => (
              <div
                key={winner.rank}
                className="rounded-2xl border border-slate-200 p-5 transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      font-black

                      ${
                        winner.rank === 1
                          ? "bg-indigo-600 text-white"
                          : "bg-indigo-50 text-indigo-600"
                      }
                    `}
                  >
                    #{winner.rank}
                  </div>

                  <Trophy className="h-5 w-5 text-indigo-500" />
                </div>

                <h4 className="mt-6 text-xl font-black">{winner.name}</h4>

                <p className="mt-1 text-xs text-slate-400">
                  by {winner.creator}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                    {winner.category}
                  </span>

                  <span className="flex items-center gap-1 text-xs font-black">
                    <Eye className="h-3.5 w-3.5" />

                    {winner.views}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =================================================
            SUBMISSIONS
        ================================================= */}

        <section className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
                Latest activity
              </p>

              <h3 className="mt-1 text-2xl font-black">Website submissions</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {["All", "Approved", "Pending", "Rejected"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setSelectedStatus(status)}
                  className={`
                    rounded-full
                    px-3
                    py-2
                    text-[10px]
                    font-black

                    ${
                      selectedStatus === status
                        ? "bg-slate-900 text-white"
                        : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                    }
                  `}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* SEARCH */}

          <div className="hidden border-b border-slate-100 p-4 sm:block">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search submissions..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left">
                  <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400">
                    Person
                  </th>

                  <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400">
                    Project
                  </th>

                  <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400">
                    Category
                  </th>

                  <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400">
                    Views
                  </th>

                  <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400">
                    Device
                  </th>

                  <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-[9px] font-black uppercase text-slate-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredSubmissions.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 hover:bg-indigo-50/30"
                  >
                    {/* PERSON */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-black text-indigo-600">
                          {item.name.charAt(0)}
                        </div>

                        <div>
                          <p className="text-xs font-black">{item.name}</p>

                          <p className="mt-1 flex items-center gap-1 text-[9px] text-slate-400">
                            <Mail className="h-3 w-3" />

                            {item.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* PROJECT */}

                    <td className="px-6 py-5">
                      <p className="text-xs font-black">{item.project}</p>

                      <p className="mt-1 text-[9px] font-bold text-slate-400">
                        {item.date}
                      </p>
                    </td>

                    {/* CATEGORY */}

                    <td className="px-6 py-5">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[9px] font-black text-slate-600">
                        {item.category}
                      </span>
                    </td>

                    {/* VIEWS */}

                    <td className="px-6 py-5">
                      <span className="flex items-center gap-1.5 text-xs font-black">
                        <Eye className="h-3.5 w-3.5 text-indigo-500" />

                        {item.views.toLocaleString()}
                      </span>
                    </td>

                    {/* DEVICE */}

                    <td className="px-6 py-5">
                      <span className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        {item.device === "Desktop" ? (
                          <Monitor className="h-4 w-4" />
                        ) : item.device === "Mobile" ? (
                          <Smartphone className="h-4 w-4" />
                        ) : (
                          <Globe className="h-4 w-4" />
                        )}

                        {item.device}
                      </span>
                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-5">
                      <StatusBadge status={item.status} />
                    </td>

                    {/* ACTION */}

                    <td className="px-6 py-5">
                      <button
                        type="button"
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredSubmissions.length === 0 && (
              <div className="py-16 text-center">
                <Search className="mx-auto h-8 w-8 text-slate-300" />

                <p className="mt-3 text-sm font-bold text-slate-500">
                  No submissions found
                </p>
              </div>
            )}
          </div>

          {/* FOOTER */}

          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
            <p className="text-[10px] font-bold text-slate-400">
              Showing {filteredSubmissions.length} of {submissions.length}{" "}
              submissions
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

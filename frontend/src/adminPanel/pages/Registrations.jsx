import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { api } from "../../lib/api.js";
import { formatDate, formatInr } from "../../lib/format.js";
import { downloadCsv, REGISTRATION_CSV } from "../csv.js";
import { btn, inputClass, JUDGING_STATUSES, STATUSES, studentName, td, th } from "../constants.js";
import { Empty, ErrorBox, Loader, PageHeader, Pagination, PaymentBadge, StatusBadge, SuccessBox, Table } from "../ui.jsx";

const FILTER_KEYS = ["challenge", "status", "payment", "submitted", "q", "page"];


export default function Registrations() {
  const [params, setParams] = useSearchParams();
  const filters = Object.fromEntries(FILTER_KEYS.map((k) => [k, params.get(k) || ""]));

  const [challenges, setChallenges] = useState([]);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState(filters.q);
  const [selected, setSelected] = useState([]);
  const [bulkStatus, setBulkStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const query = new URLSearchParams(
    Object.entries(filters).filter(([, v]) => v),
  ).toString();

  useEffect(() => {
    api("/api/admin/challenges")
      .then((d) => setChallenges(d.challenges))
      .catch(() => {});
  }, []);

  useEffect(() => {
    api(`/api/admin/registrations?${query}`)
      .then((d) => {
        setData(d);
        setSelected([]);
      })
      .catch((err) => setError(err.message));
  }, [query, reloadKey]);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setParams(next);
  };

  const exportCsv = async () => {
    setBusy(true);
    setError("");
    try {
      const all = await api(`/api/admin/registrations?${query}&limit=5000&page=1`);
      downloadCsv(`devnex-registrations-${new Date().toISOString().slice(0, 10)}.csv`, REGISTRATION_CSV, all.registrations);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const applyBulk = async () => {
    if (!bulkStatus || !selected.length) return;
    if (!window.confirm(`Set ${selected.length} registration(s) to "${bulkStatus}"?`)) return;

    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await api("/api/admin/registrations/bulk-status", {
        method: "POST",
        body: { ids: selected, status: bulkStatus },
      });
      setNotice(
        `Updated ${result.updated}.${result.skipped ? ` Skipped ${result.skipped} that haven't paid.` : ""}`,
      );
      setBulkStatus("");
      setReloadKey((k) => k + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const rows = data?.registrations || [];
  const allSelected = rows.length > 0 && rows.every((r) => selected.includes(r.id));

  return (
    <>
      <PageHeader
        title="Registrations"
        subtitle="Every student who registered for a challenge, their payment and their project."
        actions={
          <button type="button" onClick={exportCsv} disabled={busy} className={btn.secondary}>
            ⬇ Export CSV
          </button>
        }
      />

      {/* FILTERS */}
      <div className="mb-4 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
        <form
          className="sm:col-span-2 lg:col-span-1"
          onSubmit={(e) => {
            e.preventDefault();
            setFilter("q", search.trim());
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onBlur={() => search.trim() !== filters.q && setFilter("q", search.trim())}
            placeholder="Name, email, phone, DVX-…"
            className={inputClass}
            aria-label="Search"
          />
        </form>
        <select value={filters.challenge} onChange={(e) => setFilter("challenge", e.target.value)} className={inputClass} aria-label="Challenge">
          <option value="">All challenges</option>
          {challenges.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        <select value={filters.status} onChange={(e) => setFilter("status", e.target.value)} className={inputClass} aria-label="Status">
          <option value="">Any status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select value={filters.payment} onChange={(e) => setFilter("payment", e.target.value)} className={inputClass} aria-label="Payment">
          <option value="">Any payment</option>
          <option value="joined">Paid or free</option>
          <option value="Paid">Paid</option>
          <option value="Free">Free</option>
          <option value="Pending">Not paid yet</option>
        </select>
        <select value={filters.submitted} onChange={(e) => setFilter("submitted", e.target.value)} className={inputClass} aria-label="Submission">
          <option value="">Submitted or not</option>
          <option value="yes">Project submitted</option>
          <option value="no">No project yet</option>
        </select>
      </div>

      {/* BULK ACTIONS */}
      {selected.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-indigo-200 bg-indigo-50 p-3">
          <span className="text-sm font-bold text-indigo-900">{selected.length} selected</span>
          <select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)} className={`${inputClass} w-auto`} aria-label="New status">
            <option value="">Change status to…</option>
            {JUDGING_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button type="button" onClick={applyBulk} disabled={!bulkStatus || busy} className={btn.primary}>
            Apply
          </button>
          <button type="button" onClick={() => setSelected([])} className="text-sm font-bold text-slate-500 hover:underline">
            Clear
          </button>
        </div>
      )}

      <div className="mb-4 space-y-3">
        <ErrorBox>{error}</ErrorBox>
        <SuccessBox>{notice}</SuccessBox>
      </div>

      {!data ? (
        <Loader />
      ) : rows.length === 0 ? (
        <Empty title="No registrations match">Try different filters.</Empty>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <th className={`${th} w-10`}>
                  <input
                    type="checkbox"
                    aria-label="Select all on this page"
                    className="h-4 w-4 accent-indigo-600"
                    checked={allSelected}
                    onChange={() => setSelected(allSelected ? [] : rows.map((r) => r.id))}
                  />
                </th>
                <th className={th}>Student</th>
                <th className={th}>Challenge</th>
                <th className={th}>Payment</th>
                <th className={th}>Status</th>
                <th className={th}>Project</th>
                <th className={th}>Registered</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className={selected.includes(r.id) ? "bg-indigo-50/60" : "hover:bg-slate-50"}>
                  <td className={td}>
                    <input
                      type="checkbox"
                      aria-label={`Select ${studentName(r.student)}`}
                      className="h-4 w-4 accent-indigo-600"
                      checked={selected.includes(r.id)}
                      onChange={() =>
                        setSelected((s) => (s.includes(r.id) ? s.filter((x) => x !== r.id) : [...s, r.id]))
                      }
                    />
                  </td>
                  <td className={td}>
                    <Link to={`/admin/registrations/${r.id}`} className="font-bold text-slate-900 hover:text-indigo-600">
                      {studentName(r.student)}
                    </Link>
                    <p className="text-xs text-slate-500">{r.student?.email}</p>
                    <p className="text-[11px] text-slate-400">{r.number}</p>
                  </td>
                  <td className={td}>{r.challenge?.title}</td>
                  <td className={td}>
                    <PaymentBadge status={r.paymentStatus} />
                    {r.paymentStatus === "Paid" && <p className="mt-1 text-xs text-slate-500">{formatInr(r.amount)}</p>}
                    {r.couponCode && <p className="mt-1 text-[11px] font-bold text-amber-700">Coupon {r.couponCode}</p>}
                  </td>
                  <td className={td}>
                    <StatusBadge status={r.status} />
                    {r.winnerRank && <p className="mt-1 text-xs font-bold text-yellow-700">🏆 {r.winnerRank}</p>}
                  </td>
                  <td className={td}>
                    {r.submission?.submittedAt ? (
                      <>
                        <p className="font-semibold text-slate-800">{r.submission.projectTitle}</p>
                        <div className="mt-0.5 flex gap-3 text-xs font-bold">
                          {r.submission.githubUrl && <a href={r.submission.githubUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">GitHub</a>}
                          {r.submission.liveDemoUrl && <a href={r.submission.liveDemoUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Demo</a>}
                        </div>
                      </>
                    ) : r.submission?.projectTitle ? (
                      <span className="text-xs text-slate-500">Draft: {r.submission.projectTitle}</span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className={`${td} whitespace-nowrap text-xs text-slate-500`}>{formatDate(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination page={data.page} pages={data.pages} total={data.total} onPage={(p) => setFilter("page", String(p))} />
        </>
      )}
    </>
  );
}

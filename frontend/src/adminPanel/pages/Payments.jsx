import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { api } from "../../lib/api.js";
import { formatDate, formatInr } from "../../lib/format.js";
import { downloadCsv, REGISTRATION_CSV } from "../csv.js";
import { btn, inputClass, studentName, td, th } from "../constants.js";
import { Card, Empty, ErrorBox, Loader, PageHeader, Pagination, Stat, Table } from "../ui.jsx";

export default function Payments() {
  const [params, setParams] = useSearchParams();
  const challenge = params.get("challenge") || "";
  const pageNumber = params.get("page") || "1";

  const [stats, setStats] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/admin/stats")
      .then((d) => setStats(d.stats))
      .catch((err) => setError(err.message));
  }, []);

  const query = new URLSearchParams({ payment: "Paid", page: pageNumber, ...(challenge ? { challenge } : {}) });

  useEffect(() => {
    api(`/api/admin/registrations?${query}`)
      .then(setData)
      .catch((err) => setError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge, pageNumber]);

  const exportCsv = async () => {
    try {
      const all = await api(`/api/admin/registrations?payment=Paid&limit=5000${challenge ? `&challenge=${challenge}` : ""}`);
      downloadCsv(`devnex-payments-${new Date().toISOString().slice(0, 10)}.csv`, REGISTRATION_CSV, all.registrations);
    } catch (err) {
      setError(err.message);
    }
  };

  const paidChallenges = stats?.challenges.filter((c) => c.revenue > 0) || [];

  return (
    <>
      <PageHeader
        title="Payments"
        subtitle="Entry fees received through Razorpay (and any you marked as paid by hand)."
        actions={<button type="button" onClick={exportCsv} className={btn.secondary}>⬇ Export CSV</button>}
      />

      <ErrorBox>{error}</ErrorBox>

      {stats && (
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
          <Stat label="Total revenue" value={formatInr(stats.revenue)} />
          <Stat label="Paid registrations" value={data ? data.total : "…"} sub={challenge ? "For this challenge" : "All challenges"} />
          <Stat label="Waiting for payment" value={stats.pendingPayment} sub="Started but didn't pay" />
        </div>
      )}

      {paidChallenges.length > 0 && (
        <Card title="Revenue by challenge" className="mb-6">
          <ul className="divide-y divide-slate-100 text-sm">
            {paidChallenges.map((c) => (
              <li key={c.id} className="flex items-center justify-between py-2">
                <span className="font-semibold text-slate-800">{c.title}</span>
                <span className="font-black">{formatInr(c.revenue)}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="mb-4 max-w-xs">
        <select
          value={challenge}
          onChange={(e) => setParams(e.target.value ? { challenge: e.target.value } : {})}
          className={inputClass}
          aria-label="Challenge"
        >
          <option value="">All challenges</option>
          {stats?.challenges.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>

      {!data ? (
        <Loader />
      ) : data.registrations.length === 0 ? (
        <Empty title="No payments yet" />
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <th className={th}>Paid on</th>
                <th className={th}>Student</th>
                <th className={th}>Challenge</th>
                <th className={`${th} text-right`}>Amount</th>
                <th className={th}>Payment ID</th>
              </tr>
            </thead>
            <tbody>
              {data.registrations.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className={`${td} whitespace-nowrap text-xs`}>{formatDate(r.paidAt, true)}</td>
                  <td className={td}>
                    <Link to={`/admin/registrations/${r.id}`} className="font-bold text-slate-900 hover:text-indigo-600">{studentName(r.student)}</Link>
                    <p className="text-xs text-slate-500">{r.student?.email}</p>
                  </td>
                  <td className={td}>{r.challenge?.title}</td>
                  <td className={`${td} text-right font-bold`}>{formatInr(r.amount)}</td>
                  <td className={td}>
                    <span className="break-all font-mono text-xs text-slate-600">{r.razorpayPaymentId}</span>
                    {r.manualPaymentNote && <p className="text-xs text-amber-700">Manual: {r.manualPaymentNote}</p>}
                    {r.couponCode && <p className="text-xs font-bold text-amber-700">Test coupon {r.couponCode}</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination
            page={data.page}
            pages={data.pages}
            total={data.total}
            onPage={(p) => setParams({ ...(challenge ? { challenge } : {}), page: String(p) })}
          />
        </>
      )}
    </>
  );
}

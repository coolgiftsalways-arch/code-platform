import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../../lib/api.js";
import { formatDate, formatInr, PHASE_LABEL, PHASE_STYLE } from "../../lib/format.js";
import { btn, JUDGING_STATUSES, studentName, td, th } from "../constants.js";
import { Card, ErrorBox, Loader, PageHeader, PaymentBadge, Stat, StatusBadge, Table } from "../ui.jsx";

export default function Overview() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/admin/stats")
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <ErrorBox>{error}</ErrorBox>;
  if (!data) return <Loader />;

  const { stats, config } = data;

  return (
    <>
      <PageHeader
        title="Overview"
        subtitle="Everything happening on DEVNEX right now."
        actions={
          <Link to="/admin/challenges/new" className={btn.primary}>
            + New challenge
          </Link>
        }
      />

      {config.testCoupon && (
        <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          Test coupon <strong>{config.testCoupon}</strong> is ON: anyone who knows it pays ₹1. Remove
          TEST_COUPON_CODE from the server's environment variables before going live.
        </p>
      )}

      {!config.razorpay && (
        <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          Razorpay keys are not set on the server, so students can't pay yet. Add RAZORPAY_KEY_ID and
          RAZORPAY_KEY_SECRET to your hosting environment variables.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Students" value={stats.students} sub={`+${stats.newStudents7d} in the last 7 days`} />
        <Stat label="Registrations" value={stats.joined} sub={`${stats.pendingPayment} waiting for payment`} />
        <Stat label="Projects submitted" value={stats.submitted} />
        <Stat label="Revenue" value={formatInr(stats.revenue)} sub={`Razorpay: ${config.razorpay ? config.razorpayMode + " mode" : "not set up"}`} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_320px]">
        <Card
          title="Challenges"
          actions={<Link to="/admin/challenges" className="text-sm font-bold text-indigo-600 hover:underline">Manage →</Link>}
        >
          {stats.challenges.length === 0 ? (
            <p className="text-sm text-slate-500">
              No challenges yet. <Link to="/admin/challenges/new" className="font-bold text-indigo-600">Create one</Link>.
            </p>
          ) : (
            <div className="-mx-5 overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead>
                  <tr>
                    <th className={th}>Challenge</th>
                    <th className={th}>Status</th>
                    <th className={`${th} text-right`}>Joined</th>
                    <th className={`${th} text-right`}>Unpaid</th>
                    <th className={`${th} text-right`}>Submitted</th>
                    <th className={`${th} text-right`}>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.challenges.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className={td}>
                        <Link to={`/admin/registrations?challenge=${c.id}`} className="font-bold text-slate-900 hover:text-indigo-600">
                          {c.title}
                        </Link>
                        {!c.isPublished && <span className="ml-2 text-[10px] font-bold uppercase text-slate-400">Hidden</span>}
                      </td>
                      <td className={td}>
                        <span className={`whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-bold ${PHASE_STYLE[c.phase]}`}>
                          {PHASE_LABEL[c.phase]}
                        </span>
                      </td>
                      <td className={`${td} text-right font-bold`}>{c.joined}</td>
                      <td className={`${td} text-right text-slate-500`}>{c.pendingPayment}</td>
                      <td className={`${td} text-right`}>{c.submitted}</td>
                      <td className={`${td} text-right`}>{formatInr(c.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card title="Pipeline">
          <ul className="space-y-2 text-sm">
            {JUDGING_STATUSES.map((status) => (
              <li key={status}>
                <Link
                  to={`/admin/registrations?status=${encodeURIComponent(status)}`}
                  className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-slate-50"
                >
                  <StatusBadge status={status} />
                  <span className="font-black text-slate-900">{stats.byStatus[status] || 0}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-black">Latest registrations</h2>
          <Link to="/admin/registrations" className="text-sm font-bold text-indigo-600 hover:underline">See all →</Link>
        </div>
        <Table>
          <thead>
            <tr>
              <th className={th}>Student</th>
              <th className={th}>Challenge</th>
              <th className={th}>Payment</th>
              <th className={th}>Status</th>
              <th className={th}>When</th>
            </tr>
          </thead>
          <tbody>
            {stats.recent.length === 0 && (
              <tr><td className={`${td} text-slate-500`} colSpan={5}>No registrations yet.</td></tr>
            )}
            {stats.recent.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className={td}>
                  <Link to={`/admin/registrations/${r.id}`} className="font-bold text-slate-900 hover:text-indigo-600">
                    {studentName(r.student)}
                  </Link>
                  <p className="text-xs text-slate-500">{r.student?.email}</p>
                </td>
                <td className={td}>{r.challenge?.title}</td>
                <td className={td}><PaymentBadge status={r.paymentStatus} /></td>
                <td className={td}><StatusBadge status={r.status} /></td>
                <td className={`${td} text-slate-500`}>{formatDate(r.createdAt, true)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../../lib/api.js";
import { useAuth } from "../../context/auth.js";
import { btn, inputClass, studentName } from "../constants.js";
import { Card, ErrorBox, Loader, PageHeader, SuccessBox } from "../ui.jsx";

export default function Settings() {
  const { user } = useAuth();

  const [admins, setAdmins] = useState(null);
  const [config, setConfig] = useState(null);
  const [email, setEmail] = useState("");
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadAdmins = () =>
    api("/api/admin/students?role=admin&limit=100")
      .then((d) => setAdmins(d.students))
      .catch((err) => setError(err.message));

  useEffect(() => {
    loadAdmins();
    api("/api/admin/stats")
      .then((d) => setConfig(d.config))
      .catch(() => {});
  }, []);

  const setRole = async (id, role, label) => {
    setError("");
    setNotice("");
    try {
      await api(`/api/admin/students/${id}/role`, { method: "PATCH", body: { role } });
      setNotice(label);
      await loadAdmins();
    } catch (err) {
      setError(err.message);
    }
  };

  const addAdmin = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    try {
      const found = await api(`/api/admin/students?q=${encodeURIComponent(email.trim())}&limit=5`);
      const match = found.students.find((s) => s.email === email.trim().toLowerCase());
      if (!match) {
        setError("No account with that email. Ask them to sign up on the website first.");
        return;
      }
      if (!window.confirm(`Give ${match.email} FULL admin access?`)) return;
      await setRole(match.id, "admin", `${match.email} is now an admin.`);
      setEmail("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <PageHeader title="Settings & admins" subtitle="Who can open this panel, and how the site is set up." />

      <div className="mb-4 space-y-3">
        <ErrorBox>{error}</ErrorBox>
        <SuccessBox>{notice}</SuccessBox>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Admins">
          {!admins ? (
            <Loader />
          ) : (
            <ul className="divide-y divide-slate-100">
              {admins.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <div className="min-w-0">
                    <Link to={`/admin/students/${a.id}`} className="font-bold text-slate-900 hover:text-indigo-600">{studentName(a)}</Link>
                    <p className="truncate text-xs text-slate-500">{a.email}</p>
                  </div>
                  {a.email === user.email ? (
                    <span className="text-xs font-bold text-slate-400">You</span>
                  ) : (
                    <button
                      type="button"
                      className={`${btn.small} text-rose-600`}
                      onClick={() => window.confirm(`Remove admin access from ${a.email}?`) && setRole(a.id, "student", "Admin access removed.")}
                    >
                      Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={addAdmin} className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="their@email.com" aria-label="Email of new admin" />
            <button type="submit" disabled={!email.trim()} className={btn.primary}>Add admin</button>
          </form>
          <p className="mt-2 text-xs text-slate-500">They must have signed up on the website first.</p>
        </Card>

        <Card title="Site setup">
          {!config ? (
            <Loader />
          ) : (
            <dl className="space-y-3 text-sm">
              <SetupRow
                ok={config.razorpay}
                label="Razorpay payments"
                value={config.razorpay ? `Connected (${config.razorpayMode} mode)` : "Not set up"}
                help="Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your hosting environment variables."
              />
              <SetupRow
                ok={config.email}
                label="Emails (SMTP_USER / SMTP_PASS)"
                value={config.email ? `Sending from ${config.emailFrom}` : "Not set up — no emails are sent"}
                help="Set SMTP_USER=admin@devnex.institute and SMTP_PASS=<mailbox password> in the environment variables, then restart."
              />
              {config.email && (
                <button
                  type="button"
                  disabled={testing}
                  className={btn.secondary}
                  onClick={async () => {
                    setTesting(true);
                    setError("");
                    setNotice("");
                    try {
                      const r = await api("/api/admin/test-email", { method: "POST", body: {} });
                      setNotice(r.message);
                    } catch (err) {
                      setError(err.message);
                    } finally {
                      setTesting(false);
                    }
                  }}
                >
                  {testing ? "Sending…" : `Send a test email to ${user.email}`}
                </button>
              )}
              <SetupRow
                ok={!config.testCoupon}
                label="Test coupon (TEST_COUPON_CODE)"
                value={config.testCoupon ? `ON: ${config.testCoupon} makes any payment ₹1` : "Off"}
                help="Remove TEST_COUPON_CODE from the environment variables and restart before going live."
              />
              <SetupRow
                ok={Boolean(config.publicUrl)}
                label="Website address (PUBLIC_URL)"
                value={config.publicUrl || "Not set — using the address of each request"}
                help="Set PUBLIC_URL to https://devnex.institute so Razorpay always sends students back to the right place."
              />
            </dl>
          )}
          <p className="mt-4 text-xs text-slate-500">
            These are set on the server (Hostinger → environment variables), not here, so the secret keys never reach the browser.
          </p>
        </Card>
      </div>
    </>
  );
}

function SetupRow({ ok, label, value, help }) {
  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <dt className="flex items-center gap-2 font-bold text-slate-900">
        <span className={`h-2 w-2 rounded-full ${ok ? "bg-emerald-500" : "bg-amber-500"}`} />
        {label}
      </dt>
      <dd className="mt-1 text-slate-600">{value}</dd>
      {!ok && <dd className="mt-1 text-xs text-amber-700">{help}</dd>}
    </div>
  );
}

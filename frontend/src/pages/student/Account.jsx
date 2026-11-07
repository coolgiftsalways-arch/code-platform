import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { KeyRound, Mail, UserRound } from "lucide-react";

import { api } from "../../lib/api.js";
import { useAuth } from "../../context/auth.js";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/10";
const primary =
  "w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60";

function Field({ label, hint, children }) {
  return (
    <label className="block text-left">
      <span className="mb-1.5 block text-xs font-bold text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function Message({ error, success }) {
  if (error) {
    return <p className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm font-semibold text-rose-700" role="alert">{error}</p>;
  }
  if (success) {
    return <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm font-semibold text-emerald-800" role="status">{success}</p>;
  }
  return null;
}

function Shell({ icon: Icon, eyebrow, title, text, children, wide = false }) {
  return (
    <section className="relative px-4 pb-20 pt-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] opacity-20 [background-size:42px_42px]" />
      <div className={`relative mx-auto w-full ${wide ? "max-w-2xl" : "max-w-md"} rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8`}>
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          <Icon className="h-5 w-5" />
        </span>
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">{eyebrow}</p>
        <h1 className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl">{title}</h1>
        {text && <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>}
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}

/* =========================================================
   PROFILE  /profile
========================================================= */

export function Profile() {
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phone: user.phone || "",
    institute: user.institute || "",
    city: user.city || "",
    className: user.className || "",
    github: user.github || "",
    linkedin: user.linkedin || "",
  });
  const [status, setStatus] = useState({});
  const [busy, setBusy] = useState(false);

  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [pwStatus, setPwStatus] = useState({});
  const [pwBusy, setPwBusy] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    setStatus({});
    try {
      const data = await api("/api/auth/me", { method: "PUT", body: form });
      setUser(data.user);
      setStatus({ success: "Profile saved." });
    } catch (err) {
      setStatus({ error: err.message });
    } finally {
      setBusy(false);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setPwBusy(true);
    setPwStatus({});
    try {
      await api("/api/auth/password", { method: "PUT", body: passwords });
      setPasswords({ currentPassword: "", newPassword: "" });
      setPwStatus({ success: "Password changed." });
    } catch (err) {
      setPwStatus({ error: err.message });
    } finally {
      setPwBusy(false);
    }
  };

  return (
    <Shell icon={UserRound} eyebrow="My account" title="Profile" text={user.email} wide>
      <form onSubmit={save} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name"><input value={form.firstName} onChange={set("firstName")} className={inputClass} autoComplete="given-name" /></Field>
          <Field label="Last name"><input value={form.lastName} onChange={set("lastName")} className={inputClass} autoComplete="family-name" /></Field>
          <Field label="Mobile number"><input value={form.phone} onChange={set("phone")} className={inputClass} inputMode="numeric" autoComplete="tel" /></Field>
          <Field label="City"><input value={form.city} onChange={set("city")} className={inputClass} /></Field>
          <Field label="School / college"><input value={form.institute} onChange={set("institute")} className={inputClass} /></Field>
          <Field label="Class / year"><input value={form.className} onChange={set("className")} className={inputClass} placeholder="e.g. 2nd year B.Tech" /></Field>
          <Field label="GitHub profile" hint="Shown on your public projects."><input value={form.github} onChange={set("github")} className={inputClass} placeholder="https://github.com/you" /></Field>
          <Field label="LinkedIn profile"><input value={form.linkedin} onChange={set("linkedin")} className={inputClass} placeholder="https://linkedin.com/in/you" /></Field>
        </div>
        <Message {...status} />
        <button type="submit" disabled={busy} className={primary}>{busy ? "Saving…" : "Save profile"}</button>
      </form>

      <hr className="my-8 border-slate-100" />

      <h2 className="text-lg font-black text-slate-950">Change password</h2>
      <form onSubmit={changePassword} className="mt-4 space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Current password">
            <input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords((p) => ({ ...p, currentPassword: e.target.value }))} className={inputClass} autoComplete="current-password" />
          </Field>
          <Field label="New password" hint="At least 8 characters.">
            <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))} className={inputClass} autoComplete="new-password" />
          </Field>
        </div>
        <Message {...pwStatus} />
        <button type="submit" disabled={pwBusy} className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60">
          {pwBusy ? "Changing…" : "Change password"}
        </button>
      </form>
    </Shell>
  );
}

/* =========================================================
   FORGOT PASSWORD  /forgot-password
========================================================= */

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({});
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setStatus({});
    try {
      const data = await api("/api/auth/forgot-password", { method: "POST", body: { email } });
      setStatus({ success: data.message });
    } catch (err) {
      setStatus({ error: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell icon={Mail} eyebrow="Account help" title="Forgot your password?" text="Enter your email and we'll send you a link to choose a new one.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Email">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} autoComplete="email" placeholder="you@example.com" />
        </Field>
        <Message {...status} />
        <button type="submit" disabled={busy || !email.trim()} className={primary}>{busy ? "Sending…" : "Send reset link"}</button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-500">
        Remembered it? <Link to="/login" className="font-bold text-indigo-600 hover:underline">Log in</Link>
      </p>
    </Shell>
  );
}

/* =========================================================
   RESET PASSWORD  /reset-password?token=...
========================================================= */

export function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { acceptLogin } = useAuth();

  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({});
  const [busy, setBusy] = useState(false);
  const token = params.get("token") || "";

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setStatus({});
    try {
      const data = await api("/api/auth/reset-password", { method: "POST", body: { token, password } });
      acceptLogin(data.token, data.user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setStatus({ error: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Shell icon={KeyRound} eyebrow="Account help" title="Choose a new password">
      {!token ? (
        <p className="text-sm text-slate-600">
          This link is incomplete. <Link to="/forgot-password" className="font-bold text-indigo-600">Ask for a new one</Link>.
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          <Field label="New password" hint="At least 8 characters.">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} autoComplete="new-password" />
          </Field>
          <Message {...status} />
          <button type="submit" disabled={busy || password.length < 8} className={primary}>{busy ? "Saving…" : "Save new password"}</button>
          {status.error && (
            <p className="text-center text-sm"><Link to="/forgot-password" className="font-bold text-indigo-600 hover:underline">Send a new link</Link></p>
          )}
        </form>
      )}
    </Shell>
  );
}

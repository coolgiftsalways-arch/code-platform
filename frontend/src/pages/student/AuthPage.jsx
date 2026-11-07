import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../../context/auth.js";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/10";

// Only allow going back to a page on this site.
function safeNext(value, fallback) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}

function Field({ label, children }) {
  return (
    <label className="block text-left">
      <span className="mb-1.5 block text-xs font-bold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

// mode = "login" | "signup"
export default function AuthPage({ mode }) {
  const isSignup = mode === "signup";

  const { user, login, signup } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // After signup students pick a challenge; after login they go to their dashboard.
  const next = safeNext(params.get("next"), isSignup ? "/challenges" : "/dashboard");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    institute: "",
    city: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={next} replace />;

  const update = (event) => {
    setError("");
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      if (isSignup) await signup(form);
      else await login(form.email, form.password);

      navigate(next, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const switchLink = `${isSignup ? "/login" : "/signup"}${
    params.get("next") ? `?next=${encodeURIComponent(params.get("next"))}` : ""
  }`;

  return (
    <section className="relative px-4 pb-20 pt-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] opacity-20 [background-size:42px_42px]" />

      <div className="relative mx-auto w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
          DEVNEX {isSignup ? "Sign up" : "Log in"}
        </p>

        <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">
          {isSignup ? "Create your student account" : "Welcome back"}
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {isSignup
            ? "One account for every DEVNEX challenge. Next you'll pick the challenge you want to join."
            : "Log in to see your challenges, payments and submissions."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          {isSignup && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name">
                <input name="firstName" value={form.firstName} onChange={update} className={inputClass} autoComplete="given-name" required />
              </Field>
              <Field label="Last name">
                <input name="lastName" value={form.lastName} onChange={update} className={inputClass} autoComplete="family-name" required />
              </Field>
            </div>
          )}

          <Field label="Email">
            <input type="email" name="email" value={form.email} onChange={update} className={inputClass} autoComplete="email" placeholder="you@example.com" required />
          </Field>

          {isSignup && (
            <>
              <Field label="Mobile number">
                <input type="tel" name="phone" value={form.phone} onChange={update} className={inputClass} autoComplete="tel" inputMode="numeric" placeholder="10-digit mobile" required />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="School / college">
                  <input name="institute" value={form.institute} onChange={update} className={inputClass} placeholder="Institute name" />
                </Field>
                <Field label="City">
                  <input name="city" value={form.city} onChange={update} className={inputClass} autoComplete="address-level2" />
                </Field>
              </div>
            </>
          )}

          <Field label="Password">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={update}
              className={inputClass}
              autoComplete={isSignup ? "new-password" : "current-password"}
              placeholder={isSignup ? "At least 8 characters" : ""}
              required
            />
          </Field>

          {error && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm font-semibold text-rose-700" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {busy ? "Please wait…" : isSignup ? "Create account" : "Log in"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          {isSignup ? "Already have an account? " : "New to DEVNEX? "}
          <Link to={switchLink} className="font-bold text-indigo-600 hover:underline">
            {isSignup ? "Log in" : "Create an account"}
          </Link>
        </p>
      </div>
    </section>
  );
}

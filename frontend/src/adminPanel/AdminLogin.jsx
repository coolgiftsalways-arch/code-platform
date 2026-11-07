import { useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../context/auth.js";
import { btn, inputClass } from "./constants.js";
import { ErrorBox, Field } from "./ui.jsx";

const safeNext = (value) =>
  value && value.startsWith("/admin") && !value.startsWith("//") ? value : "/admin";

export default function AdminLogin() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get("next"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user?.role === "admin") return <Navigate to={next} replace />;

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const loggedIn = await login(email, password);

      if (loggedIn.role !== "admin") {
        logout();
        setError("This account doesn't have admin access.");
        return;
      }

      navigate(next, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-7 shadow-2xl" noValidate>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">DEVNEX</p>
        <h1 className="mt-1 text-2xl font-black text-slate-950">Admin login</h1>

        {user && user.role !== "admin" && (
          <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
            You're logged in as {user.email}, which isn't an admin account.
          </p>
        )}

        <div className="mt-6 space-y-4">
          <Field label="Email">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} autoComplete="email" required />
          </Field>
          <Field label="Password">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} autoComplete="current-password" required />
          </Field>

          <ErrorBox>{error}</ErrorBox>

          <button type="submit" disabled={busy} className={`${btn.primary} w-full py-3`}>
            {busy ? "Logging in…" : "Log in"}
          </button>
        </div>
      </form>
    </div>
  );
}

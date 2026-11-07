import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { api } from "../../lib/api.js";
import { formatDate, formatInr, timeLeft } from "../../lib/format.js";
import { PageLoader } from "../../components/RequireAuth.jsx";
import EntryFeePayment from "../../components/EntryFeePayment.jsx";
import { STATUS_STYLE, STEPS } from "./registrationStatus.js";

const AI_TOOLS = ["None", "ChatGPT", "Claude", "Cursor", "Copilot", "Other"];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/10 disabled:opacity-70";

export default function RegistrationPage() {
  const { id } = useParams();
  const [params, setParams] = useSearchParams();

  const [registration, setRegistration] = useState(null);
  const [error, setError] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [notice, setNotice] = useState("");

  const load = useCallback(
    () =>
      api(`/api/registrations/${id}`)
        .then((data) => {
          setRegistration(data.registration);
          return data.registration;
        })
        .catch((err) => setError(err.message)),
    [id],
  );

  // First load + handle the return from Razorpay (?payment=success|failed)
  useEffect(() => {
    const result = params.get("payment");
    const welcome = params.get("welcome");

    (async () => {
      let reg = await load();

      // Back from Razorpay but the redirect hasn't been recorded yet: ask once.
      if (reg && result && reg.paymentStatus === "Pending") {
        const status = await api(`/api/registrations/${id}/payment-status`).catch(() => null);
        if (status?.paymentStatus === "Paid") reg = await load();
      }

      if (!reg) return;

      if (reg.paymentStatus !== "Pending" && (result === "success" || welcome)) {
        setNotice("You're registered! Your submission section is ready below.");
      } else if (reg.paymentStatus === "Pending" && result) {
        setNotice("");
        setShowPayment(true);
      }

      if (result || welcome) setParams({}, { replace: true });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (error) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="text-sm font-semibold text-rose-600">{error}</p>
        <Link to="/dashboard" className="mt-4 inline-block text-sm font-bold text-indigo-600 hover:underline">
          ← My dashboard
        </Link>
      </div>
    );
  }

  if (!registration) return <PageLoader />;

  const { challenge, status, paymentStatus } = registration;
  const pending = paymentStatus === "Pending";

  return (
    <section className="px-4 pb-20 pt-6">
      {showPayment && (
        <EntryFeePayment
          payment={{ amount: registration.amount, paymentUrl: registration.paymentUrl }}
          eyebrow={`${challenge.title} registration`}
          statusUrl={`/api/registrations/${id}/payment-status`}
          linkUrl={`/api/registrations/${id}/payment-link`}
          onPaid={async () => {
            setShowPayment(false);
            await load();
            setNotice("You're registered! Your submission section is ready below.");
          }}
          onClose={() => setShowPayment(false)}
        />
      )}

      <div className="mx-auto max-w-5xl">
        <Link to="/dashboard" className="text-sm font-bold text-slate-500 hover:text-indigo-600">
          ← My dashboard
        </Link>

        {/* HEADER */}
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
              {challenge.category} · {registration.number}
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">{challenge.title}</h1>
            <Link
              to={`/challenges/${challenge.slug}`}
              className="mt-1 inline-block text-sm font-semibold text-indigo-600 hover:underline"
            >
              View challenge details & rules
            </Link>
          </div>

          <span className={`rounded-full border px-3 py-1.5 text-xs font-bold ${STATUS_STYLE[status]}`}>
            {status}
          </span>
        </div>

        {notice && (
          <p className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800" role="status">
            {notice}
          </p>
        )}

        {/* PAYMENT PENDING */}
        {pending && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-amber-200 bg-amber-50 p-5">
            <div>
              <p className="text-sm font-black text-amber-900">Payment pending</p>
              <p className="mt-0.5 text-sm text-amber-800">
                Pay {formatInr(registration.amount)} to confirm your spot. Registration closes{" "}
                {formatDate(challenge.registrationDeadline, true)}.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPayment(true)}
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              Complete payment
            </button>
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-6">
            {!pending && <Tracker registration={registration} />}

            <SubmissionSection
              registration={registration}
              onSaved={(updated, message) => {
                setRegistration(updated);
                setNotice(message);
              }}
            />
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 text-sm shadow-sm">
              <h2 className="text-sm font-black text-slate-950">Key dates</h2>
              <dl className="mt-3 space-y-2.5">
                <DateRow label="Registration closes" date={challenge.registrationDeadline} />
                <DateRow label="Submission deadline" date={challenge.submissionDeadline} />
                {challenge.resultsAt && <DateRow label="Results" date={challenge.resultsAt} />}
              </dl>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-5 text-sm shadow-sm">
              <h2 className="text-sm font-black text-slate-950">Payment</h2>
              <p className="mt-2 text-slate-600">
                {paymentStatus === "Paid"
                  ? `${formatInr(registration.amount)} paid on ${formatDate(registration.paidAt)}`
                  : paymentStatus === "Free"
                    ? "Free challenge"
                    : `${formatInr(registration.amount)} pending`}
              </p>
            </div>

            {registration.defenseSlot && (
              <div className="rounded-[24px] border border-purple-200 bg-purple-50 p-5 text-sm">
                <h2 className="text-sm font-black text-purple-900">Technical defense</h2>
                <p className="mt-2 font-semibold text-purple-800">
                  {formatDate(registration.defenseSlot, true)}
                </p>
                <p className="mt-1 text-purple-700">Be ready to explain your code and answer questions.</p>
              </div>
            )}

            {registration.adminNote && (
              <div className="rounded-[24px] border border-slate-200 bg-white p-5 text-sm shadow-sm">
                <h2 className="text-sm font-black text-slate-950">Message from DEVNEX</h2>
                <p className="mt-2 whitespace-pre-line text-slate-600">{registration.adminNote}</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

function DateRow({ label, date }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-bold text-slate-900">{formatDate(date)}</dd>
    </div>
  );
}

/* =========================================================
   STATUS TRACKER
========================================================= */

function Tracker({ registration }) {
  const { status } = registration;

  if (status === "Not Selected") {
    return (
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-black text-slate-950">Your progress</h2>
        <p className="mt-2 text-sm text-slate-600">
          Your project wasn't selected for the next round this time. Thank you for building with DEVNEX!
        </p>
      </div>
    );
  }

  const current = STEPS.indexOf(status);

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-black text-slate-950">Your progress</h2>

      <ol className="mt-5 grid gap-3 sm:grid-cols-7 sm:gap-1">
        {STEPS.map((step, index) => {
          const done = index < current;
          const active = index === current;

          return (
            <li key={step} className="flex items-center gap-3 sm:flex-col sm:gap-2 sm:text-center">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                  done
                    ? "bg-indigo-600 text-white"
                    : active
                      ? "bg-indigo-600 text-white ring-4 ring-indigo-100"
                      : "bg-slate-100 text-slate-400"
                }`}
              >
                {done ? "✓" : index + 1}
              </span>
              <span
                className={`text-xs font-bold leading-4 ${
                  active ? "text-indigo-700" : done ? "text-slate-700" : "text-slate-400"
                }`}
              >
                {step}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* =========================================================
   SUBMISSION
========================================================= */

function SubmissionSection({ registration, onSaved }) {
  const { challenge, paymentStatus, canSubmit } = registration;
  const saved = registration.submission || {};

  const [form, setForm] = useState({
    projectTitle: saved.projectTitle || "",
    description: saved.description || "",
    techStack: (saved.techStack || []).join(", "),
    githubUrl: saved.githubUrl || "",
    liveDemoUrl: saved.liveDemoUrl || "",
    videoUrl: saved.videoUrl || "",
    aiTool: saved.aiTool || "",
  });
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const update = (event) => {
    setError("");
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const save = async (final) => {
    setBusy(final ? "submit" : "draft");
    setError("");

    try {
      const data = await api(`/api/registrations/${registration.id}/submission`, {
        method: "PUT",
        body: { ...form, final },
      });
      onSaved(
        data.registration,
        final
          ? `Project submitted! You can edit it until ${formatDate(challenge.submissionDeadline, true)}.`
          : "Draft saved.",
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy("");
    }
  };

  // Locked until payment is done.
  if (paymentStatus === "Pending") {
    return (
      <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-6 text-center">
        <h2 className="text-lg font-black text-slate-950">Project submission</h2>
        <p className="mt-2 text-sm text-slate-500">
          This section unlocks once your registration payment is complete.
        </p>
      </div>
    );
  }

  // Deadline passed: read-only.
  if (!canSubmit) {
    return (
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-black text-slate-950">Your submission</h2>
        {saved.submittedAt ? (
          <div className="mt-4 space-y-3 text-sm">
            <p className="text-base font-black text-slate-900">{saved.projectTitle}</p>
            <p className="whitespace-pre-line leading-6 text-slate-600">{saved.description}</p>
            {saved.techStack?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {saved.techStack.map((tech) => (
                  <span key={tech} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                    {tech}
                  </span>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-4 font-bold">
              {saved.githubUrl && <a href={saved.githubUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">GitHub ↗</a>}
              {saved.liveDemoUrl && <a href={saved.liveDemoUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Live demo ↗</a>}
              {saved.videoUrl && <a href={saved.videoUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Video ↗</a>}
            </div>
            <p className="text-xs text-slate-400">Submitted {formatDate(saved.submittedAt, true)}</p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-500">
            The submission deadline ({formatDate(challenge.submissionDeadline, true)}) has passed and no
            project was submitted.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-black text-slate-950">Project submission</h2>
          <p className="mt-1 text-sm text-slate-500">
            Due {formatDate(challenge.submissionDeadline, true)} · {timeLeft(challenge.submissionDeadline)}.
            You can save a draft and come back.
          </p>
        </div>
        {saved.submittedAt && (
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            ✓ Submitted {formatDate(saved.submittedAt)}
          </span>
        )}
      </div>

      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          save(true);
        }}
        noValidate
      >
        <Field label="Project title">
          <input name="projectTitle" value={form.projectTitle} onChange={update} className={inputClass} maxLength={120} placeholder="What's it called?" />
        </Field>

        <Field label="Description" hint="What problem does it solve, how does it work, what did you learn? (at least 50 characters)">
          <textarea name="description" value={form.description} onChange={update} className={`${inputClass} min-h-[140px] resize-y`} maxLength={3000} />
        </Field>

        <Field label="Tech stack" hint="Separate with commas, e.g. React, Node.js, MongoDB">
          <input name="techStack" value={form.techStack} onChange={update} className={inputClass} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="GitHub repository (public)">
            <input type="url" name="githubUrl" value={form.githubUrl} onChange={update} className={inputClass} placeholder="https://github.com/you/project" />
          </Field>
          <Field label="Live demo">
            <input type="url" name="liveDemoUrl" value={form.liveDemoUrl} onChange={update} className={inputClass} placeholder="https://" />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Demo video (optional)">
            <input type="url" name="videoUrl" value={form.videoUrl} onChange={update} className={inputClass} placeholder="YouTube / Drive link" />
          </Field>
          <Field label="AI tool used">
            <select name="aiTool" value={form.aiTool} onChange={update} className={inputClass}>
              <option value="">Select…</option>
              {AI_TOOLS.map((tool) => (
                <option key={tool} value={tool}>
                  {tool}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {error && (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm font-semibold text-rose-700" role="alert">
            {error}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => save(false)}
            disabled={Boolean(busy)}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-300 disabled:opacity-60"
          >
            {busy === "draft" ? "Saving…" : "Save draft"}
          </button>
          <button
            type="submit"
            disabled={Boolean(busy)}
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {busy === "submit" ? "Submitting…" : saved.submittedAt ? "Update submission" : "Submit project"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

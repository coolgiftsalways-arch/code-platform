import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { api } from "../../lib/api.js";
import { formatDate, formatInr } from "../../lib/format.js";
import { btn, inputClass, JUDGING_STATUSES, studentName } from "../constants.js";
import { Card, ErrorBox, Field, Loader, PageHeader, PaymentBadge, StatusBadge, SuccessBox } from "../ui.jsx";

function toLocalInput(value) {
  if (!value) return "";
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

const formFrom = (r) => ({
  status: r.status,
  defenseSlot: toLocalInput(r.defenseSlot),
  winnerRank: r.winnerRank || "",
  adminNote: r.adminNote || "",
});

export default function RegistrationDetail() {
  const { id } = useParams();

  const [registration, setRegistration] = useState(null);
  const [form, setForm] = useState(null);
  const [paidNote, setPaidNote] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api(`/api/admin/registrations/${id}`)
      .then((data) => {
        setRegistration(data.registration);
        setForm(formFrom(data.registration));
      })
      .catch((err) => setError(err.message));
  }, [id]);

  if (!registration) return error ? <ErrorBox>{error}</ErrorBox> : <Loader />;

  const unpaid = registration.paymentStatus === "Pending";
  const { student, submission, challenge } = registration;

  const run = async (request, message) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const data = await request();
      setRegistration(data.registration);
      setForm(formFrom(data.registration));
      setNotice(message);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const save = (event) => {
    event.preventDefault();
    run(
      () =>
        api(`/api/admin/registrations/${id}`, {
          method: "PATCH",
          body: {
            // Only send the status when it was changed, so setting a defense
            // slot can move the student to "Defense Scheduled" by itself.
            ...(!unpaid && form.status !== registration.status ? { status: form.status } : {}),
            defenseSlot: form.defenseSlot ? new Date(form.defenseSlot).toISOString() : null,
            winnerRank: form.winnerRank,
            adminNote: form.adminNote,
          },
        }),
      "Saved. The student sees this on their dashboard.",
    );
  };

  const markPaid = () => {
    if (!window.confirm("Mark this registration as paid? Only do this if you received the money.")) return;
    run(
      () => api(`/api/admin/registrations/${id}/mark-paid`, { method: "POST", body: { note: paidNote } }),
      "Marked as paid. The student can now submit their project.",
    );
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <>
      <Link to="/admin/registrations" className="text-sm font-bold text-slate-500 hover:text-indigo-600">← Registrations</Link>

      <PageHeader
        title={studentName(student)}
        subtitle={`${registration.number} · ${challenge?.title} · registered ${formatDate(registration.createdAt, true)}`}
        actions={
          <>
            <PaymentBadge status={registration.paymentStatus} />
            <StatusBadge status={registration.status} />
          </>
        }
      />

      <div className="mb-4 space-y-3">
        <ErrorBox>{error}</ErrorBox>
        <SuccessBox>{notice}</SuccessBox>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {/* PROJECT */}
          <Card title="Project submission">
            {!submission?.projectTitle ? (
              <p className="text-sm text-slate-500">Nothing submitted yet.</p>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-lg font-black text-slate-950">{submission.projectTitle}</p>
                  {submission.submittedAt ? (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                      Submitted {formatDate(submission.submittedAt, true)}
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">Draft</span>
                  )}
                </div>
                <p className="whitespace-pre-line leading-6 text-slate-700">{submission.description}</p>
                {submission.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {submission.techStack.map((t) => (
                      <span key={t} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">{t}</span>
                    ))}
                  </div>
                )}
                <dl className="grid gap-2 sm:grid-cols-2">
                  <LinkRow label="GitHub" url={submission.githubUrl} />
                  <LinkRow label="Live demo" url={submission.liveDemoUrl} />
                  <LinkRow label="Video" url={submission.videoUrl} />
                  <div>
                    <dt className="text-xs font-bold text-slate-400">AI tool used</dt>
                    <dd className="font-semibold text-slate-800">{submission.aiTool || "—"}</dd>
                  </div>
                </dl>
              </div>
            )}
          </Card>

          {/* JUDGING */}
          <Card title="Judging">
            <form onSubmit={save} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Status" hint={unpaid ? "Mark the payment as received first." : "The student sees this on their tracker."}>
                  <select value={form.status} onChange={set("status")} className={inputClass} disabled={unpaid}>
                    {unpaid && <option value="Pending Payment">Pending Payment</option>}
                    {JUDGING_STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Technical defense slot" hint="Shown on the student's dashboard.">
                  <input type="datetime-local" value={form.defenseSlot} onChange={set("defenseSlot")} className={inputClass} />
                </Field>
                <Field label="Winner rank" hint="e.g. 1st Place, Best UI. Leave empty if not a winner.">
                  <input value={form.winnerRank} onChange={set("winnerRank")} className={inputClass} maxLength={60} />
                </Field>
              </div>
              <Field label="Message to the student" hint="Shown on their dashboard as “Message from DEVNEX”.">
                <textarea value={form.adminNote} onChange={set("adminNote")} className={`${inputClass} min-h-[90px]`} maxLength={2000} />
              </Field>
              <div className="flex justify-end">
                <button type="submit" disabled={busy} className={btn.primary}>{busy ? "Saving…" : "Save"}</button>
              </div>
            </form>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card title="Student">
            <dl className="space-y-2 text-sm">
              <Row label="Email" value={<a href={`mailto:${student?.email}`} className="text-indigo-600 hover:underline">{student?.email}</a>} />
              <Row label="Phone" value={student?.phone ? <a href={`tel:${student.phone}`} className="text-indigo-600 hover:underline">{student.phone}</a> : "—"} />
              <Row label="Institute" value={student?.institute || "—"} />
              <Row label="City" value={student?.city || "—"} />
            </dl>
            <Link to={`/admin/students/${student?.id}`} className="mt-4 inline-block text-sm font-bold text-indigo-600 hover:underline">
              All their registrations →
            </Link>
          </Card>

          <Card title="Payment">
            <dl className="space-y-2 text-sm">
              <Row label="Status" value={<PaymentBadge status={registration.paymentStatus} />} />
              <Row label="Amount" value={registration.amount ? formatInr(registration.amount) : "Free"} />
              {registration.paidAt && <Row label="Paid on" value={formatDate(registration.paidAt, true)} />}
              {registration.razorpayPaymentId && <Row label="Razorpay ID" value={<span className="break-all font-mono text-xs">{registration.razorpayPaymentId}</span>} />}
              {registration.manualPaymentNote && <Row label="Note" value={registration.manualPaymentNote} />}
              {registration.couponCode && <Row label="Coupon" value={<span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-bold text-amber-800">{registration.couponCode}</span>} />}
            </dl>

            {unpaid && (
              <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-500">Got the money another way (bank transfer, cash)?</p>
                <input value={paidNote} onChange={(e) => setPaidNote(e.target.value)} className={inputClass} placeholder="e.g. UPI ref 4321, 7 Nov" maxLength={300} />
                <button type="button" onClick={markPaid} disabled={busy || !paidNote.trim()} className={`${btn.secondary} w-full`}>
                  Mark as paid
                </button>
              </div>
            )}
          </Card>
        </aside>
      </div>
    </>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="shrink-0 text-slate-500">{label}</dt>
      <dd className="text-right font-semibold text-slate-800">{value}</dd>
    </div>
  );
}

function LinkRow({ label, url }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-bold text-slate-400">{label}</dt>
      <dd className="truncate">
        {url ? (
          <a href={url} target="_blank" rel="noreferrer" className="font-semibold text-indigo-600 hover:underline">{url}</a>
        ) : (
          "—"
        )}
      </dd>
    </div>
  );
}

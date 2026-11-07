import { useEffect, useState } from "react";

import { api } from "../../lib/api.js";
import { formatDate } from "../../lib/format.js";
import { btn, inputClass } from "../constants.js";
import { Card, Empty, ErrorBox, Field, Loader, PageHeader, SuccessBox } from "../ui.jsx";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [form, setForm] = useState({ title: "", body: "", challenge: "", sendEmail: false });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () =>
    api("/api/admin/announcements")
      .then((d) => setAnnouncements(d.announcements))
      .catch((err) => setError(err.message));

  useEffect(() => {
    load();
    api("/api/admin/challenges")
      .then((d) => setChallenges(d.challenges))
      .catch(() => {});
  }, []);

  const post = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const result = await api("/api/admin/announcements", { method: "POST", body: form });
      setForm({ title: "", body: "", challenge: "", sendEmail: false });
      setNotice(
        `Posted. Students will see it on their dashboard${
          result.emailing ? ` and ${result.emailing} email${result.emailing === 1 ? " is" : "s are"} being sent` : ""
        }.`,
      );
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (announcement) => {
    if (!window.confirm(`Delete "${announcement.title}"?`)) return;
    try {
      await api(`/api/admin/announcements/${announcement.id}`, { method: "DELETE" });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <PageHeader title="Announcements" subtitle="Post updates that appear on students' dashboards." />

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <Card title="New announcement">
          <form onSubmit={post} className="space-y-4">
            <Field label="Who sees it">
              <select value={form.challenge} onChange={(e) => setForm((f) => ({ ...f, challenge: e.target.value }))} className={inputClass}>
                <option value="">Every student</option>
                {challenges.map((c) => (
                  <option key={c.id} value={c.id}>Registered for: {c.title}</option>
                ))}
              </select>
            </Field>
            <Field label="Title">
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className={inputClass} maxLength={150} />
            </Field>
            <Field label="Message">
              <textarea value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} className={`${inputClass} min-h-[140px]`} maxLength={5000} />
            </Field>
            <label className="flex items-start gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={form.sendEmail}
                onChange={(e) => setForm((f) => ({ ...f, sendEmail: e.target.checked }))}
                className="mt-0.5 h-4 w-4 accent-indigo-600"
              />
              <span>
                <span className="block font-bold text-slate-900">Also send it by email</span>
                <span className="text-xs text-slate-500">From your DEVNEX mailbox, to everyone who will see it.</span>
              </span>
            </label>
            <ErrorBox>{error}</ErrorBox>
            <SuccessBox>{notice}</SuccessBox>
            <button type="submit" disabled={busy || !form.title.trim() || !form.body.trim()} className={`${btn.primary} w-full`}>
              {busy ? "Posting…" : "Post announcement"}
            </button>
          </form>
        </Card>

        <div>
          {!announcements ? (
            <Loader />
          ) : announcements.length === 0 ? (
            <Empty title="No announcements yet" />
          ) : (
            <div className="space-y-3">
              {announcements.map((a) => (
                <article key={a.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                        {a.challenge ? a.challenge.title : "All students"}
                      </p>
                      <h3 className="mt-0.5 font-black text-slate-950">{a.title}</h3>
                    </div>
                    <button type="button" onClick={() => remove(a)} className={`${btn.small} text-rose-600`}>Delete</button>
                  </div>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{a.body}</p>
                  <p className="mt-3 text-xs text-slate-400">
                    {formatDate(a.createdAt, true)}
                    {a.author ? ` · ${a.author}` : ""}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

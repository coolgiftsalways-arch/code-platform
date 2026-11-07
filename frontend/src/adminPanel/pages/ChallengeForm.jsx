import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { api } from "../../lib/api.js";
import { formatInr } from "../../lib/format.js";
import { btn, CATEGORIES, inputClass } from "../constants.js";
import { Card, ErrorBox, Field, Loader, PageHeader, SuccessBox } from "../ui.jsx";

// ISO date -> value for <input type="datetime-local"> in the admin's own timezone.
function toLocalInput(value) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

const fromLocalInput = (value) => (value ? new Date(value).toISOString() : null);

const EMPTY = {
  title: "",
  slug: "",
  category: "Open",
  tagline: "",
  description: "",
  host: "DEVNEX",
  coverImage: "",
  fee: 999,
  prizePool: 0,
  startAt: "",
  registrationDeadline: "",
  submissionDeadline: "",
  resultsAt: "",
  prizes: [{ place: "1st Place", reward: "" }],
  rules: "",
  tags: "",
  eligibility: "",
  isFeatured: false,
  isPublished: false,
};

function toForm(challenge) {
  return {
    ...EMPTY,
    ...challenge,
    startAt: toLocalInput(challenge.startAt),
    registrationDeadline: toLocalInput(challenge.registrationDeadline),
    submissionDeadline: toLocalInput(challenge.submissionDeadline),
    resultsAt: toLocalInput(challenge.resultsAt),
    prizes: challenge.prizes?.length ? challenge.prizes : EMPTY.prizes,
    rules: (challenge.rules || []).join("\n"),
    tags: (challenge.tags || []).join(", "),
  };
}

function toPayload(form) {
  return {
    ...form,
    fee: Number(form.fee || 0),
    prizePool: Number(form.prizePool || 0),
    startAt: fromLocalInput(form.startAt),
    registrationDeadline: fromLocalInput(form.registrationDeadline),
    submissionDeadline: fromLocalInput(form.submissionDeadline),
    resultsAt: fromLocalInput(form.resultsAt),
    prizes: form.prizes.filter((p) => p.place.trim() && p.reward.trim()),
    rules: form.rules.split("\n").map((r) => r.trim()).filter(Boolean),
    tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
  };
}

export default function ChallengeForm() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();

  const [form, setForm] = useState(isNew ? EMPTY : null);
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isNew) return;
    api(`/api/admin/challenges/${id}`)
      .then((data) => {
        setForm(toForm(data.challenge));
        setMeta(data.challenge);
      })
      .catch((err) => setError(err.message));
  }, [id, isNew]);

  if (!form) return error ? <ErrorBox>{error}</ErrorBox> : <Loader />;

  const set = (field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const setPrize = (index, field, value) =>
    setForm((previous) => ({
      ...previous,
      prizes: previous.prizes.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    }));

  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");

    try {
      const data = await api(isNew ? "/api/admin/challenges" : `/api/admin/challenges/${id}`, {
        method: isNew ? "POST" : "PUT",
        body: toPayload(form),
      });

      if (isNew) {
        navigate(`/admin/challenges/${data.challenge.id}`, { replace: true });
      } else {
        setForm(toForm(data.challenge));
        setMeta(data.challenge);
        setNotice("Saved. Changes are live on the website.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const locked = meta?.registrations > 0;

  return (
    <form onSubmit={save} noValidate>
      <Link to="/admin/challenges" className="text-sm font-bold text-slate-500 hover:text-indigo-600">← Challenges</Link>

      <PageHeader
        title={isNew ? "New challenge" : form.title || "Edit challenge"}
        subtitle={
          isNew
            ? "Fill this in, tick Published when you're ready, and it appears on /challenges."
            : `${meta?.joined || 0} joined · ${meta?.submitted || 0} submitted · ${formatInr(meta?.revenue || 0)} revenue`
        }
        actions={
          <>
            {!isNew && (
              <a href={`/challenges/${form.slug}`} target="_blank" rel="noreferrer" className={btn.secondary}>
                View on site
              </a>
            )}
            <button type="submit" disabled={busy} className={btn.primary}>
              {busy ? "Saving…" : isNew ? "Create challenge" : "Save changes"}
            </button>
          </>
        }
      />

      <div className="mb-4 space-y-3">
        <ErrorBox>{error}</ErrorBox>
        <SuccessBox>{notice}</SuccessBox>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <Card title="Basics">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title" className="sm:col-span-2">
                <input value={form.title} onChange={set("title")} className={inputClass} maxLength={120} required />
              </Field>
              <Field
                label="URL slug"
                hint={locked ? "Locked because students have registered." : "Leave empty to make one from the title."}
              >
                <input value={form.slug} onChange={set("slug")} className={inputClass} disabled={locked} placeholder="ai-ml-s01" />
              </Field>
              <Field label="Category">
                <select value={form.category} onChange={set("category")} className={inputClass}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c === "Open" ? "Any track" : c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Tagline" hint="One line shown on the card." className="sm:col-span-2">
                <input value={form.tagline} onChange={set("tagline")} className={inputClass} maxLength={200} />
              </Field>
              <Field label="Description" className="sm:col-span-2">
                <textarea value={form.description} onChange={set("description")} className={`${inputClass} min-h-[140px]`} maxLength={5000} />
              </Field>
              <Field label="Host" hint="Shown with a flag on the card.">
                <input value={form.host} onChange={set("host")} className={inputClass} maxLength={80} />
              </Field>
              <Field label="Cover image URL (optional)" hint="Leave empty for the coloured initials.">
                <input value={form.coverImage} onChange={set("coverImage")} className={inputClass} placeholder="https://…" />
              </Field>
            </div>
          </Card>

          <Card title="Dates">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Registration opens" hint="Before this it shows as Upcoming. Optional.">
                <input type="datetime-local" value={form.startAt} onChange={set("startAt")} className={inputClass} />
              </Field>
              <Field label="Registration closes">
                <input type="datetime-local" value={form.registrationDeadline} onChange={set("registrationDeadline")} className={inputClass} required />
              </Field>
              <Field label="Submission deadline">
                <input type="datetime-local" value={form.submissionDeadline} onChange={set("submissionDeadline")} className={inputClass} required />
              </Field>
              <Field label="Results announced (optional)">
                <input type="datetime-local" value={form.resultsAt} onChange={set("resultsAt")} className={inputClass} />
              </Field>
            </div>
          </Card>

          <Card
            title="Prizes"
            actions={
              <button
                type="button"
                className={btn.small}
                onClick={() => setForm((p) => ({ ...p, prizes: [...p.prizes, { place: "", reward: "" }] }))}
              >
                + Add prize
              </button>
            }
          >
            <div className="space-y-3">
              {form.prizes.map((prize, index) => (
                <div key={index} className="grid gap-2 sm:grid-cols-[180px_1fr_auto]">
                  <input value={prize.place} onChange={(e) => setPrize(index, "place", e.target.value)} className={inputClass} placeholder="1st Place" />
                  <input value={prize.reward} onChange={(e) => setPrize(index, "reward", e.target.value)} className={inputClass} placeholder="₹25,000 + trophy" />
                  <button
                    type="button"
                    className={btn.small}
                    onClick={() => setForm((p) => ({ ...p, prizes: p.prizes.filter((_, i) => i !== index) }))}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Rules & eligibility">
            <div className="space-y-4">
              <Field label="Rules" hint="One rule per line.">
                <textarea value={form.rules} onChange={set("rules")} className={`${inputClass} min-h-[140px]`} />
              </Field>
              <Field label="Who can join">
                <textarea value={form.eligibility} onChange={set("eligibility")} className={`${inputClass} min-h-[70px]`} maxLength={1000} />
              </Field>
            </div>
          </Card>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <Card title="Visibility">
            <div className="space-y-3 text-sm">
              <label className="flex items-start gap-3">
                <input type="checkbox" checked={form.isPublished} onChange={set("isPublished")} className="mt-0.5 h-4 w-4 accent-indigo-600" />
                <span>
                  <span className="block font-bold text-slate-900">Published</span>
                  <span className="text-xs text-slate-500">Show it on the website.</span>
                </span>
              </label>
              <label className="flex items-start gap-3">
                <input type="checkbox" checked={form.isFeatured} onChange={set("isFeatured")} className="mt-0.5 h-4 w-4 accent-indigo-600" />
                <span>
                  <span className="block font-bold text-slate-900">Featured</span>
                  <span className="text-xs text-slate-500">Pin it to the top of the list.</span>
                </span>
              </label>
            </div>
          </Card>

          <Card title="Money">
            <div className="space-y-4">
              <Field label="Entry fee (₹)" hint="0 = free. Changing it only affects new registrations.">
                <input type="number" min="0" step="1" value={form.fee} onChange={set("fee")} className={inputClass} />
              </Field>
              <Field label="Total prize pool (₹)" hint="Shown as “₹X in prizes” and used for sorting.">
                <input type="number" min="0" step="1" value={form.prizePool} onChange={set("prizePool")} className={inputClass} />
              </Field>
            </div>
          </Card>

          <Card title="Tags">
            <Field label="Interest tags" hint="Comma separated, e.g. Web, Beginner Friendly">
              <input value={form.tags} onChange={set("tags")} className={inputClass} />
            </Field>
          </Card>
        </aside>
      </div>
    </form>
  );
}

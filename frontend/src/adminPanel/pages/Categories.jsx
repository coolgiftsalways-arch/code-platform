import { useEffect, useState } from "react";

import { api } from "../../lib/api.js";
import { categoryColor } from "../../lib/categoryTheme.js";
import CategoryIcon from "../../components/CategoryIcon.jsx";
import { btn, inputClass } from "../constants.js";
import { Card, Empty, ErrorBox, Field, Loader, PageHeader, SuccessBox } from "../ui.jsx";

const EMPTY = {
  name: "",
  title: "",
  slug: "",
  eyebrow: "",
  description: "",
  stack: "",
  examples: "",
  icon: "code",
  color: "indigo",
  order: 0,
  isActive: true,
};

const toForm = (c) => ({
  ...EMPTY,
  ...c,
  stack: (c.stack || []).join(", "),
  examples: (c.examples || []).join("\n"),
});

const toPayload = (f) => ({
  ...f,
  order: Number(f.order) || 0,
  stack: f.stack.split(",").map((s) => s.trim()).filter(Boolean),
  examples: f.examples.split("\n").map((s) => s.trim()).filter(Boolean),
});

export default function AdminCategories() {
  const [data, setData] = useState(null);
  const [editing, setEditing] = useState(null); // form object, id = existing
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () =>
    api("/api/admin/categories")
      .then(setData)
      .catch((err) => setError(err.message));

  useEffect(() => {
    load();
  }, []);

  const save = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const isNew = !editing.id;
      await api(isNew ? "/api/admin/categories" : `/api/admin/categories/${editing.id}`, {
        method: isNew ? "POST" : "PUT",
        body: toPayload(editing),
      });
      setNotice(isNew ? `Added "${editing.name}".` : `Saved "${editing.name}". It's live on /categories.`);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (category) => {
    if (!window.confirm(`Delete the "${category.name}" category?`)) return;
    setError("");
    setNotice("");
    try {
      await api(`/api/admin/categories/${category.id}`, { method: "DELETE" });
      setNotice(`Deleted "${category.name}".`);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const set = (field) => (e) =>
    setEditing((f) => ({ ...f, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  return (
    <>
      <PageHeader
        title="Categories"
        subtitle="The tracks shown on /categories. Challenges belong to one of these (or “Any track”)."
        actions={
          <button type="button" className={btn.primary} onClick={() => setEditing({ ...EMPTY, order: (data?.categories.length || 0) + 1 })}>
            + New category
          </button>
        }
      />

      <div className="mb-4 space-y-3">
        <ErrorBox>{error}</ErrorBox>
        <SuccessBox>{notice}</SuccessBox>
      </div>

      {editing && data && (
        <Card title={editing.id ? `Edit “${editing.name}”` : "New category"} className="mb-6">
          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Short name" hint="Shown on challenge cards, e.g. “Web Dev”. Renaming updates its challenges.">
                <input value={editing.name} onChange={set("name")} className={inputClass} maxLength={40} />
              </Field>
              <Field label="Full title" hint="e.g. “Web & Full-Stack Development”">
                <input value={editing.title} onChange={set("title")} className={inputClass} maxLength={120} />
              </Field>
              <Field label="Small label above the title" hint="e.g. WEB SYSTEMS">
                <input value={editing.eyebrow} onChange={set("eyebrow")} className={inputClass} maxLength={60} />
              </Field>
              <Field label="URL slug" hint="Used for /categories#slug. Leave empty to generate.">
                <input value={editing.slug} onChange={set("slug")} className={inputClass} />
              </Field>
              <Field label="Description" className="sm:col-span-2">
                <textarea value={editing.description} onChange={set("description")} className={`${inputClass} min-h-[90px]`} maxLength={1000} />
              </Field>
              <Field label="Technologies" hint="Comma separated">
                <input value={editing.stack} onChange={set("stack")} className={inputClass} />
              </Field>
              <Field label="Example projects" hint="One per line">
                <textarea value={editing.examples} onChange={set("examples")} className={`${inputClass} min-h-[90px]`} />
              </Field>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-bold text-slate-700">Icon</p>
              <div className="flex flex-wrap gap-2">
                {data.icons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setEditing((f) => ({ ...f, icon }))}
                    aria-label={icon}
                    aria-pressed={editing.icon === icon}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${editing.icon === icon ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                  >
                    <CategoryIcon name={icon} className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-bold text-slate-700">Colour</p>
              <div className="flex flex-wrap gap-2">
                {data.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setEditing((f) => ({ ...f, color }))}
                    aria-label={color}
                    aria-pressed={editing.color === color}
                    className={`h-9 w-9 rounded-full bg-gradient-to-br ${categoryColor(color).gradient} ${editing.color === color ? "ring-4 ring-indigo-200 ring-offset-2" : ""}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              <Field label="Order" className="w-28">
                <input type="number" value={editing.order} onChange={set("order")} className={inputClass} />
              </Field>
              <label className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input type="checkbox" checked={editing.isActive} onChange={set("isActive")} className="h-4 w-4 accent-indigo-600" />
                Show on the website
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <button type="button" className={btn.secondary} onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" disabled={busy || !editing.name.trim()} className={btn.primary}>{busy ? "Saving…" : "Save category"}</button>
            </div>
          </form>
        </Card>
      )}

      {!data ? (
        <Loader />
      ) : data.categories.length === 0 ? (
        <Empty title="No categories yet" />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {data.categories.map((c) => (
            <div key={c.id} className={`flex items-start gap-4 rounded-2xl border bg-white p-4 shadow-sm ${c.isActive ? "border-slate-200" : "border-dashed border-slate-300 opacity-70"}`}>
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white ${categoryColor(c.color).gradient}`}>
                <CategoryIcon name={c.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-black text-slate-950">
                  {c.name}
                  {!c.isActive && <span className="ml-2 text-[10px] font-bold uppercase text-slate-400">Hidden</span>}
                </p>
                <p className="truncate text-xs text-slate-500">{c.title}</p>
                <p className="mt-1 text-xs text-slate-500">{c.challenges} challenge{c.challenges === 1 ? "" : "s"} · order {c.order}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-1.5">
                <button type="button" className={btn.small} onClick={() => setEditing(toForm(c))}>Edit</button>
                {c.challenges === 0 && (
                  <button type="button" className={`${btn.small} text-rose-600`} onClick={() => remove(c)}>Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

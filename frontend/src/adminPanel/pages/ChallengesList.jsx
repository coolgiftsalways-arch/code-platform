import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { api } from "../../lib/api.js";
import { formatDate, formatInr, PHASE_LABEL, PHASE_STYLE } from "../../lib/format.js";
import { btn, td, th } from "../constants.js";
import { Empty, ErrorBox, Loader, PageHeader, SuccessBox, Table } from "../ui.jsx";

export default function ChallengesList() {
  const [challenges, setChallenges] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState("");

  const load = () =>
    api("/api/admin/challenges")
      .then((data) => setChallenges(data.challenges))
      .catch((err) => setError(err.message));

  useEffect(() => {
    load();
  }, []);

  // Quick publish / feature toggles: send the whole challenge back with one field changed.
  const toggle = async (challenge, field) => {
    const value = !challenge[field];
    const flip = (v) =>
      setChallenges((list) => list.map((c) => (c.id === challenge.id ? { ...c, [field]: v } : c)));

    setBusyId(challenge.id + field);
    setError("");
    setNotice("");
    flip(value); // show the change straight away

    try {
      await api(`/api/admin/challenges/${challenge.id}`, {
        method: "PUT",
        body: { ...challenge, [field]: value },
      });
    } catch (err) {
      flip(!value); // put it back if saving failed
      setError(err.message);
    } finally {
      setBusyId("");
    }
  };

  const remove = async (challenge) => {
    if (!window.confirm(`Delete "${challenge.title}"? This can't be undone.`)) return;
    setError("");
    try {
      await api(`/api/admin/challenges/${challenge.id}`, { method: "DELETE" });
      setNotice(`Deleted "${challenge.title}".`);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <PageHeader
        title="Challenges"
        subtitle="Create challenges, change dates and prizes, and choose what's visible on the website."
        actions={<Link to="/admin/challenges/new" className={btn.primary}>+ New challenge</Link>}
      />

      <div className="mb-4 space-y-3">
        <ErrorBox>{error}</ErrorBox>
        <SuccessBox>{notice}</SuccessBox>
      </div>

      {!challenges ? (
        <Loader />
      ) : challenges.length === 0 ? (
        <Empty title="No challenges yet">
          <Link to="/admin/challenges/new" className="font-bold text-indigo-600">Create your first challenge</Link>
        </Empty>
      ) : (
        <Table>
          <thead>
            <tr>
              <th className={th}>Challenge</th>
              <th className={th}>Status</th>
              <th className={th}>Dates</th>
              <th className={`${th} text-right`}>Fee</th>
              <th className={`${th} text-right`}>Joined</th>
              <th className={th}>On website</th>
              <th className={th}></th>
            </tr>
          </thead>
          <tbody>
            {challenges.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className={td}>
                  <Link to={`/admin/challenges/${c.id}`} className="font-bold text-slate-900 hover:text-indigo-600">
                    {c.title}
                  </Link>
                  <p className="text-xs text-slate-500">/challenges/{c.slug}</p>
                </td>
                <td className={td}>
                  <span className={`whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-bold ${PHASE_STYLE[c.phase]}`}>
                    {PHASE_LABEL[c.phase]}
                  </span>
                </td>
                <td className={`${td} whitespace-nowrap text-xs text-slate-600`}>
                  Reg. closes {formatDate(c.registrationDeadline)}
                  <br />
                  Submit by {formatDate(c.submissionDeadline)}
                </td>
                <td className={`${td} text-right`}>{c.fee ? formatInr(c.fee) : "Free"}</td>
                <td className={`${td} text-right`}>
                  <Link to={`/admin/registrations?challenge=${c.id}`} className="font-bold text-indigo-600 hover:underline">
                    {c.joined}
                  </Link>
                </td>
                <td className={td}>
                  <div className="flex flex-col gap-1.5">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-indigo-600"
                        checked={c.isPublished}
                        disabled={busyId === c.id + "isPublished"}
                        onChange={() => toggle(c, "isPublished")}
                      />
                      Published
                    </label>
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-indigo-600"
                        checked={c.isFeatured}
                        disabled={busyId === c.id + "isFeatured"}
                        onChange={() => toggle(c, "isFeatured")}
                      />
                      Featured
                    </label>
                  </div>
                </td>
                <td className={`${td} whitespace-nowrap text-right`}>
                  <Link to={`/admin/challenges/${c.id}`} className={btn.small}>Edit</Link>{" "}
                  <a href={`/challenges/${c.slug}`} target="_blank" rel="noreferrer" className={btn.small}>View</a>{" "}
                  {c.registrations === 0 && (
                    <button type="button" onClick={() => remove(c)} className={`${btn.small} text-rose-600`}>
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
}

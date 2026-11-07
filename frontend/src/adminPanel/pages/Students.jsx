import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { api } from "../../lib/api.js";
import { formatDate, formatInr } from "../../lib/format.js";
import { downloadCsv } from "../csv.js";
import { btn, inputClass, studentName, td, th } from "../constants.js";
import { Card, Empty, ErrorBox, Loader, PageHeader, Pagination, PaymentBadge, StatusBadge, SuccessBox, Table } from "../ui.jsx";

const STUDENT_CSV = [
  { label: "First name", value: (s) => s.firstName },
  { label: "Last name", value: (s) => s.lastName },
  { label: "Email", value: (s) => s.email },
  { label: "Phone", value: (s) => s.phone },
  { label: "Institute", value: (s) => s.institute },
  { label: "City", value: (s) => s.city },
  { label: "Challenges joined", value: (s) => s.joined },
  { label: "Paid (₹)", value: (s) => s.spent },
  { label: "Role", value: (s) => s.role },
  { label: "Signed up", value: (s) => new Date(s.createdAt).toISOString() },
];

/* =========================================================
   LIST
========================================================= */

export function StudentsList() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const pageNumber = params.get("page") || "1";

  const [search, setSearch] = useState(q);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const query = new URLSearchParams({ page: pageNumber, ...(q ? { q } : {}) });
    api(`/api/admin/students?${query}`)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [q, pageNumber]);

  const exportCsv = async () => {
    try {
      const all = await api(`/api/admin/students?limit=5000${q ? `&q=${encodeURIComponent(q)}` : ""}`);
      downloadCsv(`devnex-students-${new Date().toISOString().slice(0, 10)}.csv`, STUDENT_CSV, all.students);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <PageHeader
        title="Students"
        subtitle="Everyone with a DEVNEX account."
        actions={<button type="button" onClick={exportCsv} className={btn.secondary}>⬇ Export CSV</button>}
      />

      <form
        className="mb-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setParams(search.trim() ? { q: search.trim() } : {});
        }}
      >
        <input value={search} onChange={(e) => setSearch(e.target.value)} className={inputClass} placeholder="Search name, email, phone, institute, city" aria-label="Search students" />
        <button type="submit" className={btn.primary}>Search</button>
      </form>

      <ErrorBox>{error}</ErrorBox>

      {!data ? (
        <Loader />
      ) : data.students.length === 0 ? (
        <Empty title="No students found" />
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <th className={th}>Name</th>
                <th className={th}>Contact</th>
                <th className={th}>Institute</th>
                <th className={`${th} text-right`}>Joined</th>
                <th className={`${th} text-right`}>Paid</th>
                <th className={th}>Signed up</th>
              </tr>
            </thead>
            <tbody>
              {data.students.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className={td}>
                    <Link to={`/admin/students/${s.id}`} className="font-bold text-slate-900 hover:text-indigo-600">{studentName(s)}</Link>
                    {s.role === "admin" && <span className="ml-2 rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold text-white">ADMIN</span>}
                  </td>
                  <td className={td}>
                    <p>{s.email}</p>
                    <p className="text-xs text-slate-500">{s.phone}</p>
                  </td>
                  <td className={td}>
                    <p>{s.institute || "—"}</p>
                    <p className="text-xs text-slate-500">{s.city}</p>
                  </td>
                  <td className={`${td} text-right font-bold`}>{s.joined}</td>
                  <td className={`${td} text-right`}>{formatInr(s.spent)}</td>
                  <td className={`${td} whitespace-nowrap text-xs text-slate-500`}>{formatDate(s.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination
            page={data.page}
            pages={data.pages}
            total={data.total}
            onPage={(p) => setParams({ ...(q ? { q } : {}), page: String(p) })}
          />
        </>
      )}
    </>
  );
}

/* =========================================================
   ONE STUDENT
========================================================= */

export function StudentDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    api(`/api/admin/students/${id}`)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [id]);

  if (!data) return error ? <ErrorBox>{error}</ErrorBox> : <Loader />;

  const { student, registrations } = data;
  const isAdmin = student.role === "admin";

  const changeRole = async () => {
    const role = isAdmin ? "student" : "admin";
    const question = isAdmin
      ? `Remove admin access from ${student.email}?`
      : `Give ${student.email} FULL admin access? They will be able to change everything.`;
    if (!window.confirm(question)) return;

    setError("");
    try {
      const result = await api(`/api/admin/students/${id}/role`, { method: "PATCH", body: { role } });
      setData((d) => ({ ...d, student: result.student }));
      setNotice(role === "admin" ? "They are now an admin." : "Admin access removed.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Link to="/admin/students" className="text-sm font-bold text-slate-500 hover:text-indigo-600">← Students</Link>

      <PageHeader
        title={studentName(student)}
        subtitle={`Signed up ${formatDate(student.createdAt, true)}`}
        actions={
          <button type="button" onClick={changeRole} className={isAdmin ? btn.danger : btn.secondary}>
            {isAdmin ? "Remove admin access" : "Make admin"}
          </button>
        }
      />

      <div className="mb-4 space-y-3">
        <ErrorBox>{error}</ErrorBox>
        <SuccessBox>{notice}</SuccessBox>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <Card title="Details">
          <dl className="space-y-2 text-sm">
            {[
              ["Email", student.email],
              ["Phone", student.phone],
              ["Institute", student.institute],
              ["City", student.city],
              ["Role", isAdmin ? "Admin" : "Student"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-3">
                <dt className="text-slate-500">{label}</dt>
                <dd className="break-all text-right font-semibold text-slate-800">{value || "—"}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <div>
          <h2 className="mb-3 text-base font-black">Registrations ({registrations.length})</h2>
          {registrations.length === 0 ? (
            <Empty title="Hasn't registered for a challenge yet" />
          ) : (
            <div className="space-y-3">
              {registrations.map((r) => (
                <Link
                  key={r.id}
                  to={`/admin/registrations/${r.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-indigo-200"
                >
                  <div>
                    <p className="font-bold text-slate-900">{r.challenge?.title}</p>
                    <p className="text-xs text-slate-500">
                      {r.number} · {r.submission?.projectTitle || "No project yet"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <PaymentBadge status={r.paymentStatus} />
                    <StatusBadge status={r.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

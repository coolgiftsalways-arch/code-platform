import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { BadgeCheck, Printer, Search, XCircle } from "lucide-react";

import { api } from "../../lib/api.js";
import { formatDate } from "../../lib/format.js";
import { useAuth } from "../../context/auth.js";
import { PageLoader } from "../../components/RequireAuth.jsx";

const ACHIEVEMENT_LINE = {
  winner: "for winning",
  finalist: "for being a finalist in",
  participant: "for successfully participating in",
};

/* =========================================================
   CERTIFICATE  /certificate/:id   (the student's own)
   Print it, or "Save as PDF" from the print dialog.
========================================================= */

export function CertificatePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [registration, setRegistration] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/api/registrations/${id}`)
      .then((d) => setRegistration(d.registration))
      .catch((err) => setError(err.message));
  }, [id]);

  if (error) return <p className="px-4 py-20 text-center text-sm font-semibold text-rose-600">{error}</p>;
  if (!registration) return <PageLoader />;

  const cert = registration.certificate;

  if (!cert) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="text-base font-black text-slate-900">Your certificate isn't ready yet</p>
        <p className="mt-1 text-sm text-slate-500">Certificates are available after results are announced, for students who submitted a project.</p>
        <Link to={`/dashboard/registrations/${id}`} className="mt-4 inline-block text-sm font-bold text-indigo-600 hover:underline">← Back</Link>
      </div>
    );
  }

  const verifyUrl = `${window.location.origin}/verify/${cert.number}`;
  const name = `${user.firstName} ${user.lastName}`.trim();
  const winner = cert.kind === "winner";

  return (
    <div className="min-h-screen bg-slate-200 px-3 py-6 print:bg-white print:p-0">
      <style>{`@page { size: A4 landscape; margin: 0; } @media print { .no-print { display: none !important; } }`}</style>

      <div className="no-print mx-auto mb-4 flex max-w-[1000px] flex-wrap items-center justify-between gap-3">
        <Link to={`/dashboard/registrations/${id}`} className="text-sm font-bold text-slate-600 hover:text-indigo-600">← Back to dashboard</Link>
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700">
          <Printer className="h-4 w-4" /> Download / Print
        </button>
      </div>

      {/* Scrolls sideways on small phones instead of squashing the certificate */}
      <div className="overflow-x-auto print:overflow-visible">
        <article className="relative mx-auto aspect-[1.414/1] w-[1000px] overflow-hidden bg-white shadow-2xl print:h-[210mm] print:w-[297mm] print:shadow-none">
          <div className={`absolute inset-0 bg-gradient-to-br ${winner ? "from-amber-50 via-white to-yellow-50" : "from-indigo-50 via-white to-violet-50"}`} />
          <div className={`absolute inset-5 rounded-[18px] border-2 ${winner ? "border-amber-300" : "border-indigo-200"}`} />
          <div className={`absolute inset-7 rounded-[14px] border ${winner ? "border-amber-200" : "border-indigo-100"}`} />

          <div className="relative flex h-full flex-col items-center justify-center px-24 text-center">
            <p className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-900">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm text-white">{"</>"}</span>
              DEVNEX
            </p>
            <p className={`mt-8 text-sm font-black uppercase tracking-[0.35em] ${winner ? "text-amber-700" : "text-indigo-600"}`}>
              Certificate of {winner ? "Achievement" : cert.kind === "finalist" ? "Excellence" : "Participation"}
            </p>
            <p className="mt-6 text-sm text-slate-500">This is to certify that</p>
            <p className="mt-2 font-serif text-5xl font-bold text-slate-950">{name}</p>
            {user.institute && <p className="mt-2 text-sm text-slate-500">{user.institute}</p>}
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-700">
              has been awarded{" "}
              {winner ? <strong className="text-amber-700">{cert.achievement}</strong> : null}
              {winner ? " " : ""}
              {ACHIEVEMENT_LINE[cert.kind]} <strong>{registration.challenge.title}</strong> with the project{" "}
              <strong>“{registration.submission?.projectTitle}”</strong>.
            </p>

            <div className="mt-12 flex w-full items-end justify-between text-left">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Issued</p>
                <p className="text-sm font-black text-slate-800">{formatDate(cert.issuedAt)}</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-400">Certificate no.</p>
                <p className="font-mono text-sm font-black text-slate-800">{cert.number}</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-2xl italic text-slate-800">DEVNEX</p>
                <div className="mt-1 w-48 border-t border-slate-400 pt-1 text-xs font-bold uppercase tracking-wider text-slate-500">Organising team</div>
              </div>
              <div className="flex flex-col items-center">
                <QRCodeSVG value={verifyUrl} size={78} level="M" />
                <p className="mt-1 text-[10px] text-slate-500">Scan to verify</p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

/* =========================================================
   VERIFY  /verify  and  /verify/:number   (public)
========================================================= */

export function VerifyPage() {
  const { number } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState(number || "");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(Boolean(number));

  useEffect(() => {
    if (!number) return;
    api(`/api/certificates/${encodeURIComponent(number)}`)
      .then((d) => setResult({ ok: true, certificate: d.certificate }))
      .catch(() => setResult({ ok: false }))
      .finally(() => setLoading(false));
  }, [number]);

  return (
    <section className="px-4 pb-20 pt-10">
      <div className="mx-auto max-w-lg">
        <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">DEVNEX</p>
        <h1 className="mt-1 text-center text-3xl font-black tracking-tight text-slate-950">Verify a certificate</h1>
        <p className="mt-2 text-center text-sm text-slate-500">Enter the certificate number, e.g. DVX-2EBEF1.</p>

        <form
          className="mt-6 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim() && input.trim().toUpperCase() !== String(number || "").toUpperCase()) {
              setLoading(true);
              setResult(null);
              navigate(`/verify/${encodeURIComponent(input.trim().toUpperCase())}`);
            }
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="DVX-XXXXXX"
            aria-label="Certificate number"
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-sm font-bold uppercase outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10"
          />
          <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white hover:bg-indigo-700">
            <Search className="h-4 w-4" /> Check
          </button>
        </form>

        {loading && <PageLoader />}

        {result?.ok && (
          <div className="mt-6 rounded-[24px] border border-emerald-200 bg-white p-6 shadow-sm">
            <p className="flex items-center gap-2 font-black text-emerald-700">
              <BadgeCheck className="h-5 w-5" /> Valid DEVNEX certificate
            </p>
            <dl className="mt-4 space-y-2 text-sm">
              {[
                ["Awarded to", result.certificate.name],
                ["Institute", result.certificate.institute || "—"],
                ["Challenge", result.certificate.challenge],
                ["Achievement", result.certificate.achievement],
                ["Project", result.certificate.projectTitle],
                ["Issued", formatDate(result.certificate.issuedAt)],
                ["Number", result.certificate.number],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="text-right font-bold text-slate-900">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {result && !result.ok && (
          <div className="mt-6 flex items-center gap-2 rounded-[24px] border border-rose-200 bg-rose-50 p-5 text-sm font-bold text-rose-700">
            <XCircle className="h-5 w-5" /> No valid certificate with that number.
          </div>
        )}
      </div>
    </section>
  );
}

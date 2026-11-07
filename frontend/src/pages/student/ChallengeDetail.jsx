import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { api } from "../../lib/api.js";
import { formatDate, formatInr, PHASE_LABEL, PHASE_STYLE, timeLeft } from "../../lib/format.js";
import { useAuth } from "../../context/auth.js";
import { PageLoader } from "../../components/RequireAuth.jsx";
import EntryFeePayment from "../../components/EntryFeePayment.jsx";

export default function ChallengeDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [challenge, setChallenge] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [registerError, setRegisterError] = useState("");

  // { registrationId, amount, paymentUrl } while the payment screen is open
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    api(`/api/challenges/${encodeURIComponent(slug)}`)
      .then((data) => setChallenge(data.challenge))
      .catch((err) => setError(err.message));
  }, [slug, authLoading, user]);

  const goToRegistration = (id, query = "") =>
    navigate(`/dashboard/registrations/${id}${query}`);

  const register = async () => {
    setBusy(true);
    setRegisterError("");

    try {
      const data = await api(`/api/challenges/${encodeURIComponent(slug)}/register`, {
        method: "POST",
      });

      if (data.paymentStatus === "Pending") {
        setPayment({
          registrationId: data.registrationId,
          amount: data.amount,
          paymentUrl: data.paymentUrl,
        });
      } else {
        goToRegistration(data.registrationId, "?welcome=1");
      }
    } catch (err) {
      setRegisterError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (error) {
    return (
      <div className="px-4 py-20 text-center">
        <p className="text-sm font-semibold text-rose-600">{error}</p>
        <Link to="/challenges" className="mt-4 inline-block text-sm font-bold text-indigo-600 hover:underline">
          ← All challenges
        </Link>
      </div>
    );
  }

  if (!challenge) return <PageLoader />;

  const mine = challenge.myRegistration;
  const joined = mine && mine.paymentStatus !== "Pending";
  const isOpen = challenge.phase === "open";
  const feeLabel = challenge.fee ? formatInr(challenge.fee) : "Free";

  let action;

  if (joined) {
    action = (
      <Link
        to={`/dashboard/registrations/${mine.id}`}
        className="block w-full rounded-xl bg-emerald-600 py-3.5 text-center text-sm font-bold text-white transition hover:bg-emerald-700"
      >
        ✓ Registered — open my dashboard
      </Link>
    );
  } else if (!isOpen) {
    action = (
      <p className="rounded-xl bg-slate-100 py-3.5 text-center text-sm font-bold text-slate-500">
        Registration closed
      </p>
    );
  } else if (!user) {
    const next = encodeURIComponent(`/challenges/${challenge.slug}`);
    action = (
      <>
        <Link
          to={`/signup?next=${next}`}
          className="block w-full rounded-xl bg-indigo-600 py-3.5 text-center text-sm font-bold text-white transition hover:bg-indigo-700"
        >
          Sign up to register
        </Link>
        <p className="mt-3 text-center text-xs text-slate-500">
          Have an account?{" "}
          <Link to={`/login?next=${next}`} className="font-bold text-indigo-600 hover:underline">
            Log in
          </Link>
        </p>
      </>
    );
  } else {
    action = (
      <button
        type="button"
        onClick={register}
        disabled={busy}
        className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60"
      >
        {busy
          ? "Please wait…"
          : mine
            ? `Complete payment — ${feeLabel}`
            : `Register — ${feeLabel}`}
      </button>
    );
  }

  return (
    <section className="px-4 pb-20 pt-6">
      {payment && (
        <EntryFeePayment
          payment={payment}
          eyebrow={`${challenge.title} registration`}
          statusUrl={`/api/registrations/${payment.registrationId}/payment-status`}
          linkUrl={`/api/registrations/${payment.registrationId}/payment-link`}
          onPaid={() => goToRegistration(payment.registrationId, "?welcome=1")}
          onClose={() => goToRegistration(payment.registrationId)}
        />
      )}

      <div className="mx-auto max-w-6xl">
        <Link to="/challenges" className="text-sm font-bold text-slate-500 hover:text-indigo-600">
          ← All challenges
        </Link>

        {/* HERO */}
        <div className="relative mt-4 overflow-hidden rounded-[28px] bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-500 px-6 py-10 text-white sm:px-10">
          {challenge.coverImage && (
            <img src={challenge.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
          )}
          <div className="relative">
            <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-indigo-700">
              {challenge.category}
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">{challenge.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-50 sm:text-base">{challenge.tagline}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* MAIN */}
          <div className="space-y-6">
            {challenge.description && (
              <Card title="About this challenge">
                <p className="whitespace-pre-line text-sm leading-7 text-slate-600">{challenge.description}</p>
              </Card>
            )}

            <Card title="Timeline">
              <ol className="space-y-4">
                <TimelineItem label="Registration closes" date={challenge.registrationDeadline} />
                <TimelineItem label="Project submission deadline" date={challenge.submissionDeadline} />
                {challenge.resultsAt && <TimelineItem label="Results announced" date={challenge.resultsAt} />}
              </ol>
            </Card>

            {challenge.prizes?.length > 0 && (
              <Card title="Prizes">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {challenge.prizes.map((prize) => (
                    <li key={prize.place} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-black uppercase tracking-wider text-indigo-600">{prize.place}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{prize.reward}</p>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {challenge.rules?.length > 0 && (
              <Card title="Rules">
                <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
                  {challenge.rules.map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ul>
              </Card>
            )}

            {challenge.eligibility && (
              <Card title="Who can join">
                <p className="text-sm leading-6 text-slate-600">{challenge.eligibility}</p>
              </Card>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${PHASE_STYLE[challenge.phase]}`}>
                {PHASE_LABEL[challenge.phase]}
              </span>

              <dl className="mt-5 space-y-3 text-sm">
                <Row label="Entry fee" value={feeLabel} />
                <Row label="Students joined" value={challenge.participants} />
                <Row
                  label="Register by"
                  value={isOpen ? timeLeft(challenge.registrationDeadline) : formatDate(challenge.registrationDeadline)}
                />
                <Row label="Submit by" value={formatDate(challenge.submissionDeadline)} />
              </dl>

              <div className="mt-6">{action}</div>

              {registerError && (
                <p className="mt-3 text-center text-xs font-semibold text-rose-600" role="alert">
                  {registerError}
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-black text-slate-950">{title}</h2>
      {children}
    </div>
  );
}

function TimelineItem({ label, date }) {
  const past = new Date(date) < new Date();

  return (
    <li className="flex items-start gap-3">
      <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${past ? "bg-slate-300" : "bg-indigo-600"}`} />
      <div>
        <p className={`text-sm font-bold ${past ? "text-slate-400" : "text-slate-800"}`}>{label}</p>
        <p className="text-xs text-slate-500">{formatDate(date, true)}</p>
      </div>
    </li>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-black text-slate-900">{value}</dd>
    </div>
  );
}

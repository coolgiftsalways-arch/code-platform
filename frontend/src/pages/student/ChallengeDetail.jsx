import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Award,
  CalendarDays,
  Check,
  ChevronDown,
  Copy,
  ExternalLink,
  Globe,
  Share2,
  MessageCircle,
  Tag,
  Trophy,
  Users,
} from "lucide-react";

import { api } from "../../lib/api.js";
import {
  categoryLabel,
  formatDate,
  formatInr,
  formatInrShort,
  PHASE_LABEL,
  PHASE_STYLE,
  startsIn,
  timeLeft,
} from "../../lib/format.js";
import { categoryColor } from "../../lib/categoryTheme.js";
import CategoryIcon from "../../components/CategoryIcon.jsx";
import { useAuth } from "../../context/auth.js";
import { PageLoader } from "../../components/RequireAuth.jsx";
import EntryFeePayment from "../../components/EntryFeePayment.jsx";
import Countdown from "../../components/Countdown.jsx";

export default function ChallengeDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [challenge, setChallenge] = useState(null);
  const [extras, setExtras] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("overview");

  const [busy, setBusy] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [payment, setPayment] = useState(null);

  // Coupon: { code, amount } once applied
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [checkingCoupon, setCheckingCoupon] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    api(`/api/challenges/${encodeURIComponent(slug)}`)
      .then((data) => setChallenge(data.challenge))
      .catch((err) => setError(err.message));

    api(`/api/challenges/${encodeURIComponent(slug)}/extras`)
      .then(setExtras)
      .catch(() => setExtras({ updates: [], winners: [] }));
  }, [slug, authLoading, user]);

  const goToRegistration = (id, query = "") => navigate(`/dashboard/registrations/${id}${query}`);

  const applyCoupon = async (event) => {
    event?.preventDefault();
    if (!couponInput.trim()) return;

    setCheckingCoupon(true);
    setCouponError("");
    try {
      const data = await api(`/api/challenges/${encodeURIComponent(slug)}/coupon`, {
        method: "POST",
        body: { couponCode: couponInput.trim() },
      });
      setCoupon({ code: data.couponCode, amount: data.amount });
    } catch (err) {
      setCoupon(null);
      setCouponError(err.message);
    } finally {
      setCheckingCoupon(false);
    }
  };

  const register = async () => {
    setBusy(true);
    setRegisterError("");

    try {
      const data = await api(`/api/challenges/${encodeURIComponent(slug)}/register`, {
        method: "POST",
        body: coupon ? { couponCode: coupon.code } : {},
      });

      if (data.paymentStatus === "Pending") {
        setPayment({ registrationId: data.registrationId, amount: data.amount, paymentUrl: data.paymentUrl });
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
  const price = coupon ? coupon.amount : challenge.fee;
  const priceLabel = price ? formatInr(price) : "Free";
  const category = extras?.category;
  const theme = categoryColor(category?.color);

  const countdown =
    challenge.phase === "upcoming"
      ? { to: challenge.startAt, label: "Registration opens in" }
      : challenge.phase === "open"
        ? { to: challenge.registrationDeadline, label: "Registration closes in" }
        : challenge.phase === "submissions"
          ? { to: challenge.submissionDeadline, label: "Submissions close in" }
          : null;

  // The main button, used in the sidebar and in the phone's bottom bar.
  const canRegister = isOpen && !joined && Boolean(user);
  const next = encodeURIComponent(`/challenges/${challenge.slug}`);

  const actionButton = (compact = false) => {
    const base = `block w-full rounded-xl text-center text-sm font-bold transition ${compact ? "py-3" : "py-3.5"}`;

    if (joined) {
      return (
        <Link to={`/dashboard/registrations/${mine.id}`} className={`${base} bg-emerald-600 text-white hover:bg-emerald-700`}>
          ✓ Registered — open dashboard
        </Link>
      );
    }
    if (challenge.phase === "upcoming") {
      return <p className={`${base} bg-orange-50 text-orange-700`}>Opens {formatDate(challenge.startAt)}</p>;
    }
    if (!isOpen) return <p className={`${base} bg-slate-100 text-slate-500`}>Registration closed</p>;
    if (!user) {
      return (
        <Link to={`/signup?next=${next}`} className={`${base} bg-indigo-600 text-white hover:bg-indigo-700`}>
          Sign up to register
        </Link>
      );
    }
    return (
      <button type="button" onClick={register} disabled={busy} className={`${base} bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60`}>
        {busy ? (
          "Please wait…"
        ) : (
          <>
            {mine ? "Complete payment" : "Register"} —{" "}
            {coupon && challenge.fee > 0 && <s className="mr-1 font-semibold opacity-60">{formatInr(challenge.fee)}</s>}
            {priceLabel}
          </>
        )}
      </button>
    );
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    challenge.judgingCriteria?.length && { id: "judging", label: "Judging" },
    challenge.faqs?.length && { id: "faq", label: "FAQ" },
    { id: "updates", label: `Updates${extras?.updates?.length ? ` (${extras.updates.length})` : ""}` },
    extras?.galleryPublic && { id: "projects", label: `Projects${extras.projectCount ? ` (${extras.projectCount})` : ""}` },
  ].filter(Boolean);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Join me in ${challenge.title} on DEVNEX! ${shareUrl}`;

  return (
    <section className="px-4 pb-28 pt-6 lg:pb-20">
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
        <div className="relative mt-4 overflow-hidden rounded-[28px] bg-gradient-to-br from-indigo-950 via-indigo-800 to-violet-700 px-5 py-8 text-white sm:px-10 sm:py-10">
          {challenge.coverImage && (
            <img src={challenge.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
          )}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-[0.06] [background-size:26px_26px]" />

          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-indigo-700">
                  <CategoryIcon name={category?.icon} className="h-3.5 w-3.5" />
                  {categoryLabel(challenge.category)}
                </span>
                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${PHASE_STYLE[challenge.phase]}`}>
                  {PHASE_LABEL[challenge.phase]}
                </span>
              </div>
              <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">{challenge.title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100 sm:text-base">{challenge.tagline}</p>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-indigo-100">
                <span className="flex items-center gap-1.5"><Globe className="h-4 w-4" /> Online</span>
                {challenge.prizePool > 0 && (
                  <span className="flex items-center gap-1.5"><Trophy className="h-4 w-4" /> {formatInrShort(challenge.prizePool)} in prizes</span>
                )}
                <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {challenge.participants} joined</span>
                <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> Submit by {formatDate(challenge.submissionDeadline)}</span>
              </div>
            </div>

            {countdown && <Countdown to={countdown.to} label={countdown.label} dark />}
          </div>
        </div>

        {/* WINNERS */}
        {extras?.winners?.length > 0 && (
          <div className="mt-6 rounded-[24px] border border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50 p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-lg font-black text-amber-900">
              <Award className="h-5 w-5" /> Winners
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {extras.winners.map((w) => (
                <Link key={w.id} to={`/projects/${w.id}`} className="rounded-2xl border border-amber-200 bg-white p-4 transition hover:shadow-md">
                  <p className="text-[11px] font-black uppercase tracking-wider text-amber-700">🏆 {w.badge}</p>
                  <p className="mt-1 font-black text-slate-950">{w.projectTitle}</p>
                  <p className="text-xs text-slate-500">
                    {w.student.name}
                    {w.student.institute ? ` · ${w.student.institute}` : ""}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* TABS */}
        <div className="sticky top-16 z-20 -mx-4 mt-6 overflow-x-auto border-b border-slate-200 bg-[#f8fafc]/95 px-4 backdrop-blur lg:static lg:mx-0 lg:bg-transparent lg:px-0">
          <div className="flex gap-1" role="tablist">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-bold transition ${
                  tab === t.id ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* MAIN */}
          <div className="min-w-0 space-y-6">
            {tab === "overview" && (
              <>
                {challenge.description && (
                  <Card title="About this challenge">
                    <p className="whitespace-pre-line text-sm leading-7 text-slate-600">{challenge.description}</p>
                  </Card>
                )}

                <Card title="Timeline">
                  <ol className="space-y-4">
                    {challenge.startAt && <TimelineItem label="Registration opens" date={challenge.startAt} />}
                    <TimelineItem label="Registration closes" date={challenge.registrationDeadline} />
                    <TimelineItem label="Project submission deadline" date={challenge.submissionDeadline} />
                    {challenge.resultsAt && <TimelineItem label="Results announced" date={challenge.resultsAt} />}
                  </ol>
                </Card>

                {challenge.prizes?.length > 0 && (
                  <Card title="Prizes">
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {challenge.prizes.map((prize, index) => (
                        <li
                          key={prize.place}
                          className={`rounded-2xl border p-4 ${index === 0 ? "border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50" : "border-slate-200 bg-slate-50"}`}
                        >
                          <p className={`text-xs font-black uppercase tracking-wider ${index === 0 ? "text-amber-700" : "text-indigo-600"}`}>
                            {index === 0 ? "🥇 " : index === 1 ? "🥈 " : index === 2 ? "🥉 " : ""}
                            {prize.place}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-800">{prize.reward}</p>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {challenge.eligibility && (
                  <Card title="Who can join">
                    <p className="text-sm leading-6 text-slate-600">{challenge.eligibility}</p>
                  </Card>
                )}

                {challenge.rules?.length > 0 && (
                  <Card title="Rules">
                    <ul className="space-y-2.5 text-sm leading-6 text-slate-600">
                      {challenge.rules.map((rule) => (
                        <li key={rule} className="flex gap-2.5">
                          <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

                {(challenge.tags || []).length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag className="h-4 w-4 text-slate-400" />
                    {challenge.tags.map((t) => (
                      <Link key={t} to={`/challenges?tag=${encodeURIComponent(t)}`} className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100">
                        {t}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}

            {tab === "judging" && (
              <Card title="How projects are judged">
                <ul className="space-y-4">
                  {challenge.judgingCriteria.map((c) => (
                    <li key={c.name}>
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="font-black text-slate-900">{c.name}</p>
                        {c.weight > 0 && <span className="text-sm font-black text-indigo-600">{c.weight}%</span>}
                      </div>
                      {c.weight > 0 && (
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div className="h-full rounded-full bg-indigo-600" style={{ width: `${c.weight}%` }} />
                        </div>
                      )}
                      {c.description && <p className="mt-1.5 text-sm leading-6 text-slate-600">{c.description}</p>}
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {tab === "faq" && (
              <div className="space-y-3">
                {challenge.faqs.map((f) => (
                  <details key={f.question} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-bold text-slate-900">
                      {f.question}
                      <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition group-open:rotate-180" />
                    </summary>
                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">{f.answer}</p>
                  </details>
                ))}
              </div>
            )}

            {tab === "updates" &&
              (extras?.updates?.length ? (
                <div className="space-y-3">
                  {extras.updates.map((u) => (
                    <article key={u.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">{formatDate(u.createdAt, true)}</p>
                      <h3 className="mt-1 font-black text-slate-950">{u.title}</h3>
                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{u.body}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <Card title="Updates">
                  <p className="text-sm text-slate-500">No updates yet. Announcements from the DEVNEX team will appear here.</p>
                </Card>
              ))}

            {tab === "projects" && (
              <Card title="Project gallery">
                <p className="text-sm text-slate-600">
                  See all {extras.projectCount} projects submitted to this challenge.
                </p>
                <Link
                  to={`/challenges/${challenge.slug}/projects`}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
                >
                  Open the gallery <ExternalLink className="h-4 w-4" />
                </Link>
              </Card>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Entry fee</p>
              <p className="mt-1 flex items-baseline gap-2">
                {coupon && challenge.fee > 0 && <s className="text-lg font-bold text-slate-400">{formatInr(challenge.fee)}</s>}
                <span className="text-3xl font-black text-slate-950">{priceLabel}</span>
              </p>

              <dl className="mt-5 space-y-3 text-sm">
                {challenge.prizePool > 0 && <Row label="Prize pool" value={formatInr(challenge.prizePool)} />}
                <Row label="Where" value="Online" />
                <Row label="Students joined" value={challenge.participants} />
                <Row
                  label={challenge.phase === "upcoming" ? "Opens" : "Register by"}
                  value={
                    challenge.phase === "upcoming"
                      ? startsIn(challenge.startAt).replace("Starts ", "")
                      : isOpen
                        ? timeLeft(challenge.registrationDeadline)
                        : formatDate(challenge.registrationDeadline)
                  }
                />
                <Row label="Submit by" value={formatDate(challenge.submissionDeadline)} />
              </dl>

              <div className="mt-6">{actionButton()}</div>

              {!user && isOpen && (
                <p className="mt-3 text-center text-xs text-slate-500">
                  Have an account?{" "}
                  <Link to={`/login?next=${next}`} className="font-bold text-indigo-600 hover:underline">
                    Log in
                  </Link>
                </p>
              )}

              {/* Coupon */}
              {canRegister && challenge.fee > 0 && (
                <div className="mt-3">
                  {coupon ? (
                    <p className="flex items-center justify-between gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-bold text-emerald-800">
                      <span>✓ {coupon.code} applied — you pay {formatInr(coupon.amount)}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setCoupon(null);
                          setCouponInput("");
                        }}
                        className="text-emerald-700 underline"
                      >
                        Remove
                      </button>
                    </p>
                  ) : showCoupon ? (
                    <form onSubmit={applyCoupon} className="flex gap-2">
                      <input
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value);
                          setCouponError("");
                        }}
                        placeholder="Coupon code"
                        aria-label="Coupon code"
                        autoCapitalize="characters"
                        className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-bold uppercase tracking-wider text-slate-800 outline-none focus:border-indigo-600 focus:bg-white"
                      />
                      <button
                        type="submit"
                        disabled={checkingCoupon || !couponInput.trim()}
                        className="rounded-xl bg-slate-900 px-4 text-sm font-bold text-white disabled:opacity-50"
                      >
                        {checkingCoupon ? "…" : "Apply"}
                      </button>
                    </form>
                  ) : (
                    <button type="button" onClick={() => setShowCoupon(true)} className="w-full text-center text-xs font-bold text-slate-500 hover:text-indigo-600">
                      Have a coupon code?
                    </button>
                  )}
                  {couponError && <p className="mt-2 text-center text-xs font-semibold text-rose-600">{couponError}</p>}
                </div>
              )}

              {registerError && (
                <p className="mt-3 text-center text-xs font-semibold text-rose-600" role="alert">
                  {registerError}
                </p>
              )}
            </div>

            {/* Category */}
            {category && (
              <Link to={`/categories#${category.slug}`} className="flex items-center gap-3 rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm hover:border-indigo-200">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white ${theme.gradient}`}>
                  <CategoryIcon name={category?.icon} className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Category</span>
                  <span className="block truncate text-sm font-bold text-slate-900">{category.title}</span>
                </span>
              </Link>
            )}

            {/* Share */}
            <ShareBox url={shareUrl} text={shareText} />
          </aside>
        </div>
      </div>

      {/* PHONE: fixed bottom bar with price + main button */}
      {!payment && (isOpen || joined) && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
          <div className="mx-auto flex max-w-md items-center gap-3">
            {!joined && (
              <div className="shrink-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Entry</p>
                <p className="text-base font-black text-slate-950">{priceLabel}</p>
              </div>
            )}
            <div className="flex-1">{actionButton(true)}</div>
          </div>
        </div>
      )}
    </section>
  );
}

function ShareBox({ url, text }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked; ignore
    }
  };

  const btn = "flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50";

  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm">
      <p className="mb-3 text-[10px] font-black uppercase tracking-wider text-slate-400">Invite friends</p>
      <div className="flex gap-2">
        <a className={btn} href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer">
          <MessageCircle className="h-4 w-4 text-green-600" /> WhatsApp
        </a>
        <a className={btn} href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer">
          <Share2 className="h-4 w-4 text-sky-700" /> LinkedIn
        </a>
        <button type="button" className={btn} onClick={copy}>
          {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
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

import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

import { api } from "../lib/api.js";
import { formatInr } from "../lib/format.js";

const POLL_MS = 4000;

// Same as lights.bio: a QR of the fixed-amount Razorpay payment link + a
// "Pay with Razorpay" button, and waits for the payment.
//
// payment   { amount, paymentUrl }
// statusUrl GET  -> { paymentStatus: "Paid" | "Pending", expired }
// linkUrl   POST -> { paymentUrl, amount }   (new link after expiry)
export default function EntryFeePayment({
  payment,
  statusUrl,
  linkUrl,
  onPaid,
  onClose,
  eyebrow = "DEVNEX Entry Fee",
  note = "Scan with your phone camera to open the payment page, then pay with any UPI app.",
}) {
  const [current, setCurrent] = useState(payment);
  const [checking, setChecking] = useState(false);
  const [expired, setExpired] = useState(!payment?.paymentUrl);
  const [renewing, setRenewing] = useState(false);
  const [error, setError] = useState("");

  // Always call the latest onPaid without restarting the poller.
  const onPaidRef = useRef(onPaid);
  useEffect(() => {
    onPaidRef.current = onPaid;
  });

  const fetchStatus = async () => {
    const data = await api(statusUrl);

    if (data.paymentStatus === "Paid") onPaidRef.current();
    else if (data.expired) setExpired(true);

    return data;
  };

  // Ask the server every 4 seconds whether the payment came through.
  useEffect(() => {
    if (expired) return undefined;

    let stopped = false;

    const check = () => {
      if (!stopped) fetchStatus().catch(() => {});
    };

    const id = setInterval(check, POLL_MS);

    // Check right away when the student comes back from the UPI app.
    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      stopped = true;
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusUrl, expired]);

  const checkNow = async () => {
    setChecking(true);
    setError("");
    try {
      const data = await fetchStatus();
      if (data.paymentStatus !== "Paid" && !data.expired) {
        setError("We haven't received the payment yet. It can take a few seconds.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setChecking(false);
    }
  };

  const renewLink = async () => {
    setRenewing(true);
    setError("");
    try {
      const data = await api(linkUrl, { method: "POST" });

      setCurrent((previous) => ({
        ...previous,
        paymentUrl: data.paymentUrl,
        amount: data.amount ?? previous?.amount,
      }));
      setExpired(false);
    } catch (err) {
      if (err.status === 409) onPaidRef.current();
      else setError(err.message || "Couldn't start payment. Please try again.");
    } finally {
      setRenewing(false);
    }
  };

  const amount = formatInr(current?.amount);

  return (
    <div className="fixed inset-0 z-[99999] flex min-h-screen items-center justify-center overflow-y-auto bg-slate-950/45 px-4 py-8 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-[30px] border border-slate-200 bg-white p-6 text-center shadow-2xl sm:p-8">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            ×
          </button>
        )}

        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
          {eyebrow}
        </p>

        <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">Pay {amount}</h1>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">{note}</p>

        {current?.paymentUrl && !expired ? (
          <>
            <div className="mx-auto mt-5 flex w-fit flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <QRCodeSVG value={current.paymentUrl} size={220} level="M" marginSize={2} />
              <span className="text-sm font-black text-slate-900">{amount}</span>
            </div>

            <div className="my-4 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              or
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <a
              href={current.paymentUrl}
              className="block w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              Pay {amount} with Razorpay
            </a>

            <p className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
              <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
              Waiting for payment… this page updates automatically.
            </p>
          </>
        ) : (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm font-semibold text-amber-800">
            {current?.paymentUrl ? "This payment link has expired." : "Get your payment link to continue."}
            <button
              type="button"
              onClick={renewLink}
              disabled={renewing}
              className="mt-3 block w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {renewing ? "Creating link…" : "Get a new payment link"}
            </button>
          </div>
        )}

        {error && (
          <p className="mt-3 text-xs font-semibold text-rose-600" role="status">
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-bold">
          <button
            type="button"
            onClick={checkNow}
            disabled={checking}
            className="text-indigo-600 hover:underline disabled:opacity-60"
          >
            {checking ? "Checking…" : "I've paid — check now"}
          </button>

          {onClose && (
            <button type="button" onClick={onClose} className="text-slate-500 hover:underline">
              Pay later
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

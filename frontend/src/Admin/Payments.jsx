import { useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  Search,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Clock3,
} from "lucide-react";

const API = "http://localhost:5000/api/participants";

export default function Payments() {
  const [participants, setParticipants] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchParticipants = async () => {
    try {
      setLoading(true);

      const response = await fetch(API);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setParticipants(data.participants || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const filtered = useMemo(() => {
    return participants.filter((p) =>
      [
        p.fullName,
        p.email,
        p.paymentStatus,
        p.razorpayOrderId,
        p.razorpayPaymentId,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [participants, search]);

  const paid = participants.filter(
    (p) => p.paymentStatus === "Paid"
  ).length;

  const pending = participants.filter(
    (p) => p.paymentStatus !== "Paid"
  ).length;

  const revenue = participants
    .filter((p) => p.paymentStatus === "Paid")
    .reduce(
      (total, p) => total + Number(p.finalistFee || 0),
      0
    );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-5 sm:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-indigo-600">
            HUBWEB / STUDENT MANAGEMENT
          </p>

          <h1 className="mt-2 text-3xl font-black">
            Payments
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Track finalist fees and Razorpay payments.
          </p>
        </div>

        <button
          onClick={fetchParticipants}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-black text-white hover:bg-indigo-600"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <p className="text-xs font-black uppercase text-slate-400">
            Paid
          </p>
          <p className="mt-2 text-3xl font-black text-emerald-600">
            {paid}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <p className="text-xs font-black uppercase text-slate-400">
            Pending
          </p>
          <p className="mt-2 text-3xl font-black text-amber-500">
            {pending}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <p className="text-xs font-black uppercase text-slate-400">
            Revenue
          </p>
          <p className="mt-2 text-3xl font-black">
            ₹{revenue}
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search payment..."
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-indigo-400 focus:bg-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-slate-200 bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white">
          <table className="w-full min-w-[1000px] border-collapse">
            <thead>
              <tr className="bg-slate-50">
                {[
                  "Participant",
                  "Fee",
                  "Payment",
                  "Order ID",
                  "Payment ID",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="border-r border-slate-200 px-6 py-4 text-left text-[9px] font-black uppercase text-slate-400 last:border-r-0"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p._id}
                  className="border-t border-slate-200 hover:bg-slate-50"
                >
                  <td className="border-r border-slate-200 px-6 py-5">
                    <p className="font-black">
                      {p.fullName || "—"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {p.email}
                    </p>
                  </td>

                  <td className="border-r border-slate-200 px-6 py-5 font-black">
                    ₹{p.finalistFee || 399}
                  </td>

                  <td className="border-r border-slate-200 px-6 py-5">
                    {p.paymentStatus === "Paid" ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-xs font-black text-amber-600">
                        <Clock3 className="h-4 w-4" />
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="border-r border-slate-200 px-6 py-5 text-xs font-bold text-slate-500">
                    {p.razorpayOrderId || "—"}
                  </td>

                  <td className="px-6 py-5 text-xs font-bold text-slate-500">
                    {p.razorpayPaymentId || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
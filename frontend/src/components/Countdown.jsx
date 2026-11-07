import { useEffect, useState } from "react";

function parts(target) {
  const ms = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    done: ms === 0,
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms / 3600000) % 24),
    minutes: Math.floor((ms / 60000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

// Live "12d 04h 33m 10s" countdown.
export default function Countdown({ to, label, dark = false }) {
  const [time, setTime] = useState(() => parts(to));

  useEffect(() => {
    const id = setInterval(() => setTime(parts(to)), 1000);
    return () => clearInterval(id);
  }, [to]);

  if (time.done) return null;

  const box = dark
    ? "bg-white/10 text-white ring-1 ring-white/15"
    : "bg-slate-900 text-white";

  return (
    <div>
      {label && (
        <p className={`mb-2 text-[10px] font-black uppercase tracking-[0.18em] ${dark ? "text-indigo-200" : "text-slate-500"}`}>
          {label}
        </p>
      )}
      <div className="flex gap-2" role="timer" aria-live="off">
        {[
          ["days", time.days],
          ["hrs", time.hours],
          ["min", time.minutes],
          ["sec", time.seconds],
        ].map(([unit, value]) => (
          <div key={unit} className={`min-w-[52px] rounded-xl px-2 py-2 text-center ${box}`}>
            <span className="block text-lg font-black tabular-nums leading-5">{String(value).padStart(2, "0")}</span>
            <span className="text-[9px] font-bold uppercase tracking-wider opacity-70">{unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

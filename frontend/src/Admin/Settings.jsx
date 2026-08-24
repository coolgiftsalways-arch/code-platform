import { useState } from "react";
import {
  Settings as SettingsIcon,
  Save,
  ShieldCheck,
} from "lucide-react";

export default function Settings() {
  const [earlyBird, setEarlyBird] = useState(399);
  const [standard, setStandard] = useState(499);
  const [lateBird, setLateBird] = useState(699);

  const handleSave = () => {
    alert("Settings saved locally. Backend settings will be connected next.");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-5 sm:p-8">
      <div className="mb-8">
        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-indigo-600">
          HUBWEB / SYSTEM
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Settings
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Configure competition and finalist settings.
        </p>
      </div>

      <div className="max-w-4xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-6 w-6 text-indigo-600" />

            <div>
              <h2 className="font-black">
                Finalist Fees
              </h2>

              <p className="text-xs text-slate-400">
                Configure the different finalist fee tiers.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div>
              <label className="text-xs font-black uppercase text-slate-400">
                Early Bird
              </label>

              <input
                type="number"
                value={earlyBird}
                onChange={(e) =>
                  setEarlyBird(e.target.value)
                }
                className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 font-bold outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase text-slate-400">
                Standard
              </label>

              <input
                type="number"
                value={standard}
                onChange={(e) =>
                  setStandard(e.target.value)
                }
                className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 font-bold outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase text-slate-400">
                Late Bird
              </label>

              <input
                type="number"
                value={lateBird}
                onChange={(e) =>
                  setLateBird(e.target.value)
                }
                className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 font-bold outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="mt-8 flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-black text-white hover:bg-indigo-600"
          >
            <Save className="h-4 w-4" />
            Save Settings
          </button>
        </section>

        <section className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />

            <div>
              <h2 className="font-black text-emerald-900">
                Platform Status
              </h2>

              <p className="mt-1 text-xs text-emerald-700">
                Competition platform is operational.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
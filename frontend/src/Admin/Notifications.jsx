import { useState } from "react";
import {
  Bell,
  Send,
  Mail,
  Users,
} from "lucide-react";

export default function Notifications() {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("All Participants");

  const handleSend = () => {
    if (!message.trim()) {
      alert("Please enter a message.");
      return;
    }

    alert(
      `Notification prepared for ${type}. Backend notification service will be connected next.`
    );

    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-5 sm:p-8">
      <div className="mb-8">
        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-indigo-600">
          HUBWEB / SYSTEM
        </p>

        <h1 className="mt-2 text-3xl font-black">
          Notifications
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Send updates and announcements to participants.
        </p>
      </div>

      <div className="max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-indigo-50 p-3">
            <Bell className="h-5 w-5 text-indigo-600" />
          </div>

          <div>
            <h2 className="font-black">
              Create Notification
            </h2>

            <p className="text-xs text-slate-400">
              Send a platform announcement.
            </p>
          </div>
        </div>

        <label className="text-xs font-black uppercase text-slate-500">
          Audience
        </label>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none"
        >
          <option>All Participants</option>
          <option>Qualified Participants</option>
          <option>Finalists</option>
          <option>Paid Participants</option>
        </select>

        <label className="mt-6 block text-xs font-black uppercase text-slate-500">
          Message
        </label>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          placeholder="Write your announcement..."
          className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-indigo-400 focus:bg-white"
        />

        <button
          onClick={handleSend}
          className="mt-5 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-xs font-black text-white hover:bg-indigo-700"
        >
          <Send className="h-4 w-4" />
          Send Notification
        </button>
      </div>
    </div>
  );
}
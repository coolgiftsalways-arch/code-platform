import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Globe,
  Upload,
  Users,
  Trophy,
  LogOut,
  Menu,
  X,
  UserCheck,
  CreditCard,
  CalendarDays,
  Award,
  Bell,
  Settings,
} from "lucide-react";

/* =========================================================
   SIDEBAR ITEM
========================================================= */

function SidebarItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group
        flex
        w-full
        items-center
        gap-3
        rounded-xl
        px-3
        py-3
        text-sm
        font-bold
        transition-all
        duration-200

        ${
          active
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
            : "text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
        }
      `}
    >
      <Icon className="h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-110" />

      <span>{label}</span>
    </button>
  );
}

/* =========================================================
   ADMIN SIDEBAR
========================================================= */

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const goTo = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleExit = () => {
    navigate("/");
  };

  return (
    <>
      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden"
        />
      )}

      {/* =================================================
          MOBILE MENU BUTTON
      ================================================= */}

      <button
        type="button"
        onClick={() => setSidebarOpen(true)}
        className="
          fixed
          left-4
          top-5
          z-30
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          border
          border-slate-200
          bg-white
          text-slate-600
          shadow-sm
          hover:bg-slate-50
          lg:hidden
        "
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-[270px]
          flex-col
          border-r
          border-slate-200
          bg-white
          transition-transform
          duration-300

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >

        {/* =================================================
            LOGO
        ================================================= */}

        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Globe className="h-5 w-5" />
            </div>

            <div>

              <div className="text-lg font-black tracking-tight text-slate-900">
                HUBWEB
              </div>

              <div className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-600">
                Admin
              </div>

            </div>

          </div>

          {/* MOBILE CLOSE */}

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <div className="flex-1 overflow-y-auto px-4 py-6">

          {/* ================= WORKSPACE ================= */}

          <p className="mb-3 px-3 text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
            Workspace
          </p>

          <div className="space-y-1">

            <SidebarItem
              icon={LayoutDashboard}
              label="Overview"
              active={isActive("/admin/dashboard")}
              onClick={() => goTo("/admin/dashboard")}
            />

            <SidebarItem
              icon={Users}
              label="Participants"
              active={isActive("/admin/participants")}
              onClick={() => goTo("/admin/participants")}
            />

            <SidebarItem
              icon={Upload}
              label="Submissions"
              active={isActive("/admin/submissions")}
              onClick={() => goTo("/admin/submissions")}
            />

            <SidebarItem
              icon={Trophy}
              label="Winners"
              active={isActive("/admin/winners")}
              onClick={() => goTo("/admin/winners")}
            />

          </div>

          {/* ================= STUDENT MANAGEMENT ================= */}

          <p className="mb-3 mt-8 px-3 text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
            Student Management
          </p>

          <div className="space-y-1">

            <SidebarItem
              icon={UserCheck}
              label="Qualification"
              active={isActive("/admin/qualification")}
              onClick={() => goTo("/admin/qualification")}
            />

            <SidebarItem
              icon={CreditCard}
              label="Payments"
              active={isActive("/admin/payments")}
              onClick={() => goTo("/admin/payments")}
            />

            <SidebarItem
              icon={CalendarDays}
              label="Defense Schedule"
              active={isActive("/admin/defense")}
              onClick={() => goTo("/admin/defense")}
            />

            <SidebarItem
              icon={Award}
              label="Finalists"
              active={isActive("/admin/finalists")}
              onClick={() => goTo("/admin/finalists")}
            />

          </div>

          {/* ================= SYSTEM ================= */}

          <p className="mb-3 mt-8 px-3 text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
            System
          </p>

          <div className="space-y-1">

            <SidebarItem
              icon={Bell}
              label="Notifications"
              active={isActive("/admin/notifications")}
              onClick={() => goTo("/admin/notifications")}
            />

            <SidebarItem
              icon={Settings}
              label="Settings"
              active={isActive("/admin/settings")}
              onClick={() => goTo("/admin/settings")}
            />

          </div>

        </div>

        {/* =================================================
            ADMIN PROFILE
        ================================================= */}

        <div className="border-t border-slate-100 p-4">

          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-black text-indigo-600">
              A
            </div>

            <div className="min-w-0 flex-1">

              <p className="truncate text-xs font-black text-slate-900">
                Admin
              </p>

              <p className="truncate text-[10px] font-medium text-slate-400">
                admin@hubweb.com
              </p>

            </div>

            <button
              type="button"
              onClick={handleExit}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-red-500"
              title="Exit Dashboard"
            >
              <LogOut className="h-4 w-4" />
            </button>

          </div>

        </div>

      </aside>
    </>
  );
}
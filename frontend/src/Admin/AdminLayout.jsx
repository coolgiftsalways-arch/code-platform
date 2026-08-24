import AdminSidebar from "./AdminSidebar.jsx";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">

      {/* SIDEBAR */}

      <AdminSidebar />

      {/* PAGE CONTENT */}

      <main className="min-h-screen lg:ml-[270px]">
        {children}
      </main>

    </div>
  );
}
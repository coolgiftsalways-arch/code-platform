import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Lenis from "lenis";

// =========================================================
// WEBSITE COMPONENTS
// =========================================================

import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import AboutUs from "./components/About.jsx";
import Gallery from "./components/Gallery.jsx";
import Categories from "./components/Categories .jsx";
import HallofFrme from "./components/HallOfFame.jsx";
import Footer from "./components/Footer.jsx";
import LoginForm from "./components/Upload.jsx";

// =========================================================
// ADMIN COMPONENTS
// =========================================================

import Dashboard from "./Admin/Dashboard.jsx";
import Participants from "./Admin/Participants.jsx";
import Submissions from "./Admin/Submissions.jsx";
import Winners from "./Admin/Winners.jsx";
import Qualification from "./Admin/Qualification.jsx";
import Payments from "./Admin/Payments.jsx";
import DefenseSchedule from "./Admin/DefenseSchedule.jsx";
import Finalists from "./Admin/Finalists.jsx";
import Notifications from "./Admin/Notifications.jsx";
import Settings from "./Admin/Settings.jsx";
import AdminLayout from "./Admin/AdminLayout.jsx";

// =========================================================
// CSS
// =========================================================

import "./App.css";

/* =========================================================
   LENIS SMOOTH SCROLL
========================================================= */

function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
      lerp: 0.08,
    });

    let animationFrame;

    const raf = (time) => {
      lenis.raf(time);
      animationFrame = requestAnimationFrame(raf);
    };

    animationFrame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrame);
      lenis.destroy();
    };
  }, []);

  return null;
}

/* =========================================================
   SCROLL TO TOP WHEN ROUTE CHANGES
========================================================= */

function RouteScrollManager() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.pathname]);

  return null;
}

/* =========================================================
   WEBSITE LAYOUT
========================================================= */

function WebsiteLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <Navbar />

      <main className="pt-20">{children}</main>

      <Footer />
    </div>
  );
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  return (
    <BrowserRouter>
      {/* Smooth scrolling */}
      <SmoothScroll />

      {/* Reset scroll when navigating */}
      <RouteScrollManager />

      <Routes>
        {/* =================================================
            WEBSITE ROUTES
        ================================================= */}

        {/* HOME */}

        <Route
          path="/"
          element={
            <WebsiteLayout>
              <Hero />
            </WebsiteLayout>
          }
        />

        {/* ABOUT */}

        <Route
          path="/about"
          element={
            <WebsiteLayout>
              <AboutUs />
            </WebsiteLayout>
          }
        />

        {/* GALLERY */}

        <Route
          path="/features"
          element={
            <WebsiteLayout>
              <Gallery />
            </WebsiteLayout>
          }
        />

        {/* =================================================
            CATEGORIES
        ================================================= */}

        <Route
          path="/categories"
          element={
            <WebsiteLayout>
              <Categories />
            </WebsiteLayout>
          }
        />

        {/* UPLOAD / EXPO 2026 */}

        <Route
          path="/upload"
          element={
            <WebsiteLayout>
              <div className="px-4 py-12">
                <LoginForm />
              </div>
            </WebsiteLayout>
          }
        />

        {/* HALL OF FAME */}

        <Route
          path="/hall-of-fame"
          element={
            <WebsiteLayout>
              <HallofFrme />
            </WebsiteLayout>
          }
        />

        {/* =================================================
            ADMIN ROUTES
        ================================================= */}

        {/* DASHBOARD */}

        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          }
        />

        {/* PARTICIPANTS */}

        <Route
          path="/admin/participants"
          element={
            <AdminLayout>
              <Participants />
            </AdminLayout>
          }
        />

        {/* SUBMISSIONS */}

        <Route
          path="/admin/submissions"
          element={
            <AdminLayout>
              <Submissions />
            </AdminLayout>
          }
        />

        {/* WINNERS */}

        <Route
          path="/admin/winners"
          element={
            <AdminLayout>
              <Winners />
            </AdminLayout>
          }
        />

        {/* QUALIFICATION */}

        <Route
          path="/admin/qualification"
          element={
            <AdminLayout>
              <Qualification />
            </AdminLayout>
          }
        />

        {/* PAYMENTS */}

        <Route
          path="/admin/payments"
          element={
            <AdminLayout>
              <Payments />
            </AdminLayout>
          }
        />

        {/* DEFENSE SCHEDULE */}

        <Route
          path="/admin/defense"
          element={
            <AdminLayout>
              <DefenseSchedule />
            </AdminLayout>
          }
        />

        {/* FINALISTS */}

        <Route
          path="/admin/finalists"
          element={
            <AdminLayout>
              <Finalists />
            </AdminLayout>
          }
        />

        {/* NOTIFICATIONS */}

        <Route
          path="/admin/notifications"
          element={
            <AdminLayout>
              <Notifications />
            </AdminLayout>
          }
        />

        {/* SETTINGS */}

        <Route
          path="/admin/settings"
          element={
            <AdminLayout>
              <Settings />
            </AdminLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

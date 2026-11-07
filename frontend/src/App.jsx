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
import Categories from "./pages/Categories.jsx";
import HallofFrme from "./components/HallOfFame.jsx";
import Footer from "./components/Footer.jsx";
import LoginForm from "./components/Upload.jsx";
import CustomCursor from "./components/CustomCursor.jsx";

// NEW SPONSORS PAGE
import Sponsors from "./components/Sponsors.jsx";

// =========================================================
// STUDENT ACCOUNTS + CHALLENGES
// =========================================================

import AuthProvider from "./context/AuthProvider.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import AuthPage from "./pages/student/AuthPage.jsx";
import Challenges from "./pages/student/Challenges.jsx";
import ChallengeDetail from "./pages/student/ChallengeDetail.jsx";
import StudentDashboard from "./pages/student/Dashboard.jsx";
import RegistrationPage from "./pages/student/RegistrationPage.jsx";
import { ProjectGallery, ProjectPage } from "./pages/student/Projects.jsx";
import { Profile, ForgotPassword, ResetPassword } from "./pages/student/Account.jsx";
import { CertificatePage, VerifyPage } from "./pages/student/Certificate.jsx";

// =========================================================
// ADMIN COMPONENTS
// =========================================================

import AdminShell from "./adminPanel/AdminShell.jsx";
import AdminLogin from "./adminPanel/AdminLogin.jsx";
import AdminOverview from "./adminPanel/pages/Overview.jsx";
import AdminChallenges from "./adminPanel/pages/ChallengesList.jsx";
import AdminChallengeForm from "./adminPanel/pages/ChallengeForm.jsx";
import AdminRegistrations from "./adminPanel/pages/Registrations.jsx";
import AdminRegistrationDetail from "./adminPanel/pages/RegistrationDetail.jsx";
import { StudentsList as AdminStudents, StudentDetail as AdminStudentDetail } from "./adminPanel/pages/Students.jsx";
import AdminPayments from "./adminPanel/pages/Payments.jsx";
import AdminAnnouncements from "./adminPanel/pages/Announcements.jsx";
import AdminSettings from "./adminPanel/pages/Settings.jsx";
import AdminCategories from "./adminPanel/pages/Categories.jsx";

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
   CUSTOM CURSOR (website only; the admin panel uses the normal cursor)
========================================================= */

function SiteCursor() {
  const { pathname } = useLocation();
  return pathname.startsWith("/admin") ? null : <CustomCursor />;
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
      {/* GLOBAL NAVBAR */}
      <Navbar />

      {/* PAGE CONTENT */}
      <main className="pt-20">{children}</main>

      {/* GLOBAL FOOTER */}
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
      <AuthProvider>
      {/* =====================================================
          DEVNEX CUSTOM CURSOR
      ===================================================== */}

      <SiteCursor />

      {/* =====================================================
          LENIS SMOOTH SCROLL
      ===================================================== */}

      <SmoothScroll />

      {/* =====================================================
          RESET SCROLL ON ROUTE CHANGE
      ===================================================== */}

      <RouteScrollManager />

      {/* =====================================================
          ROUTES
      ===================================================== */}

      <Routes>
        {/* =====================================================
            WEBSITE ROUTES
        ===================================================== */}

        {/* ================= HOME ================= */}

        <Route
          path="/"
          element={
            <WebsiteLayout>
              <Hero />
            </WebsiteLayout>
          }
        />

        {/* ================= ABOUT ================= */}

        <Route
          path="/about"
          element={
            <WebsiteLayout>
              <AboutUs />
            </WebsiteLayout>
          }
        />

        {/* ================= CATEGORIES ================= */}

        <Route
          path="/categories"
          element={
            <WebsiteLayout>
              <Categories />
            </WebsiteLayout>
          }
        />

        {/* ================= GALLERY / FEATURES ================= */}

        <Route
          path="/features"
          element={
            <WebsiteLayout>
              <Gallery />
            </WebsiteLayout>
          }
        />

        {/* =====================================================
            SPONSORS
        ===================================================== */}

        <Route
          path="/sponsors"
          element={
            <WebsiteLayout>
              <Sponsors />
            </WebsiteLayout>
          }
        />

        {/* ================= EXPO 2026 / UPLOAD ================= */}

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

        {/* =====================================================
            STUDENT: SIGN UP / LOG IN
        ===================================================== */}

        <Route
          path="/signup"
          element={
            <WebsiteLayout>
              <AuthPage mode="signup" />
            </WebsiteLayout>
          }
        />

        <Route
          path="/login"
          element={
            <WebsiteLayout>
              <AuthPage mode="login" />
            </WebsiteLayout>
          }
        />

        {/* =====================================================
            STUDENT: CHALLENGES (public)
        ===================================================== */}

        <Route
          path="/challenges"
          element={
            <WebsiteLayout>
              <Challenges />
            </WebsiteLayout>
          }
        />

        <Route
          path="/challenges/:slug"
          element={
            <WebsiteLayout>
              <ChallengeDetail />
            </WebsiteLayout>
          }
        />

        {/* =====================================================
            STUDENT: DASHBOARD (logged in)
        ===================================================== */}

        <Route
          path="/dashboard"
          element={
            <WebsiteLayout>
              <RequireAuth>
                <StudentDashboard />
              </RequireAuth>
            </WebsiteLayout>
          }
        />

        <Route
          path="/dashboard/registrations/:id"
          element={
            <WebsiteLayout>
              <RequireAuth>
                <RegistrationPage />
              </RequireAuth>
            </WebsiteLayout>
          }
        />

        {/* =====================================================
            PROJECTS, PROFILE, PASSWORDS, CERTIFICATES
        ===================================================== */}

        <Route path="/challenges/:slug/projects" element={<WebsiteLayout><ProjectGallery /></WebsiteLayout>} />
        <Route path="/projects/:id" element={<WebsiteLayout><ProjectPage /></WebsiteLayout>} />
        <Route path="/profile" element={<WebsiteLayout><RequireAuth><Profile /></RequireAuth></WebsiteLayout>} />
        <Route path="/forgot-password" element={<WebsiteLayout><ForgotPassword /></WebsiteLayout>} />
        <Route path="/reset-password" element={<WebsiteLayout><ResetPassword /></WebsiteLayout>} />
        <Route path="/certificate/:id" element={<RequireAuth><CertificatePage /></RequireAuth>} />
        <Route path="/verify" element={<WebsiteLayout><VerifyPage /></WebsiteLayout>} />
        <Route path="/verify/:number" element={<WebsiteLayout><VerifyPage /></WebsiteLayout>} />

        {/* ================= HALL OF FAME ================= */}

        <Route
          path="/hall-of-fame"
          element={
            <WebsiteLayout>
              <HallofFrme />
            </WebsiteLayout>
          }
        />

        {/* =====================================================
            ADMIN PANEL (admins only, login at /admin/login)
        ===================================================== */}

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminShell />}>
          <Route index element={<AdminOverview />} />
          <Route path="challenges" element={<AdminChallenges />} />
          <Route path="challenges/new" element={<AdminChallengeForm />} />
          <Route path="challenges/:id" element={<AdminChallengeForm key="edit" />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="registrations" element={<AdminRegistrations />} />
          <Route path="registrations/:id" element={<AdminRegistrationDetail />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="students/:id" element={<AdminStudentDetail />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="*" element={<AdminOverview />} />
        </Route>
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

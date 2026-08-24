import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Code, Mail } from "lucide-react";
import gsap from "gsap";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const activePage = location.pathname;

  /* =====================================================
     SCROLL DETECTION
  ===================================================== */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* =====================================================
     NAVBAR ENTRANCE
  ===================================================== */

  useEffect(() => {
    if (!navRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  /* =====================================================
     NAVBAR BACKGROUND
  ===================================================== */

  useEffect(() => {
    if (!navRef.current) return;

    if (scrolled) {
      gsap.to(navRef.current, {
        backgroundColor: "rgba(255, 255, 255, 0.88)",
        borderBottomColor: "rgba(226, 232, 240, 0.8)",
        boxShadow: "0 4px 25px rgba(15, 23, 42, 0.06)",
        duration: 0.35,
        ease: "power2.out",
      });
    } else {
      gsap.to(navRef.current, {
        backgroundColor: "rgba(255, 255, 255, 0)",
        borderBottomColor: "rgba(226, 232, 240, 0)",
        boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
        duration: 0.35,
        ease: "power2.out",
      });
    }
  }, [scrolled]);

  /* =====================================================
     NAVIGATION
  ===================================================== */

  const handleNavClick = (path) => {
    setIsOpen(false);

    navigate(path);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  /* =====================================================
     MOBILE MENU OPEN
  ===================================================== */

  useEffect(() => {
    if (!isOpen || !mobileMenuRef.current) return;

    gsap.fromTo(
      mobileMenuRef.current,
      {
        opacity: 0,
        y: -20,
        scaleY: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scaleY: 1,
        duration: 0.3,
        ease: "power2.out",
        transformOrigin: "top",
      },
    );
  }, [isOpen]);

  /* =====================================================
     MOBILE MENU CLOSE
  ===================================================== */

  const handleCloseMobileMenu = () => {
    if (!mobileMenuRef.current) {
      setIsOpen(false);
      return;
    }

    gsap.to(mobileMenuRef.current, {
      opacity: 0,
      y: -15,
      scaleY: 0.95,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        setIsOpen(false);
      },
    });
  };

  /* =====================================================
     NAV BUTTON CLASS
  ===================================================== */

  const desktopNavClass = (path) => `
    relative
    py-2
    transition-colors
    duration-300
    ${
      activePage === path
        ? "text-indigo-600"
        : "text-slate-600 hover:text-indigo-600"
    }
  `;

  const activeLineClass = (path) => `
    absolute
    bottom-0
    left-0
    h-[2px]
    rounded-full
    bg-indigo-600
    transition-all
    duration-300
    ${activePage === path ? "w-full opacity-100" : "w-0 opacity-0"}
  `;

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <header
      ref={navRef}
      className={`
        fixed
        top-0
        left-0
        z-50
        w-full
        border-b
        border-transparent
        bg-transparent
        transition-all
        duration-300
        ${scrolled ? "backdrop-blur-md" : ""}
      `}
    >
      {/* =====================================================
          NAVBAR CONTAINER
      ===================================================== */}

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* =================================================
            LOGO
        ================================================= */}

        <div
          onClick={() => handleNavClick("/")}
          className="group flex cursor-pointer items-center gap-3"
        >
          <div
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-indigo-600
              text-white
              shadow-md
              shadow-indigo-600/20
              transition-transform
              duration-300
              group-hover:scale-105
            "
          >
            <Code className="h-5 w-5" />
          </div>

          <span className="text-xl font-bold tracking-tight text-slate-900">
            HUBWEB
          </span>
        </div>

        {/* =================================================
            DESKTOP NAV
            ORDER:
            Home → About → Categories → Gallery → Expo → Hall
        ================================================= */}

        <nav className="hidden items-center gap-8 font-medium md:flex">
          {/* HOME */}

          <button
            onClick={() => handleNavClick("/")}
            className={desktopNavClass("/")}
          >
            Home
            <span className={activeLineClass("/")} />
          </button>

          {/* ABOUT */}

          <button
            onClick={() => handleNavClick("/about")}
            className={desktopNavClass("/about")}
          >
            About
            <span className={activeLineClass("/about")} />
          </button>

          {/* =================================================
              CATEGORIES
              DIRECTLY AFTER ABOUT
          ================================================= */}

          <button
            onClick={() => handleNavClick("/categories")}
            className={desktopNavClass("/categories")}
          >
            Categories
            <span className={activeLineClass("/categories")} />
          </button>

          {/* GALLERY */}

          <button
            onClick={() => handleNavClick("/features")}
            className={desktopNavClass("/features")}
          >
            Gallery
            <span className={activeLineClass("/features")} />
          </button>

          {/* EXPO 2026 */}

          <button
            onClick={() => handleNavClick("/upload")}
            className={desktopNavClass("/upload")}
          >
            Expo 2026
            <span className={activeLineClass("/upload")} />
          </button>

          {/* HALL OF FAME */}

          <button
            onClick={() => handleNavClick("/hall-of-fame")}
            className={desktopNavClass("/hall-of-fame")}
          >
            Hall of Fame
            <span className={activeLineClass("/hall-of-fame")} />
          </button>
        </nav>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="flex items-center gap-2 md:gap-4">
          {/* SOCIAL ICONS */}

          <div className="hidden items-center gap-1 sm:flex">
            {/* WHATSAPP */}

            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                text-slate-600
                transition-all
                duration-300
                hover:bg-green-50
                hover:text-green-600
                hover:scale-110
              "
              aria-label="WhatsApp"
            >
              <svg
                className="h-[20px] w-[20px] fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.16 5.335 5.495 0 12.05 0c3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </a>

            {/* INSTAGRAM */}

            <a
              href="https://instagram.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="
                group
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                text-slate-600
                transition-all
                duration-300
                hover:bg-pink-50
                hover:text-pink-600
                hover:scale-110
              "
              aria-label="Instagram"
            >
              <svg
                className="h-[20px] w-[20px] fill-current transition-transform duration-300 group-hover:scale-110"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* GMAIL */}

            <a
              href="mailto:yourmail@gmail.com"
              className="
                group
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                text-slate-600
                transition-all
                duration-300
                hover:bg-red-50
                hover:text-red-500
                hover:scale-110
              "
              aria-label="Email"
            >
              <Mail
                className="
                  h-[20px]
                  w-[20px]
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
                strokeWidth={2}
              />
            </a>
          </div>

          {/* MOBILE BUTTON */}

          <button
            onClick={() => (isOpen ? handleCloseMobileMenu() : setIsOpen(true))}
            className="
              rounded-lg
              p-2
              text-slate-700
              transition-colors
              hover:bg-slate-100
              md:hidden
            "
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* =====================================================
          MOBILE MENU
          ORDER:
          Home → About → Categories → Gallery → Expo → Hall
      ===================================================== */}

      {isOpen && (
        <div
          ref={mobileMenuRef}
          className="
            absolute
            left-0
            top-20
            flex
            w-full
            flex-col
            gap-1
            border-b
            border-slate-200
            bg-white/95
            px-6
            py-5
            shadow-xl
            backdrop-blur-xl
            md:hidden
          "
        >
          {/* HOME */}

          <button
            onClick={() => handleNavClick("/")}
            className={`w-full border-b border-slate-100 py-3 text-left font-medium ${
              activePage === "/" ? "text-indigo-600" : "text-slate-700"
            }`}
          >
            Home
          </button>

          {/* ABOUT */}

          <button
            onClick={() => handleNavClick("/about")}
            className={`w-full border-b border-slate-100 py-3 text-left font-medium ${
              activePage === "/about" ? "text-indigo-600" : "text-slate-700"
            }`}
          >
            About
          </button>

          {/* =================================================
              CATEGORIES
              DIRECTLY AFTER ABOUT
          ================================================= */}

          <button
            onClick={() => handleNavClick("/categories")}
            className={`w-full border-b border-slate-100 py-3 text-left font-medium ${
              activePage === "/categories"
                ? "text-indigo-600"
                : "text-slate-700"
            }`}
          >
            Categories
          </button>

          {/* GALLERY */}

          <button
            onClick={() => handleNavClick("/features")}
            className={`w-full border-b border-slate-100 py-3 text-left font-medium ${
              activePage === "/features" ? "text-indigo-600" : "text-slate-700"
            }`}
          >
            Gallery
          </button>

          {/* EXPO 2026 */}

          <button
            onClick={() => handleNavClick("/upload")}
            className={`w-full border-b border-slate-100 py-3 text-left font-medium ${
              activePage === "/upload" ? "text-indigo-600" : "text-slate-700"
            }`}
          >
            Expo 2026
          </button>

          {/* HALL OF FAME */}

          <button
            onClick={() => handleNavClick("/hall-of-fame")}
            className={`w-full border-b border-slate-100 py-3 text-left font-medium ${
              activePage === "/hall-of-fame"
                ? "text-indigo-600"
                : "text-slate-700"
            }`}
          >
            Hall of Fame
          </button>

          {/* =================================================
              MOBILE SOCIAL BUTTONS
          ================================================= */}

          <div className="flex items-center justify-center gap-3 border-t border-slate-100 pt-5">
            {/* WHATSAPP */}

            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex
                items-center
                gap-2
                rounded-xl
                bg-green-50
                px-4
                py-2
                text-xs
                font-semibold
                text-green-700
                transition-all
                hover:bg-green-100
              "
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.16 5.335 5.495 0 12.05 0c3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              WhatsApp
            </a>

            {/* INSTAGRAM */}

            <a
              href="https://instagram.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex
                items-center
                gap-2
                rounded-xl
                bg-pink-50
                px-4
                py-2
                text-xs
                font-semibold
                text-pink-600
                transition-all
                hover:bg-pink-100
              "
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Instagram
            </a>

            {/* GMAIL */}

            <a
              href="mailto:yourmail@gmail.com"
              className="
                flex
                items-center
                gap-2
                rounded-xl
                bg-red-50
                px-4
                py-2
                text-xs
                font-semibold
                text-red-600
                transition-all
                hover:bg-red-100
              "
            >
              <Mail className="h-4 w-4" />
              Gmail
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

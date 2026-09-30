import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
  MapPin,
  Mail,
  ArrowUpRight,
  Code2,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef(null);
  const spotlightRef = useRef(null);
  const orbRef = useRef(null);
  const svgRef = useRef(null);

  const navigate = useNavigate();

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const handlePageClick = (path) => {
    navigate(path);

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     FOOTER LINKS
  ========================================================= */

  const quickLinks = [
    {
      label: "Home",
      path: "/",
    },
    {
      label: "About",
      path: "/about",
    },
    {
      label: "Categories",
      path: "/categories",
    },
    {
      label: "Gallery",
      path: "/features",
    },
    {
      label: "Expo 2026",
      path: "/upload",
    },
    {
      label: "Hall of Fame",
      path: "/hall-of-fame",
    },
  ];

  /* =========================================================
     FOOTER ANIMATION
  ========================================================= */

  useEffect(() => {
    const footer = footerRef.current;
    const spotlight = spotlightRef.current;
    const orb = orbRef.current;
    const svg = svgRef.current;

    if (!footer) return;

    const ctx = gsap.context(() => {
      /* =====================================================
         INITIAL STATES
      ===================================================== */

      gsap.set(".footer-reveal", {
        opacity: 0,
        y: 35,
      });

      gsap.set(".footer-line", {
        scaleX: 0,
        transformOrigin: "left center",
      });

      gsap.set(".footer-card", {
        opacity: 0,
        y: 25,
        rotateX: 4,
      });

      gsap.set(".footer-logo", {
        opacity: 0,
        scale: 0.8,
        rotate: -8,
      });

      gsap.set(".footer-nav-item", {
        opacity: 0,
        x: -15,
      });

      gsap.set(".footer-orbit", {
        opacity: 0,
        scale: 0.7,
      });

      /* =====================================================
         MAIN SCROLL REVEAL
      ===================================================== */

      const mainTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: footer,
          start: "top 85%",
          once: true,
        },
      });

      mainTimeline

        .to(".footer-reveal", {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power4.out",
        })

        .to(
          ".footer-logo",
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.7,
            ease: "back.out(1.7)",
          },
          "-=0.6",
        )

        .to(
          ".footer-line",
          {
            scaleX: 1,
            duration: 1,
            ease: "power4.out",
          },
          "-=0.5",
        )

        .to(
          ".footer-nav-item",
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.05,
            ease: "power3.out",
          },
          "-=0.6",
        )

        .to(
          ".footer-card",
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power4.out",
          },
          "-=0.5",
        )

        .to(
          ".footer-orbit",
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
          },
          "-=0.6",
        );

      /* =====================================================
         SVG BACKGROUND ANIMATION
      ===================================================== */

      if (svg) {
        gsap.to(".svg-orbit-1", {
          rotation: 360,
          duration: 18,
          repeat: -1,
          ease: "none",
          transformOrigin: "center center",
        });

        gsap.to(".svg-orbit-2", {
          rotation: -360,
          duration: 25,
          repeat: -1,
          ease: "none",
          transformOrigin: "center center",
        });

        gsap.to(".svg-dot", {
          opacity: 0.25,
          scale: 0.65,
          duration: 1.6,
          repeat: -1,
          yoyo: true,
          stagger: 0.15,
          ease: "sine.inOut",
        });

        gsap.to(".svg-path", {
          strokeDashoffset: 0,
          duration: 3,
          ease: "power3.inOut",
        });
      }

      /* =====================================================
         MOUSE SPOTLIGHT
      ===================================================== */

      const handleMouseMove = (event) => {
        const rect = footer.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (spotlight) {
          gsap.to(spotlight, {
            x,
            y,
            duration: 0.45,
            ease: "power3.out",
          });
        }

        if (orb) {
          gsap.to(orb, {
            x: (event.clientX / window.innerWidth - 0.5) * 35,

            y: (event.clientY / window.innerHeight - 0.5) * 35,

            duration: 1,

            ease: "power3.out",
          });
        }
      };

      footer.addEventListener("mousemove", handleMouseMove);

      /* =====================================================
         MAGNETIC BUTTONS
      ===================================================== */

      const magneticItems = footer.querySelectorAll(".magnetic-item");

      const magneticHandlers = [];

      magneticItems.forEach((item) => {
        const move = (event) => {
          const rect = item.getBoundingClientRect();

          const x = event.clientX - (rect.left + rect.width / 2);

          const y = event.clientY - (rect.top + rect.height / 2);

          gsap.to(item, {
            x: x * 0.18,
            y: y * 0.18,
            duration: 0.35,
            ease: "power3.out",
          });
        };

        const leave = () => {
          gsap.to(item, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.5)",
          });
        };

        item.addEventListener("mousemove", move);

        item.addEventListener("mouseleave", leave);

        magneticHandlers.push({
          item,
          move,
          leave,
        });
      });

      return () => {
        footer.removeEventListener("mousemove", handleMouseMove);

        magneticHandlers.forEach(({ item, move, leave }) => {
          item.removeEventListener("mousemove", move);

          item.removeEventListener("mouseleave", leave);
        });
      };
    }, footer);

    return () => {
      ctx.revert();
    };
  }, []);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <footer
      ref={footerRef}
      className="
        relative
        overflow-hidden
        border-t
        border-slate-200
        bg-[#f7f7f5]
        text-slate-800
      "
    >
      {/* =====================================================
          SPOTLIGHT
      ===================================================== */}

      <div
        ref={spotlightRef}
        className="
          pointer-events-none
          absolute
          z-[1]
          h-[300px]
          w-[300px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          opacity-70
        "
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0.045) 35%, transparent 70%)",
        }}
      />

      {/* =====================================================
          SVG BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <svg
          ref={svgRef}
          viewBox="0 0 1200 700"
          className="
            absolute
            right-[-180px]
            top-[-100px]
            h-[650px]
            w-[800px]
            opacity-60
          "
          fill="none"
        >
          <g className="svg-orbit-1">
            <circle
              cx="900"
              cy="260"
              r="220"
              stroke="rgba(99,102,241,0.09)"
              strokeWidth="1"
            />

            <circle
              cx="900"
              cy="260"
              r="160"
              stroke="rgba(99,102,241,0.12)"
              strokeWidth="1"
              strokeDasharray="5 10"
            />

            <circle
              cx="900"
              cy="260"
              r="95"
              stroke="rgba(99,102,241,0.14)"
              strokeWidth="1"
              strokeDasharray="2 8"
            />
          </g>

          <g className="svg-orbit-2">
            <ellipse
              cx="900"
              cy="260"
              rx="300"
              ry="115"
              stroke="rgba(15,23,42,0.06)"
              strokeWidth="1"
            />

            <ellipse
              cx="900"
              cy="260"
              rx="240"
              ry="85"
              stroke="rgba(15,23,42,0.05)"
              strokeWidth="1"
            />
          </g>

          <path
            className="svg-path"
            d="M 580 540 C 690 470 720 390 820 350 C 920 310 1030 390 1130 250"
            stroke="rgba(99,102,241,0.18)"
            strokeWidth="1"
            strokeDasharray="5 8"
            strokeDashoffset="700"
          />

          <circle
            className="svg-dot"
            cx="900"
            cy="40"
            r="4"
            fill="rgba(99,102,241,0.45)"
          />

          <circle
            className="svg-dot"
            cx="1060"
            cy="180"
            r="3"
            fill="rgba(99,102,241,0.35)"
          />

          <circle
            className="svg-dot"
            cx="760"
            cy="340"
            r="4"
            fill="rgba(99,102,241,0.35)"
          />

          <circle
            className="svg-dot"
            cx="1110"
            cy="390"
            r="3"
            fill="rgba(99,102,241,0.3)"
          />

          <circle
            className="svg-dot"
            cx="830"
            cy="500"
            r="3"
            fill="rgba(99,102,241,0.3)"
          />
        </svg>

        {/* GRID */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.38]
          "
          style={{
            backgroundImage: `
              linear-gradient(rgba(15,23,42,0.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(15,23,42,0.035) 1px, transparent 1px)
            `,

            backgroundSize: "60px 60px",
          }}
        />

        {/* GLOWS */}

        <div
          className="
            absolute
            -left-40
            -top-40
            h-[400px]
            w-[400px]
            rounded-full
            bg-indigo-500/[0.055]
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-60
            -right-40
            h-[500px]
            w-[500px]
            rounded-full
            bg-violet-500/[0.045]
            blur-3xl
          "
        />
      </div>

      {/* =====================================================
          MAIN FOOTER
      ===================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
          px-5
          py-8
          sm:px-6
          lg:px-8
        "
      >
        <div
          className="
            relative
            overflow-hidden
            rounded-[28px]
            border
            border-slate-200/80
            bg-white/80
            shadow-[0_20px_60px_rgba(15,23,42,0.06)]
            backdrop-blur-2xl
          "
        >
          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* =================================================
                BRAND
            ================================================= */}

            <div
              className="
                border-b
                border-slate-200
                p-6
                sm:p-8
                lg:col-span-4
                lg:border-b-0
                lg:border-r
                lg:p-8
              "
            >
              <div className="flex h-full flex-col justify-between gap-6">
                <div>
                  {/* LOGO */}

                  <div className="mb-5 flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handlePageClick("/")}
                      className="
                        footer-logo
                        magnetic-item
                        relative
                        flex
                        h-10
                        w-10
                        cursor-pointer
                        items-center
                        justify-center
                        rounded-xl
                        bg-indigo-600
                        text-white
                        shadow-lg
                      "
                    >
                      <Code2 className="h-5 w-5" />

                      <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-indigo-400" />
                    </button>

                    <div className="footer-reveal">
                      <button
                        type="button"
                        onClick={() => handlePageClick("/")}
                        className="text-base font-black tracking-tight text-slate-950"
                      >
                        DEVNEX
                      </button>

                      <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-600">
                        Built For Students Who Build
                      </div>
                    </div>
                  </div>

                  <div className="footer-line mb-5 h-px bg-slate-200" />

                  {/* SUPPORT */}

                  <div className="footer-reveal">
                    <div className="mb-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                      Support
                    </div>

                    <div className="space-y-2 text-xs">
                      {/* WHATSAPP */}

                      <a
                        href="https://wa.me/919999999999"
                        target="_blank"
                        rel="noreferrer"
                        className="
                          magnetic-item
                          group
                          flex
                          items-center
                          gap-3
                          text-slate-600
                          transition-colors
                          hover:text-green-600
                        "
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 transition-all duration-300 group-hover:scale-110 group-hover:bg-green-50">
                          <MessageCircle className="h-4 w-4 text-green-600" />
                        </span>

                        <span>WhatsApp Support</span>
                      </a>

                      {/* INSTAGRAM */}

                      <a
                        href="https://instagram.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="
                          magnetic-item
                          group
                          flex
                          items-center
                          gap-3
                          text-slate-600
                          transition-colors
                          hover:text-pink-600
                        "
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 transition-all duration-300 group-hover:scale-110 group-hover:bg-pink-50">
                          <InstagramIcon />
                        </span>

                        <span>Instagram</span>
                      </a>

                      {/* EMAIL */}

                      <a
                        href="mailto:hello@devnex.in"
                        className="
                          magnetic-item
                          group
                          flex
                          items-center
                          gap-3
                          text-slate-600
                          transition-colors
                          hover:text-indigo-600
                        "
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-50">
                          <Mail className="h-4 w-4 text-indigo-600" />
                        </span>

                        <span>hello@devnex.in</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* STATUS */}

                <div
                  className="
                    footer-reveal
                    magnetic-item
                    inline-flex
                    w-fit
                    cursor-default
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-slate-200
                    bg-slate-50/80
                    px-3
                    py-2
                  "
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />

                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                  </span>

                  <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-500">
                    Student Project Platform
                  </span>
                </div>
              </div>
            </div>

            {/* =================================================
                NAVIGATION
            ================================================= */}

            <div
              className="
                border-b
                border-slate-200
                p-6
                sm:p-8
                lg:col-span-3
                lg:border-b-0
                lg:border-r
                lg:p-8
              "
            >
              <div className="footer-reveal mb-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Navigation
              </div>

              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={link.label} className="footer-nav-item">
                    <button
                      type="button"
                      onClick={() => handlePageClick(link.path)}
                      className="
                          magnetic-item
                          group
                          relative
                          flex
                          w-full
                          items-center
                          justify-between
                          py-1.5
                          text-left
                          text-xs
                          font-semibold
                          text-slate-700
                          transition-colors
                          hover:text-indigo-600
                        "
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-mono text-[9px] text-slate-300 transition-colors group-hover:text-indigo-400">
                          0{index + 1}
                        </span>

                        <span>{link.label}</span>
                      </span>

                      <ArrowUpRight
                        className="
                            h-3.5
                            w-3.5
                            -translate-x-2
                            translate-y-1
                            opacity-0
                            transition-all
                            duration-300
                            group-hover:translate-x-0
                            group-hover:translate-y-0
                            group-hover:opacity-100
                          "
                      />

                      <span
                        className="
                            absolute
                            bottom-0
                            left-0
                            h-px
                            w-0
                            bg-indigo-500
                            transition-all
                            duration-500
                            group-hover:w-full
                          "
                      />
                    </button>
                  </li>
                ))}
              </ul>

              <div className="footer-reveal mt-6 border-t border-slate-200 pt-4">
                <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
                  Project First
                </div>
              </div>
            </div>

            {/* =================================================
                ADDRESS
            ================================================= */}

            <div className="p-6 sm:p-8 lg:col-span-5 lg:p-8">
              <div className="flex h-full flex-col justify-center">
                <div>
                  <div className="footer-reveal mb-4 inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-indigo-600" />

                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-indigo-600">
                      Headquarters
                    </span>
                  </div>

                  <h3
                    className="
                      footer-reveal
                      max-w-md
                      text-2xl
                      font-black
                      leading-[1.2]
                      tracking-[-0.03em]
                      text-slate-950
                      sm:text-3xl
                      lg:text-4xl
                    "
                  >
                    ITP Road,
                    <br />
                    Whitefield,
                    <br />
                    <span className="text-xl text-slate-500 sm:text-2xl">
                      Bangalore,
                      <br />
                      Karnataka - 560066,
                      <br />
                      India
                    </span>
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              BOTTOM BAR
          ================================================= */}

          <div className="border-t border-slate-200 bg-slate-50/70 px-6 py-4 sm:px-8 lg:px-8">
            <div className="footer-reveal flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
              <div className="flex shrink-0 items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />

                <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-600">
                  DEVNEX
                </span>
              </div>

              <div className="hidden h-3 w-px bg-slate-300 md:block" />

              <p className="text-[11px] leading-4 text-slate-500">
                Don't just tell people what you know. Show them what you built.
              </p>
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}

        <div className="mt-4 flex flex-col items-center justify-between gap-2 px-2 sm:flex-row">
          <p className="footer-reveal text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
            © 2026 DEVNEX
          </p>

          <p className="footer-reveal text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
            Bangalore · Karnataka · India
          </p>
        </div>
      </div>

      {/* FLOATING ORB */}

      <div
        ref={orbRef}
        className="
          footer-orbit
          pointer-events-none
          absolute
          bottom-8
          right-[5%]
          hidden
          h-1.5
          w-1.5
          rounded-full
          bg-indigo-500
          shadow-[0_0_20px_rgba(99,102,241,0.55)]
          lg:block
        "
      />
    </footer>
  );
}

/* =========================================================
   INSTAGRAM ICON
========================================================= */

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4 text-pink-600"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />

      <circle cx="12" cy="12" r="4" />

      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

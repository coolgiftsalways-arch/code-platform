import { useEffect, useRef } from "react";
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

export default function Footer({ setCurrentPage }) {
  const footerRef = useRef(null);
  const spotlightRef = useRef(null);
  const orbRef = useRef(null);
  const svgRef = useRef(null);

  const handlePageClick = (page) => {
    if (setCurrentPage) {
      setCurrentPage(page);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const quickLinks = [
    { label: "Home", page: "Hero" },
    { label: "About", page: "about" },
    { label: "Categories", page: "categories" },
    { label: "Gallery", page: "features" },
    { label: "Expo 2026", page: "Expo" },
    { label: "Projects", page: "Projects" },
  ];

  useEffect(() => {
    const footer = footerRef.current;
    const spotlight = spotlightRef.current;
    const orb = orbRef.current;
    const svg = svgRef.current;

    if (!footer) return;

    const ctx = gsap.context(() => {
      /* =========================================================
         INITIAL STATES
      ========================================================= */
      gsap.set(".footer-reveal", { opacity: 0, y: 35 });
      gsap.set(".footer-line", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".footer-card", { opacity: 0, y: 25, rotateX: 4 });
      gsap.set(".footer-logo", { opacity: 0, scale: 0.8, rotate: -8 });
      gsap.set(".footer-nav-item", { opacity: 0, x: -15 });
      gsap.set(".footer-orbit", { opacity: 0, scale: 0.7 });

      /* =========================================================
         MAIN SCROLL REVEAL
      ========================================================= */
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
          { scaleX: 1, duration: 1, ease: "power4.out" },
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

      /* =========================================================
         SVG BACKGROUND ANIMATION
      ========================================================= */
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

      /* =========================================================
         MOUSE SPOTLIGHT
      ========================================================= */
      const handleMouseMove = (event) => {
        const rect = footer.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (spotlight)
          gsap.to(spotlight, { x, y, duration: 0.45, ease: "power3.out" });
        if (orb)
          gsap.to(orb, {
            x: (event.clientX / window.innerWidth - 0.5) * 35,
            y: (event.clientY / window.innerHeight - 0.5) * 35,
            duration: 1,
            ease: "power3.out",
          });
      };

      footer.addEventListener("mousemove", handleMouseMove);

      /* =========================================================
         MAGNETIC BUTTONS
      ========================================================= */
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
        const leave = () =>
          gsap.to(item, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.5)",
          });

        item.addEventListener("mousemove", move);
        item.addEventListener("mouseleave", leave);
        magneticHandlers.push({ item, move, leave });
      });

      /* =========================================================
         CLEANUP
      ========================================================= */
      return () => {
        footer.removeEventListener("mousemove", handleMouseMove);
        magneticHandlers.forEach(({ item, move, leave }) => {
          item.removeEventListener("mousemove", move);
          item.removeEventListener("mouseleave", leave);
        });
      };
    }, footer);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-[#f7f7f5] text-slate-800 border-t border-slate-200"
    >
      {/* SPOTLIGHT */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute z-[1] w-[300px] h-[300px] rounded-full -translate-x-1/2 -translate-y-1/2 opacity-70"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0.045) 35%, transparent 70%)",
        }}
      />

      {/* SVG BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <svg
          ref={svgRef}
          viewBox="0 0 1200 700"
          className="absolute right-[-180px] top-[-100px] w-[800px] h-[650px] opacity-60"
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
          className="absolute inset-0 opacity-[0.38]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(15,23,42,0.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(15,23,42,0.035) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* GLOWS */}
        <div className="absolute -top-40 -left-40 w-[400px] h-[400px] rounded-full bg-indigo-500/[0.055] blur-3xl" />
        <div className="absolute -bottom-60 -right-40 w-[500px] h-[500px] rounded-full bg-violet-500/[0.045] blur-3xl" />
      </div>

      {/* MAIN LAYOUT */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8">
        <div className="relative rounded-[28px] border border-slate-200/80 bg-white/80 backdrop-blur-2xl shadow-[0_20px_60px_rgba(15,23,42,0.06)] overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* BRAND */}
            <div className="lg:col-span-4 p-6 sm:p-8 lg:p-8 border-b lg:border-b-0 lg:border-r border-slate-200">
              <div className="flex flex-col h-full justify-between gap-6">
                <div>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="footer-logo magnetic-item relative w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center shadow-lg cursor-pointer">
                      <Code2 className="w-5 h-5" />
                      <span className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 border-2 border-white" />
                      <span className="absolute inset-0 rounded-xl border border-white/10" />
                    </div>
                    <div className="footer-reveal">
                      <div className="text-base font-black tracking-tight text-slate-950">
                        WebHub
                      </div>
                      <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-600">
                        Season 01 Archive
                      </div>
                    </div>
                  </div>

                  <div className="footer-line h-px bg-slate-200 mb-5" />

                  <div className="space-y-4">
                    

                    <div className="footer-reveal">
                      <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-2">
                        Support
                      </div>
                      <div className="space-y-2 text-xs">
                        <a
                          href="https://wa.me/919999999999"
                          target="_blank"
                          rel="noreferrer"
                          className="magnetic-item group flex items-center gap-3 text-slate-600 hover:text-green-600 transition-colors"
                        >
                          <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-green-50 group-hover:scale-110 transition-all duration-300">
                            <MessageCircle className="w-4 h-4 text-green-600" />
                          </span>
                          <span>WhatsApp Support</span>
                        </a>
                        <a
                          href="https://instagram.com/"
                          target="_blank"
                          rel="noreferrer"
                          className="magnetic-item group flex items-center gap-3 text-slate-600 hover:text-pink-600 transition-colors"
                        >
                          <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-pink-50 group-hover:scale-110 transition-all duration-300">
                            <InstagramIcon />
                          </span>
                          <span>Instagram</span>
                        </a>
                        <a
                          href="mailto:hello@ahmedkhan.dev"
                          className="magnetic-item group flex items-center gap-3 text-slate-600 hover:text-indigo-600 transition-colors"
                        >
                          <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-indigo-50 group-hover:scale-110 transition-all duration-300">
                            <Mail className="w-4 h-4 text-indigo-600" />
                          </span>
                          <span>hello@ahmedkhan.dev</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="footer-reveal magnetic-item inline-flex items-center gap-2 w-fit rounded-full border border-slate-200 bg-slate-50/80 px-3 py-2 cursor-default">
                  <span className="relative flex w-1.5 h-1.5">
                    <span className="absolute inline-flex w-full h-full rounded-full bg-green-400 opacity-60 animate-ping" />
                    <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-green-500" />
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-500">
                    Available for Work
                  </span>
                </div>
              </div>
            </div>

            {/* NAVIGATION */}
            <div className="lg:col-span-3 p-6 sm:p-8 lg:p-8 border-b lg:border-b-0 lg:border-r border-slate-200">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5 footer-reveal">
                Navigation
              </div>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={link.label} className="footer-nav-item">
                    <button
                      type="button"
                      onClick={() => handlePageClick(link.page)}
                      className="magnetic-item group relative flex items-center justify-between w-full text-left py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-[9px] font-mono text-slate-300 group-hover:text-indigo-400 transition-colors">
                          0{index + 1}
                        </span>
                        <span>{link.label}</span>
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-indigo-500 group-hover:w-full transition-all duration-500" />
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t border-slate-200 footer-reveal">
                <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  Verified Code
                </div>
              </div>
            </div>

            {/* ADDRESS SECTION (Replaced Contact) */}
            <div className="lg:col-span-5 p-6 sm:p-8 lg:p-8">
              <div className="h-full flex flex-col justify-center">
                <div>
                  <div className="inline-flex items-center gap-2 mb-4 footer-reveal">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-indigo-600">
                      Headquarters
                    </span>
                  </div>

                  <h3 className="footer-reveal max-w-md text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.03em] leading-[1.2] text-slate-950">
                    ITPI Road, Whitefield
                    <br />
                    <span className="text-slate-500 text-xl sm:text-2xl">
                      Bangalore, Karnataka
                    </span>
                    <br />
                    <span className="relative inline-block text-indigo-600 text-lg sm:text-xl mt-1">
                      PIN 560066, India
                      <svg
                        className="absolute left-0 -bottom-2 w-full h-2.5 overflow-visible"
                        viewBox="0 0 260 12"
                        fill="none"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M2 8 C55 2, 110 11, 160 5 C200 1, 230 7, 258 3"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          opacity="0.35"
                          strokeDasharray="4 5"
                        />
                      </svg>
                    </span>
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* VERIFICATION BAR */}
          <div className="border-t border-slate-200 bg-slate-50/70 px-6 sm:px-8 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 footer-reveal">
              <div className="flex items-center gap-2 flex-shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-600">
                  Code Quality Disclaimer
                </span>
              </div>
              <div className="hidden md:block w-px h-3 bg-slate-300" />
              <p className="text-[11px] leading-4 text-slate-500">
                All full-stack architectures and UI components are built with
                scalable, clean-code practices.
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-4 px-2">
          <p className="footer-reveal text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
            © 2026 Ahmed Khan · WebHub
          </p>
          <p className="footer-reveal text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
            Maharashtra · India
          </p>
        </div>
      </div>

      {/* FLOATING ORB */}
      <div
        ref={orbRef}
        className="footer-orbit pointer-events-none absolute bottom-8 right-[5%] hidden lg:block w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.55)]"
      />
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className="w-4 h-4 text-pink-600"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

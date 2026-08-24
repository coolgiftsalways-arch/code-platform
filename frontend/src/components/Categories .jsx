import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  Code,
  Zap,
  ArrowRight,
  Cpu,
  Layers,
  Terminal,
  Smartphone,
  Lock,
  Gamepad2,
  Sparkles,
  ExternalLink,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function CategoriesPage({ setCurrentPage }) {
  const pageRef = useRef(null);
  const heroCardRef = useRef(null);
  const gridRef = useRef(null);
  const spotlightRef = useRef(null);
  const ctaRef = useRef(null);

  /* =====================================================
     GSAP + SCROLLTRIGGER
  ===================================================== */

  useEffect(() => {
    const page = pageRef.current;

    if (!page) return;

    const ctx = gsap.context(() => {
      /* HERO */

      const heroTimeline = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      heroTimeline
        .from(".categories-badge", {
          opacity: 0,
          y: 25,
          duration: 0.6,
        })
        .from(
          ".categories-title-line",
          {
            opacity: 0,
            y: 55,
            rotateX: -12,
            duration: 0.8,
            stagger: 0.1,
          },
          "-=0.25",
        )
        .from(
          ".categories-description",
          {
            opacity: 0,
            y: 20,
            duration: 0.6,
          },
          "-=0.4",
        )
        .from(
          ".categories-stats",
          {
            opacity: 0,
            y: 20,
            duration: 0.5,
          },
          "-=0.35",
        )
        .from(
          ".categories-hero-card",
          {
            opacity: 0,
            y: 45,
            scale: 0.96,
            duration: 0.9,
          },
          "-=0.55",
        );

      /* HERO FLOAT */

      if (heroCardRef.current) {
        gsap.to(heroCardRef.current, {
          y: -8,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      /* SECTION REVEALS */

      gsap.utils.toArray(".category-section-reveal").forEach((section) => {
        gsap.from(section, {
          opacity: 0,
          y: 60,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            once: true,
          },
        });
      });

      /* PRIMARY CARDS */

      if (gridRef.current) {
        gsap.from(gridRef.current.children, {
          opacity: 0,
          y: 65,
          scale: 0.96,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            once: true,
          },
        });
      }

      /* SPECIAL CARDS */

      gsap.utils.toArray(".special-card").forEach((card, index) => {
        gsap.from(card, {
          opacity: 0,
          y: 50,
          scale: 0.97,
          duration: 0.75,
          delay: index * 0.04,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            once: true,
          },
        });
      });

      /* SPOTLIGHT */

      if (spotlightRef.current) {
        gsap.from(spotlightRef.current, {
          opacity: 0,
          scale: 0.95,
          y: 50,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: spotlightRef.current,
            start: "top 82%",
            once: true,
          },
        });
      }

      /* CTA */

      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          opacity: 0,
          y: 55,
          scale: 0.98,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 84%",
            once: true,
          },
        });
      }

      /* CARD HOVER */

      const cards = gsap.utils.toArray(".interactive-card");

      cards.forEach((card) => {
        const icon = card.querySelector(".card-icon");
        const arrow = card.querySelector(".card-arrow");

        const enter = () => {
          gsap.to(card, {
            y: -8,
            duration: 0.35,
            ease: "power3.out",
          });

          if (icon) {
            gsap.to(icon, {
              scale: 1.08,
              rotate: 4,
              duration: 0.35,
              ease: "power3.out",
            });
          }

          if (arrow) {
            gsap.to(arrow, {
              x: 5,
              duration: 0.35,
              ease: "power3.out",
            });
          }
        };

        const leave = () => {
          gsap.to(card, {
            y: 0,
            duration: 0.4,
            ease: "power3.out",
          });

          if (icon) {
            gsap.to(icon, {
              scale: 1,
              rotate: 0,
              duration: 0.4,
              ease: "power3.out",
            });
          }

          if (arrow) {
            gsap.to(arrow, {
              x: 0,
              duration: 0.4,
              ease: "power3.out",
            });
          }
        };

        card.addEventListener("mouseenter", enter);
        card.addEventListener("mouseleave", leave);

        card._enter = enter;
        card._leave = leave;
      });
    }, page);

    /* MOUSE PARALLAX */

    const handleMouseMove = (event) => {
      const rect = page.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const percentX = x / rect.width - 0.5;
      const percentY = y / rect.height - 0.5;

      gsap.to(".background-grid", {
        x: percentX * 18,
        y: percentY * 18,
        duration: 1.2,
        ease: "power3.out",
        overwrite: true,
      });

      gsap.to(".mouse-glow", {
        x,
        y,
        duration: 0.6,
        ease: "power2.out",
        overwrite: true,
      });
    };

    page.addEventListener("mousemove", handleMouseMove);

    return () => {
      page.removeEventListener("mousemove", handleMouseMove);

      gsap.utils.toArray(".interactive-card").forEach((card) => {
        if (card._enter) {
          card.removeEventListener("mouseenter", card._enter);
        }

        if (card._leave) {
          card.removeEventListener("mouseleave", card._leave);
        }
      });

      ctx.revert();
    };
  }, []);

  /* =====================================================
     SUBMIT NAVIGATION
     
     IMPORTANT:
     App.jsx has /upload
     App.jsx does NOT have /submit
  ===================================================== */

  const goToSubmit = () => {
    if (setCurrentPage) {
      setCurrentPage("Upload");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    // FIX: send user to Upload page
    window.location.href = "/upload";
  };

  return (
    <main
      ref={pageRef}
      className="
        relative
        min-h-screen
        w-full
        overflow-x-hidden
        bg-[#f8f9fb]
        pb-32
        text-slate-900
      "
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="
            background-grid
            absolute
            -inset-32
            opacity-[0.38]
            bg-[radial-gradient(#6366f1_1px,transparent_1px)]
            [background-size:42px_42px]
          "
        />

        <div
          className="
            mouse-glow
            absolute
            left-0
            top-0
            h-[520px]
            w-[520px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-indigo-500/10
            blur-[110px]
          "
        />

        <div
          className="
            absolute
            -right-40
            top-20
            h-[500px]
            w-[500px]
            rounded-full
            bg-purple-500/10
            blur-[120px]
          "
        />

        <div
          className="
            absolute
            bottom-0
            -left-40
            h-[450px]
            w-[450px]
            rounded-full
            bg-blue-500/10
            blur-[120px]
          "
        />
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
          px-6
          pt-4
          sm:px-8
          sm:pt-6
          lg:px-12
        "
      >
        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="flex items-center py-6 sm:py-8 lg:py-10">
          <div
            className="
              grid
              w-full
              grid-cols-1
              items-center
              gap-12
              lg:grid-cols-12
              lg:gap-8
            "
          >
            {/* LEFT */}

            <div className="lg:col-span-7">
              <div
                className="
                  categories-badge
                  mb-6
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-indigo-200
                  bg-white/90
                  px-4
                  py-2
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-indigo-700
                  shadow-sm
                  backdrop-blur-xl
                  sm:text-xs
                "
              >
                <Layers className="h-4 w-4" />

                <span>Season 01 Competition Tracks</span>

                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />

                <span className="text-slate-400">2026</span>
              </div>

              <h1
                className="
                  overflow-visible
                  text-[clamp(2.5rem,5vw,5.2rem)]
                  font-black
                  leading-[0.92]
                  tracking-[-0.06em]
                  text-slate-950
                "
              >
                <span className="categories-title-line block">Choose Your</span>

                <span className="categories-title-line block">Domain.</span>

                <span className="categories-title-line block text-indigo-600">
                  Build Your
                </span>

                <span className="categories-title-line block">Solution.</span>

                <span className="categories-title-line block">
                  Win Category Prizes.
                </span>
              </h1>

              <p
                className="
                  categories-description
                  mt-6
                  max-w-2xl
                  text-sm
                  leading-6
                  text-slate-500
                  sm:text-base
                  sm:leading-7
                "
              >
                Projects are evaluated within specific categories to ensure fair
                judging against technical peers. Submit existing projects or
                build fresh for Season 01.
              </p>

              <div
                className="
                  categories-stats
                  mt-6
                  flex
                  flex-wrap
                  items-center
                  gap-x-7
                  gap-y-3
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-slate-400
                  sm:text-xs
                "
              >
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  04 Primary Tracks
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-purple-500" />
                  04 Special Tracks
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Free Submission
                </div>
              </div>
            </div>

            {/* RIGHT */}

            <div className="flex w-full justify-center lg:col-span-5 lg:justify-end">
              <div
                ref={heroCardRef}
                className="
                  categories-hero-card
                  relative
                  w-full
                  max-w-[440px]
                  rounded-[2rem]
                  border
                  border-slate-800
                  bg-[#10131a]
                  p-6
                  text-white
                  shadow-[0_35px_90px_rgba(15,23,42,0.22)]
                  sm:p-8
                  lg:max-w-none
                "
              >
                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-24
                    -top-24
                    h-72
                    w-72
                    rounded-full
                    bg-indigo-500/30
                    blur-[80px]
                  "
                />

                <div
                  className="
                    pointer-events-none
                    absolute
                    -bottom-32
                    -left-20
                    h-72
                    w-72
                    rounded-full
                    bg-purple-500/20
                    blur-[90px]
                  "
                />

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    opacity-[0.08]
                    bg-[linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)]
                    [background-size:34px_34px]
                  "
                />

                <div className="relative z-10">
                  <div className="mb-6 flex items-center justify-between">
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/10
                        backdrop-blur-md
                      "
                    >
                      <Sparkles className="h-5 w-5 text-indigo-300" />
                    </div>

                    <span
                      className="
                        rounded-full
                        border
                        border-indigo-400/20
                        bg-indigo-500/10
                        px-3
                        py-1.5
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-widest
                        text-indigo-300
                      "
                    >
                      Sponsor Feature
                    </span>
                  </div>

                  <div className="mb-3">
                    <p
                      className="
                        mb-1.5
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.25em]
                        text-slate-500
                      "
                    >
                      Track Highlight
                    </p>

                    <h2
                      className="
                        max-w-md
                        text-2xl
                        font-black
                        leading-[1.05]
                        tracking-tight
                        sm:text-3xl
                      "
                    >
                      Official Domain Tracks
                    </h2>
                  </div>

                  <p
                    className="
                      max-w-md
                      text-xs
                      leading-5
                      text-slate-400
                      sm:text-sm
                      sm:leading-6
                    "
                  >
                    Every submission enters a category-specific evaluation
                    pipeline designed to compare technical peers fairly.
                  </p>

                  <div className="mt-5 space-y-2">
                    <MiniFeature
                      number="01"
                      title="Technical Evaluation"
                      text="Judged against relevant technical peers."
                    />

                    <MiniFeature
                      number="02"
                      title="Category Recognition"
                      text="Stand out inside your strongest domain."
                    />

                    <MiniFeature
                      number="03"
                      title="Sponsor Visibility"
                      text="Get discovered by hiring partners."
                    />
                  </div>

                  <div className="mt-5 border-t border-white/10 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-medium text-slate-500">
                        SEASON 01
                      </span>

                      <span className="flex items-center gap-2 text-[10px] font-bold text-emerald-400">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />

                          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        Submission Open
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            PRIMARY TRACKS
        ===================================================== */}

        <section className="category-section-reveal space-y-8 py-16">
          <div
            className="
              flex
              flex-col
              justify-between
              gap-6
              border-b
              border-slate-200
              pb-6
              md:flex-row
              md:items-end
            "
          >
            <div>
              <p
                className="
                  mb-2
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.25em]
                  text-indigo-600
                "
              >
                Core Divisions
              </p>

              <h2
                className="
                  text-3xl
                  font-black
                  tracking-[-0.04em]
                  text-slate-950
                  sm:text-4xl
                "
              >
                Explore what students build.
              </h2>
            </div>

            <p
              className="
                max-w-md
                text-sm
                leading-6
                text-slate-500
                md:text-right
              "
            >
              Discover primary competition tracks open for all verified student
              developers across Mumbai & MMR.
            </p>
          </div>

          <div ref={gridRef} className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <TrackCard
              number="01"
              badge="High Volume"
              title="Web & Full-Stack Development"
              icon={<Code className="h-6 w-6" />}
              iconStyle="bg-indigo-50 text-indigo-600"
              accent="text-indigo-600"
              tags="React.js • Next.js • Node.js • Python/Django"
              description="E-commerce engines, web portals, social platforms, and full-stack web applications."
              evaluation="Architecture & UI"
            />

            <TrackCard
              number="02"
              badge="Sponsored"
              title="AI & Machine Learning"
              icon={<Cpu className="h-6 w-6" />}
              iconStyle="bg-purple-50 text-purple-600"
              accent="text-purple-600"
              tags="OpenAI API • PyTorch • Computer Vision • LLMs"
              description="Smart bots, automated workflow tools, predictive models, and generative AI integrations."
              evaluation="Model Utility"
            />

            <TrackCard
              number="03"
              badge="High Growth"
              title="Mobile Application Development"
              icon={<Smartphone className="h-6 w-6" />}
              iconStyle="bg-emerald-50 text-emerald-600"
              accent="text-emerald-600"
              tags="Flutter • React Native • Android • iOS"
              description="Native or cross-platform mobile apps solving consumer or local community problems."
              evaluation="Responsiveness & UX"
            />

            <TrackCard
              number="04"
              badge="Corporate Favorite"
              title="SaaS & Utility Automation"
              icon={<Zap className="h-6 w-6" />}
              iconStyle="bg-amber-50 text-amber-600"
              accent="text-amber-600"
              tags="APIs • Browser Extensions • DevTools • Automation"
              description="Productivity tools, developer extensions, scraping systems, and business process automations."
              evaluation="Problem Solving"
            />
          </div>
        </section>

        {/* =====================================================
            SPOTLIGHT
        ===================================================== */}

        <section
          ref={spotlightRef}
          className="
            relative
            my-16
            overflow-hidden
            rounded-[2rem]
            bg-[#0c0f15]
            px-6
            py-16
            text-center
            text-white
            shadow-[0_35px_90px_rgba(15,23,42,0.18)]
            sm:px-10
            sm:py-20
          "
        >
          <div
            className="
              absolute
              inset-0
              opacity-[0.08]
              bg-[radial-gradient(#fff_1px,transparent_1px)]
              [background-size:28px_28px]
            "
          />

          <div
            className="
              absolute
              left-1/2
              top-1/2
              h-80
              w-80
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-indigo-600/20
              blur-[100px]
            "
          />

          <div className="relative z-10">
            <p
              className="
                mb-4
                text-xs
                font-bold
                uppercase
                tracking-[0.3em]
                text-indigo-400
              "
            >
              Visibility matters
            </p>

            <h2
              className="
                text-3xl
                font-black
                uppercase
                tracking-[-0.04em]
                sm:text-5xl
                lg:text-6xl
              "
            >
              Great code
              <br />
              deserves to be seen.
            </h2>

            <p
              className="
                mx-auto
                mt-5
                max-w-xl
                text-sm
                leading-6
                text-slate-400
                sm:text-base
              "
            >
              Over 50+ sponsors and hiring partners review our Category
              Finalists.
            </p>
          </div>
        </section>

        {/* =====================================================
            SPECIAL TRACKS
        ===================================================== */}

        <section className="category-section-reveal space-y-8 py-16">
          <div className="border-b border-slate-200 pb-6">
            <p
              className="
                mb-2
                text-xs
                font-black
                uppercase
                tracking-[0.25em]
                text-indigo-600
              "
            >
              Niche Divisions
            </p>

            <div
              className="
                flex
                flex-col
                justify-between
                gap-4
                lg:flex-row
                lg:items-end
              "
            >
              <h2
                className="
                  text-3xl
                  font-black
                  tracking-[-0.04em]
                  text-slate-950
                  sm:text-4xl
                "
              >
                Specialized Awards & Niche Tracks.
              </h2>

              <p
                className="
                  max-w-md
                  text-sm
                  leading-6
                  text-slate-500
                  lg:text-right
                "
              >
                Smaller categories built for projects that push beyond
                conventional application development.
              </p>
            </div>
          </div>

          <div
            className="
              grid
              grid-cols-1
              gap-6
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >
            <SpecialCard
              icon={<Lock className="h-5 w-5" />}
              title="Cybersecurity & Ethical Hacking"
              description="Network tools, vulnerability scanners, security scripts."
            />

            <SpecialCard
              icon={<Gamepad2 className="h-5 w-5" />}
              title="Game Development & Graphics"
              description="Web games, Unity/Unreal prototypes, interactive experiences."
            />

            <SpecialCard
              icon={<Terminal className="h-5 w-5" />}
              title="Open Source & Developer Tools"
              description="Libraries, frameworks, public GitHub utilities."
            />

            <SpecialCard
              icon={<Cpu className="h-5 w-5" />}
              title="IoT & Hardware Hacks"
              description="Arduino/Raspberry Pi projects with software interfaces."
            />
          </div>
        </section>

        {/* =====================================================
            CTA
        ===================================================== */}

        <section
          ref={ctaRef}
          className="
            relative
            my-16
            overflow-hidden
            rounded-[2rem]
            border
            border-indigo-100
            bg-gradient-to-br
            from-indigo-50
            via-white
            to-purple-50
            px-6
            py-10
            shadow-sm
            sm:px-10
            sm:py-12
          "
        >
          <div
            className="
              absolute
              -right-24
              -top-24
              h-64
              w-64
              rounded-full
              bg-indigo-500/10
              blur-[70px]
            "
          />

          <div
            className="
              absolute
              -bottom-32
              -left-20
              h-64
              w-64
              rounded-full
              bg-purple-500/10
              blur-[70px]
            "
          />

          <div
            className="
              relative
              z-10
              flex
              flex-col
              items-center
              justify-between
              gap-8
              md:flex-row
            "
          >
            <div>
              <p
                className="
                  mb-2
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.25em]
                  text-indigo-600
                "
              >
                Your project belongs here
              </p>

              <h2
                className="
                  text-3xl
                  font-black
                  tracking-[-0.04em]
                  text-slate-950
                  sm:text-4xl
                "
              >
                BUILD IT.
                <br />
                SHOW US.
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-500">
                Select your category and submit your repository for free
                evaluation today.
              </p>
            </div>

            {/* =================================================
                SUBMIT BUTTON
            ================================================= */}

          
          </div>
        </section>

        {/* =====================================================
            BOTTOM
        ===================================================== */}

        <section className="border-t border-slate-200 py-8">
          <div
            className="
              flex
              flex-col
              justify-between
              gap-4
              text-xs
              font-bold
              uppercase
              tracking-wider
              text-slate-400
              sm:flex-row
              sm:items-center
            "
          >
            <span>Season 01 • Mumbai & MMR</span>

            <button
              type="button"
              onClick={goToSubmit}
              className="
                group
                flex
                items-center
                gap-2
                text-indigo-600
                transition-colors
                hover:text-indigo-700
              "
            >
              Start Your Submission
              <ExternalLink
                className="
                  h-3.5
                  w-3.5
                  transition-transform
                  group-hover:translate-x-0.5
                "
              />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

/* =========================================================
   MINI FEATURE
========================================================= */

function MiniFeature({ number, title, text }) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-xl
        border
        border-white/10
        bg-white/[0.03]
        px-3
        py-2
      "
    >
      <span
        className="
          flex
          h-6
          w-6
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-indigo-500/10
          text-[9px]
          font-black
          text-indigo-300
        "
      >
        {number}
      </span>

      <div className="min-w-0">
        <p className="text-[11px] font-bold text-white">{title}</p>

        <p className="mt-0.5 truncate text-[9px] text-slate-500">{text}</p>
      </div>
    </div>
  );
}

/* =========================================================
   PRIMARY TRACK CARD
========================================================= */

function TrackCard({
  number,
  badge,
  title,
  icon,
  iconStyle,
  accent,
  tags,
  description,
  evaluation,
}) {
  return (
    <article
      className="
        interactive-card
        group
        relative
        min-h-[350px]
        overflow-hidden
        rounded-[1.75rem]
        border
        border-slate-200
        bg-white/80
        p-6
        shadow-sm
        backdrop-blur-xl
        transition-shadow
        duration-500
        hover:border-indigo-200
        hover:shadow-[0_30px_70px_rgba(15,23,42,0.1)]
        sm:p-8
      "
    >
      <span
        className="
          pointer-events-none
          absolute
          -right-2
          -top-8
          text-[130px]
          font-black
          leading-none
          tracking-[-0.1em]
          text-slate-100
          transition-transform
          duration-700
          group-hover:translate-x-2
          group-hover:-translate-y-2
        "
      >
        {number}
      </span>

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div
              className={`card-icon flex h-12 w-12 items-center justify-center rounded-2xl ${iconStyle}`}
            >
              {icon}
            </div>

            <span
              className="
                rounded-full
                border
                border-slate-200
                bg-white
                px-3
                py-1.5
                text-[9px]
                font-black
                uppercase
                tracking-wider
                text-slate-500
              "
            >
              Track {number} • {badge}
            </span>
          </div>

          <h3
            className="
              mt-6
              max-w-lg
              text-2xl
              font-black
              tracking-[-0.03em]
              text-slate-950
              sm:text-3xl
            "
          >
            {title}
          </h3>

          <p
            className={`mt-3 text-[10px] font-black uppercase leading-5 tracking-[0.12em] ${accent}`}
          >
            {tags}
          </p>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>

        <div
          className="
            mt-8
            flex
            items-center
            justify-between
            border-t
            border-slate-100
            pt-4
          "
        >
          <div>
            <p
              className="
                text-[9px]
                font-black
                uppercase
                tracking-[0.15em]
                text-slate-400
              "
            >
              Evaluation
            </p>

            <p className="mt-1 text-xs font-bold text-slate-700">
              {evaluation}
            </p>
          </div>

          <div
            className="
              card-arrow
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-slate-200
              bg-white
              text-slate-600
              transition-colors
              group-hover:border-indigo-200
              group-hover:bg-indigo-50
              group-hover:text-indigo-600
            "
          >
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   SPECIAL TRACK CARD
========================================================= */

function SpecialCard({ icon, title, description }) {
  return (
    <article
      className="
        special-card
        interactive-card
        group
        flex
        min-h-[230px]
        flex-col
        justify-between
        rounded-[1.5rem]
        border
        border-slate-200
        bg-white/75
        p-6
        shadow-sm
        backdrop-blur-xl
        transition-shadow
        duration-500
        hover:border-indigo-200
        hover:shadow-[0_25px_60px_rgba(15,23,42,0.08)]
      "
    >
      <div>
        <div
          className="
            card-icon
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            bg-indigo-50
            text-indigo-600
          "
        >
          {icon}
        </div>

        <h3
          className="
            mt-5
            text-lg
            font-black
            leading-tight
            tracking-tight
            text-slate-950
          "
        >
          {title}
        </h3>

        <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
      </div>

      <div
        className="
          mt-6
          flex
          items-center
          justify-between
          border-t
          border-slate-100
          pt-3
        "
      >
        <span
          className="
            text-[9px]
            font-black
            uppercase
            tracking-[0.15em]
            text-indigo-600
          "
        >
          Special Award Track
        </span>

        <ArrowRight className="card-arrow h-4 w-4 text-slate-400" />
      </div>
    </article>
  );
}

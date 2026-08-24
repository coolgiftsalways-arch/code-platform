import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Code2,
  Trophy,
  Users,
  ShieldCheck,
  ArrowRight,
  Play,
  CheckCircle2,
  Upload,
  BrainCircuit,
  Award,
  Sparkles,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const cursorLightRef = useRef(null);

  const cardRef = useRef(null);
  const cardLightRef = useRef(null);

  const badgeRef = useRef(null);
  const headlineRef = useRef(null);
  const textRef = useRef(null);
  const pillsRef = useRef(null);
  const buttonsRef = useRef(null);

  const downRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const grid = gridRef.current;
    const light = cursorLightRef.current;
    const cardLight = cardLightRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
      /* =====================================================
         KEEP CARD VISIBLE
      ===================================================== */

      if (card) {
        gsap.set(card, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          rotateY: 0,
          transformPerspective: 1200,
        });
      }

      /* =====================================================
         HERO INTRO ANIMATION
      ===================================================== */

      gsap
        .timeline({
          defaults: {
            ease: "power3.out",
          },
        })

        // BADGE
        .fromTo(
          badgeRef.current,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
        )

        // HEADLINE
        .fromTo(
          headlineRef.current,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          "-=0.2",
        )

        // DESCRIPTION
        .fromTo(
          textRef.current,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
          },
          "-=0.3",
        )

        // FEATURE PILLS
        .fromTo(
          pillsRef.current ? Array.from(pillsRef.current.children) : [],
          {
            opacity: 0,
            y: 15,
            scale: 0.96,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            stagger: 0.07,
          },
          "-=0.2",
        )

        // BUTTONS
        .fromTo(
          buttonsRef.current,
          {
            opacity: 0,
            y: 15,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
          },
          "-=0.15",
        )

        // STUDENT CARD
        .fromTo(
          card,
          {
            y: 35,
            scale: 0.96,
          },
          {
            y: 0,
            scale: 1,
            duration: 0.7,
          },
          "-=0.4",
        );

      /* =====================================================
         SCROLL SECTION
      ===================================================== */

      const down = downRef.current;

      if (down) {
        const logos = down.querySelectorAll(".partner-logo");

        const heading = down.querySelector(".process-heading");

        const subheading = down.querySelector(".process-subheading");

        const paragraph = down.querySelector(".process-paragraph");

        const cards = down.querySelectorAll(".process-card");

        /* INITIAL STATES */

        gsap.set(logos, {
          opacity: 0,
          y: 50,
          scale: 0.85,
        });

        gsap.set([heading, subheading, paragraph], {
          opacity: 0,
          y: 35,
        });

        gsap.set(cards, {
          opacity: 0,
          y: 55,
          scale: 0.96,
        });

        /* SCROLL TIMELINE */

        const scrollTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: down,
            start: "top 85%",
            end: "+=850",
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });

        scrollTimeline

          .to(logos, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            stagger: 0.08,
            ease: "power3.out",
          })

          .to(
            heading,
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
            },
            "-=0.35",
          )

          .to(
            subheading,
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
            },
            "-=0.35",
          )

          .to(
            paragraph,
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
            },
            "-=0.25",
          )

          .to(
            cards,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              stagger: 0.12,
              ease: "power3.out",
            },
            "-=0.15",
          );
      }
    }, sectionRef);

    /* =====================================================
       BACKGROUND MOUSE MOVEMENT
    ===================================================== */

    const handleMouseMove = (e) => {
      if (!grid || !light) return;

      const rect = section.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const percentX = x / rect.width - 0.5;
      const percentY = y / rect.height - 0.5;

      gsap.to(grid, {
        x: percentX * 25,
        y: percentY * 25,
        duration: 0.8,
        ease: "power3.out",
        overwrite: true,
      });

      gsap.to(light, {
        x,
        y,
        duration: 0.3,
        ease: "power2.out",
        overwrite: true,
      });
    };

    /* =====================================================
       STUDENT CARD 3D MOUSE
    ===================================================== */

    const handleCardMove = (e) => {
      if (!card) return;

      const rect = card.getBoundingClientRect();

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (mouseY - centerY) / 65;

      const rotateY = (mouseX - centerX) / -65;

      gsap.to(card, {
        rotateX,
        rotateY,
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      });

      if (cardLight) {
        gsap.to(cardLight, {
          x: mouseX,
          y: mouseY,
          opacity: 1,
          duration: 0.25,
          ease: "power2.out",
          overwrite: true,
        });
      }
    };

    /* =====================================================
       CARD RESET
    ===================================================== */

    const resetCard = () => {
      if (!card) return;

      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
      });

      if (cardLight) {
        gsap.to(cardLight, {
          opacity: 0,
          duration: 0.2,
        });
      }
    };

    /* =====================================================
       EVENT LISTENERS
    ===================================================== */

    section.addEventListener("mousemove", handleMouseMove);

    if (card) {
      card.addEventListener("mousemove", handleCardMove);

      card.addEventListener("mouseleave", resetCard);
    }

    /* =====================================================
       CLEANUP
    ===================================================== */

    return () => {
      ctx.revert();

      section.removeEventListener("mousemove", handleMouseMove);

      if (card) {
        card.removeEventListener("mousemove", handleCardMove);

        card.removeEventListener("mouseleave", resetCard);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-slate-50 pt-4 pb-20 lg:pt-6 lg:pb-24"
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          ref={gridRef}
          className="absolute -inset-24 h-[calc(100%+192px)] w-[calc(100%+192px)] opacity-60"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath d='M 48 0 L 0 0 0 48' fill='none' stroke='%234f46e5' stroke-width='1.2' stroke-opacity='0.28'/%3E%3C/svg%3E\")",

            backgroundRepeat: "repeat",
          }}
        />

        <div
          ref={cursorLightRef}
          className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-pink-500/10 blur-[100px]"
        />
      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        <div className="grid min-w-0 grid-cols-1 items-center gap-10 lg:grid-cols-12">
          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div className="min-w-0 space-y-5 text-center lg:col-span-6 lg:text-left">
            {/* BADGE */}

            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-100/80 bg-indigo-50/90 px-4 py-1.5 shadow-sm backdrop-blur-sm"
            >
              <Users className="h-4 w-4 text-indigo-600" />

              <span className="text-xs font-semibold text-indigo-900">
                <strong className="text-indigo-600">Over 1,000+</strong> Student
                Developers Participating Across Mumbai & MMR
              </span>
            </div>

            {/* HEADLINE */}

            <h1
              ref={headlineRef}
              className="text-4xl font-extrabold leading-[1.03] tracking-tight text-slate-900 opacity-0 sm:text-5xl lg:text-6xl"
            >
              Build Your Code.{" "}
              <span className="text-indigo-600">Prove Your Skill.</span> Enter
              The Hall Of Fame.
            </h1>

            {/* DESCRIPTION */}

            <p
              ref={textRef}
              className="mx-auto max-w-xl text-base leading-relaxed text-slate-600 opacity-0 sm:text-lg lg:mx-0"
            >
              India’s verified student developer championship. Submit your
              existing GitHub project for FREE, clear a 5-minute technical code
              defense, and compete for ₹1,00,000+ in cash prizes.
            </p>

            {/* FEATURE PILLS */}

            <div
              ref={pillsRef}
              className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-3"
            >
              <FeaturePill
                icon={<Sparkles className="h-4 w-4" />}
                title="100% Free Entry"
                text="Zero upfront cost"
              />

              <FeaturePill
                icon={<ShieldCheck className="h-4 w-4" />}
                title="Verified Code Defense"
                text="Show true code ownership"
              />

              <FeaturePill
                icon={<Users className="h-4 w-4" />}
                title="Recruiter Visibility"
                text="Opt-in hiring pipelines"
              />
            </div>

            {/* BUTTONS */}

            <div
              ref={buttonsRef}
              className="flex flex-col items-center justify-center gap-3 pt-2 opacity-0 sm:flex-row lg:justify-start"
            >
              <a
                href="/upload"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 sm:w-auto"
              >
                Submit Your GitHub Project
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="/hall-of-fame"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-7 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 sm:w-auto"
              >
                Explore Hall of Fame
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100">
                  <Play className="h-2.5 w-2.5 fill-slate-700 text-slate-700" />
                </span>
              </a>
            </div>
          </div>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <div className="min-w-0 w-full lg:col-span-6 [perspective:1200px]">
            <div
              ref={cardRef}
              className="relative z-20 block w-full min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-2xl"
              style={{
                transformStyle: "preserve-3d",
                transformPerspective: 1200,
              }}
            >
              {/* CARD LIGHT */}

              <div
                ref={cardLightRef}
                className="pointer-events-none absolute left-0 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/15 blur-3xl opacity-0"
              />

              {/* CARD HEADER */}

              <div
                className="relative z-10 flex items-center justify-between border-b border-slate-100 pb-4"
                style={{
                  transform: "translateZ(30px)",
                }}
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
                    Verified Student Card
                  </p>

                  <h3 className="mt-1 text-xl font-extrabold text-slate-900">
                    Rahul S.
                  </h3>

                  <p className="text-xs text-slate-400">Vile Parle, Mumbai</p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg">
                  <Code2 className="h-6 w-6" />
                </div>
              </div>

              {/* CARD FIELDS */}

              <div
                className="relative z-10 grid gap-3 pt-5 sm:grid-cols-2"
                style={{
                  transform: "translateZ(20px)",
                }}
              >
                <CardField label="Status" value="Verified Finalist" verified />

                <CardField label="Code Defense Score" value="94 / 100" />

                <CardField label="Rank" value="#1 AI Track" />

                <CardField label="Season" value="Season 01" />
              </div>

              {/* VERIFICATION */}

              <div
                className="relative z-10 mt-5 flex items-center justify-between rounded-2xl bg-slate-50 p-4"
                style={{
                  transform: "translateZ(15px)",
                }}
              >
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    Verification
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    Repository + Technical Defense
                  </p>
                </div>

                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            PARTNERS + PROCESS
        ===================================================== */}

        <div ref={downRef} className="mt-28 min-h-[1050px] py-20 text-center">
          {/* PARTNERS */}

          <div className="mb-24 grid grid-cols-2 gap-5 sm:grid-cols-4">
            <PartnerLogo
              icon={<span className="font-black text-sm">GH</span>}
              name="GitHub"
            />

            <PartnerLogo
              icon={<span className="font-black text-sm">R</span>}
              name="Razorpay"
            />

            <PartnerLogo
              icon={<span className="font-black text-sm">AWS</span>}
              name="Cloud Partner"
            />

            <PartnerLogo
              icon={<Award className="h-6 w-6" />}
              name="Official Tech Learning Partner"
            />
          </div>

          {/* PROCESS INTRO */}

          <div className="mx-auto max-w-5xl px-6">
            <h2 className="process-heading text-5xl font-black leading-[0.95] tracking-tight text-slate-900 sm:text-6xl md:text-7xl">
              Submit. Defend. Get Recognized.
            </h2>

            <h3 className="process-subheading mt-8 text-2xl font-bold text-indigo-600 sm:text-3xl">
              Your code deserves to be seen by top sponsors, institutes, and
              engineering leaders.
            </h3>

            <p className="process-paragraph mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-slate-500 sm:text-xl">
              Turn an existing project into verified proof of skill, earn
              finalist recognition, and compete for ₹1,00,000+ in cash prizes.
            </p>
          </div>

          {/* PROCESS CARDS */}

          <div className="mx-auto mt-24 max-w-6xl px-6">
            <div className="grid grid-cols-1 gap-6 text-left md:grid-cols-3">
              <ProcessCard
                number="01"
                icon={<Upload className="h-6 w-6" />}
                title="Free Submission"
                subtitle="SUBMIT YOUR REPO"
                text="Submit your personal details, computer institute, live demo URL, and GitHub repository link with full AI-tool disclosure."
              />

              <ProcessCard
                number="02"
                icon={<BrainCircuit className="h-6 w-6" />}
                title="Technical Defense"
                subtitle="PROVE YOUR OWNERSHIP"
                text="Pass a mandatory 5-minute virtual code defense with industry judges to verify your code structure and architecture."
              />

              <ProcessCard
                number="03"
                icon={<Trophy className="h-6 w-6" />}
                title="Finalist Pass & Finale"
                subtitle="CLAIM YOUR RECOGNITION"
                text="Unlock your ₹399/₹499 Finalist Pass, receive shareable digital badges, compete in the Mumbai Finale, and enter the Hall of Fame."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   FEATURE PILL
========================================================= */

function FeaturePill({ icon, title, text }) {
  return (
    <div className="flex min-w-0 flex-col items-center rounded-2xl border border-slate-200/80 bg-white/80 p-3 shadow-sm backdrop-blur-md lg:items-start">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        {icon}
      </div>

      <h3 className="text-xs font-bold text-slate-900 sm:text-sm">{title}</h3>

      <p className="mt-0.5 text-center text-[11px] text-slate-500 lg:text-left">
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   STUDENT CARD FIELD
========================================================= */

function CardField({ label, value, verified = false }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </p>

      <div className="mt-1 flex items-center gap-1.5">
        <p className="text-sm font-black text-slate-900">{value}</p>

        {verified && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
      </div>
    </div>
  );
}

/* =========================================================
   PARTNER LOGO
========================================================= */

function PartnerLogo({ icon, name }) {
  return (
    <div className="partner-logo flex min-w-0 flex-col items-center gap-2">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg sm:h-16 sm:w-16">
        {icon}
      </div>

      <span className="max-w-full text-[10px] font-bold text-slate-800 sm:text-sm">
        {name}
      </span>
    </div>
  );
}

/* =========================================================
   PROCESS CARD
========================================================= */

function ProcessCard({ number, icon, title, subtitle, text }) {
  return (
    <div className="process-card group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-xl">
      {/* GLOW */}

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />

      <div className="relative z-10">
        {/* NUMBER */}

        <div className="flex items-start justify-between">
          <span className="text-5xl font-black tracking-tight text-slate-200">
            {number}
          </span>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            {icon}
          </div>
        </div>

        {/* TITLE */}

        <h3 className="mt-8 text-2xl font-black text-slate-900">{title}</h3>

        {/* SUBTITLE */}

        <h5 className="mt-2 text-sm font-bold uppercase tracking-[0.15em] text-indigo-600">
          {subtitle}
        </h5>

        {/* DESCRIPTION */}

        <p className="mt-4 text-base leading-7 text-slate-500">{text}</p>

        {/* EXPLORE */}

        <div className="mt-7 flex items-center gap-2 text-sm font-bold text-slate-900">
          Explore
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

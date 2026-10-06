import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   INLINE ICON SYSTEM
   No lucide-react required
========================================================= */

function Icon({ name, className = "h-5 w-5" }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    sparkles: (
      <>
        <path d="m12 3-1.2 3.8L7 8l3.8 1.2L12 13l1.2-3.8L17 8l-3.8-1.2L12 3Z" />
        <path d="m19 13-.7 2.3L16 16l2.3.7L19 19l.7-2.3L22 16l-2.3-.7L19 13Z" />
        <path d="m5 14-.6 2L2 17l2.4.7L5 20l.6-2.3L8 17l-2.4-.7L5 14Z" />
      </>
    ),
    code: (
      <>
        <path d="m8 9-4 3 4 3" />
        <path d="m16 9 4 3-4 3" />
        <path d="m14 5-4 14" />
      </>
    ),
    github: (
      <>
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.5 5.5 0 0 0 19.3 3.7 5.1 5.1 0 0 0 19.2 0S18 0 15 1.7a13.4 13.4 0 0 0-7 0C5 0 3.8 0 3.8 0a5.1 5.1 0 0 0-.1 3.7A5.5 5.5 0 0 0 2.2 7.5c0 5.4 3.5 6.6 6.8 7A4.8 4.8 0 0 0 8 18v4" />
        <path d="M8 19c-3 .9-3-1.5-4-2" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" />
      </>
    ),
    rocket: (
      <>
        <path d="M4.5 16.5c-1.5 1.2-2 3.5-2 3.5s2.3-.5 3.5-2" />
        <path d="M9 15 4 20" />
        <path d="M15 9l5-5" />
        <path d="M8 16 5 13l6-8c3-4 7-3 8-3 0 1 1 5-3 8l-8 6Z" />
        <path d="M14 4l6 6" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3a15 15 0 0 1 0 18" />
        <path d="M12 3a15 15 0 0 0 0 18" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
      </>
    ),
    building: (
      <>
        <path d="M3 21h18" />
        <path d="M5 21V5l7-3 7 3v16" />
        <path d="M9 9h1M14 9h1M9 13h1M14 13h1M9 17h1M14 17h1" />
      </>
    ),
    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M3 12h18" />
      </>
    ),
    award: (
      <>
        <circle cx="12" cy="8" r="5" />
        <path d="M8.5 12 7 22l5-3 5 3-1.5-10" />
      </>
    ),
    layers: (
      <>
        <path d="m12 2 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5" />
        <path d="m3 17 9 5 9-5" />
      </>
    ),
    book: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z" />
      </>
    ),
    heart: (
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </>
    ),
  };

  return <svg {...common}>{icons[name]}</svg>;
}

/* =========================================================
   ABOUT PAGE DATA
========================================================= */

const problemCards = [
  {
    number: "01",
    title: "Projects disappear after submission.",
    text: "A strong college project can take weeks or months to build, yet often disappears once it has been graded.",
  },
  {
    number: "02",
    title: "Resumes reduce months of work to one line.",
    text: "A single bullet point cannot show the decisions, problems, architecture, iterations, and learning behind a real project.",
  },
  {
    number: "03",
    title: "Practical ability is difficult to understand.",
    text: "Marks and certificates can show progress, but they do not always reveal how a student thinks, builds, debugs, or ships.",
  },
  {
    number: "04",
    title: "Strong work rarely gets wider visibility.",
    text: "Excellent student projects often stay inside a local folder, GitHub repository, classroom, or private presentation.",
  },
];

const principles = [
  {
    icon: "shield",
    title: "Proof Over Credentials",
    text: "Real work provides context that a certificate or skill list cannot show on its own.",
  },
  {
    icon: "code",
    title: "Practical Ability Matters",
    text: "Projects reveal implementation, problem-solving, decision-making, and the ability to complete something real.",
  },
  {
    icon: "eye",
    title: "Students Deserve Visibility",
    text: "Strong work should not disappear after a classroom submission or final-year presentation.",
  },
  {
    icon: "user",
    title: "Original Work First",
    text: "Recognition should go to students who understand, can explain, and meaningfully contributed to the work.",
  },
  {
    icon: "globe",
    title: "Build in Public",
    text: "Sharing process, repositories, demos, and documentation helps create stronger technical identities.",
  },
  {
    icon: "target",
    title: "Quality Over Quantity",
    text: "One deeply understood project can communicate more than ten unfinished or copied projects.",
  },
];

const audiences = [
  {
    icon: "user",
    eyebrow: "STUDENTS",
    title: "Turn projects into visible proof of skill.",
    text: "Build a technical identity around real work, not only grades, certificates, or self-written skill claims.",
    bullets: [
      "Show your strongest projects",
      "Create a project-backed profile",
      "Share GitHub and live demos",
      "Build a visible history of growth",
    ],
  },
  {
    icon: "building",
    eyebrow: "INSTITUTIONS",
    title: "Show practical student outcomes.",
    text: "Give student innovation a place to be seen and make project-based learning more visible outside the classroom.",
    bullets: [
      "Showcase student innovation",
      "Highlight exceptional students",
      "Build project collections",
      "Create stronger industry visibility",
    ],
  },
  {
    icon: "briefcase",
    eyebrow: "INDUSTRY",
    title: "Discover talent through demonstrated execution.",
    text: "Explore what students have actually built instead of relying only on résumé keywords and self-reported skills.",
    bullets: [
      "Browse by technical category",
      "Inspect project complexity",
      "View technology stacks",
      "Discover emerging talent",
    ],
  },
];

/* =========================================================
   ABOUT PAGE
========================================================= */

export default function AboutUs() {
  const pageRef = useRef(null);
  const gridRef = useRef(null);
  const lightRef = useRef(null);

  const badgeRef = useRef(null);
  const headingRef = useRef(null);
  const textRef = useRef(null);
  const visualRef = useRef(null);

  useEffect(() => {
    const page = pageRef.current;
    const grid = gridRef.current;
    const light = lightRef.current;

    if (!page) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: "power3.out" },
        })
        .fromTo(
          badgeRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.55 },
        )
        .fromTo(
          headingRef.current,
          { opacity: 0, y: 36 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.3",
        )
        .fromTo(
          textRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.65 },
          "-=0.45",
        )
        .fromTo(
          visualRef.current,
          { opacity: 0, y: 28, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.85 },
          "-=0.6",
        );

      gsap.utils.toArray(".about-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 44 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 86%",
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray(".about-card-grid").forEach((gridElement) => {
        const cards = gridElement.querySelectorAll(".about-card");

        gsap.fromTo(
          cards,
          { opacity: 0, y: 34, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridElement,
              start: "top 84%",
              once: true,
            },
          },
        );
      });
    }, page);

    const move = (event) => {
      if (!grid || !light) return;

      const rect = page.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      gsap.to(grid, {
        x: (x / rect.width - 0.5) * 22,
        y: (y / rect.height - 0.5) * 22,
        duration: 1,
        ease: "power3.out",
        overwrite: true,
      });

      gsap.to(light, {
        x,
        y,
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      });
    };

    page.addEventListener("mousemove", move);

    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      window.clearTimeout(refreshTimer);
      page.removeEventListener("mousemove", move);
      ctx.revert();
    };
  }, []);

  return (
    <main
      ref={pageRef}
      className="relative overflow-hidden bg-[#f8f9fc] pb-24 pt-8 text-slate-950 lg:pt-10"
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          ref={gridRef}
          className="absolute -inset-24 h-[calc(100%+192px)] w-[calc(100%+192px)] opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(rgba(79,70,229,0.18) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />

        <div
          ref={lightRef}
          className="absolute h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-500/16 via-violet-500/12 to-purple-500/8 blur-[120px]"
        />

        <div className="absolute right-[-160px] top-[1050px] h-[520px] w-[520px] rounded-full bg-indigo-500/[0.07] blur-[120px]" />
        <div className="absolute left-[-180px] top-[2500px] h-[520px] w-[520px] rounded-full bg-purple-500/[0.06] blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="grid items-center gap-10 py-8 lg:min-h-[calc(100vh-120px)] lg:grid-cols-12 lg:py-4">
          <div className="lg:col-span-6">
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/90 px-4 py-2 shadow-sm backdrop-blur"
            >
              <Icon name="sparkles" className="h-4 w-4 text-indigo-600" />

              <span className="text-xs font-semibold text-indigo-900">
                About DEVNEX
              </span>
            </div>

            <h1
              ref={headingRef}
              className="mt-6 max-w-4xl text-5xl font-black leading-[0.96] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-[68px]"
            >
              Skills deserve more than a line on a{" "}
              <span className="text-indigo-600">résumé.</span>
            </h1>

            <p
              ref={textRef}
              className="mt-7 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg"
            >
              DEVNEX is a project-first platform created to help students
              present their practical technical abilities through real work. We
              believe the strongest evidence of skill is something you have
              designed, developed, tested, improved, and finished yourself.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/features"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-7 py-4 text-sm font-black text-white shadow-xl shadow-indigo-600/20 transition hover:-translate-y-1 hover:bg-indigo-700"
              >
                Explore Projects
                <Icon name="arrow" className="h-4 w-4" />
              </a>

              <a
                href="/upload"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-7 py-4 text-sm font-black text-slate-950 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:text-indigo-600"
              >
                Submit Your Project
              </a>
            </div>
          </div>

          {/* HERO VISUAL */}

          <div ref={visualRef} className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-[34px] border border-slate-200 bg-white p-6 shadow-[0_40px_100px_rgba(15,23,42,0.14)] sm:p-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                <div className="flex gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>

                <span className="text-[9px] font-black uppercase tracking-[0.18em] text-indigo-600">
                  DEVNEX PROJECT-FIRST MODEL
                </span>
              </div>

              <div className="grid gap-4 py-6 sm:grid-cols-2">
                <HeroVisualCard
                  icon="code"
                  label="01"
                  title="Build"
                  text="Create something real."
                />

                <HeroVisualCard
                  icon="github"
                  label="02"
                  title="Show"
                  text="Share code, demo, and story."
                />

                <HeroVisualCard
                  icon="shield"
                  label="03"
                  title="Prove"
                  text="Explain what you built."
                />

                <HeroVisualCard
                  icon="award"
                  label="04"
                  title="Get Seen"
                  text="Build visibility around your work."
                />
              </div>

              <div className="rounded-2xl bg-slate-950 p-5 text-white">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-300">
                  THE IDEA
                </p>

                <p className="mt-3 text-xl font-black leading-tight">
                  Don&apos;t just tell people what you know.
                  <span className="block text-indigo-400">
                    Show them what you built.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            WHY WE EXIST
        ===================================================== */}

        <section className="about-reveal mt-24 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel>THE PROBLEM</SectionLabel>

            <h2 className="mt-5 text-4xl font-black leading-[0.98] tracking-tight sm:text-5xl">
              Great student projects are often{" "}
              <span className="text-indigo-600">invisible.</span>
            </h2>
          </div>

          <div className="space-y-5 text-base leading-8 text-slate-600 lg:col-span-7 sm:text-lg">
            <p>
              Thousands of students build websites, applications, AI models,
              automation tools, research projects, dashboards, and digital
              products every year.
            </p>

            <p>
              Much of that work disappears inside laptops, GitHub repositories,
              classroom submissions, or forgotten folders after evaluation.
            </p>

            <p className="font-bold text-slate-950">
              Students are building valuable things. Very few people get to see
              them.
            </p>
          </div>
        </section>

        <div className="about-card-grid mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {problemCards.map((item) => (
            <ProblemCard key={item.number} {...item} />
          ))}
        </div>

        {/* =====================================================
            MISSION & VISION
        ===================================================== */}

        <section className="about-reveal mt-32">
          <SectionLabel>MISSION & VISION</SectionLabel>

          <div className="about-card-grid mt-7 grid gap-6 lg:grid-cols-2">
            <MissionCard
              number="01"
              icon="rocket"
              title="Our Mission"
              text="Help students turn technical work into visible, credible proof of skill."
            />

            <MissionCard
              number="02"
              icon="globe"
              title="Our Vision"
              text="Create a place where students are discovered because of what they can build—not only where they studied or what marks they received."
            />
          </div>
        </section>

        {/* =====================================================
            DIFFERENT
        ===================================================== */}

        <section className="about-reveal mt-32 grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionLabel>WHAT MAKES DEVNEX DIFFERENT</SectionLabel>

            <h2 className="mt-5 text-4xl font-black leading-[0.98] tracking-tight sm:text-5xl">
              Not another course platform.{" "}
              <span className="text-indigo-600">Not another job board.</span>
            </h2>

            <p className="mt-6 text-base leading-7 text-slate-600">
              DEVNEX does not exist to tell students what course to buy or to
              reduce talent to another application form. It exists to give the
              work students already create a professional place to be seen.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
              <ComparisonRow
                label="COURSE PLATFORM"
                title="Learn something."
                active={false}
              />

              <ComparisonRow
                label="JOB BOARD"
                title="Apply somewhere."
                active={false}
              />

              <ComparisonRow
                label="DEVNEX"
                title="Show what you can do."
                active
              />
            </div>
          </div>
        </section>

        {/* =====================================================
            CORE PRINCIPLES
        ===================================================== */}

        <section className="about-reveal mt-32">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <SectionLabel>CORE PRINCIPLES</SectionLabel>

              <h2 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
                Principles behind the platform.
              </h2>
            </div>

            <p className="text-base leading-7 text-slate-500 lg:col-span-5">
              These ideas guide how DEVNEX thinks about student work,
              recognition, visibility, and long-term technical growth.
            </p>
          </div>
        </section>

        <div className="about-card-grid mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((item) => (
            <PrincipleCard key={item.title} {...item} />
          ))}
        </div>

        {/* =====================================================
            DARK PROOF SECTION
        ===================================================== */}

        <section className="about-reveal mt-32 overflow-hidden rounded-[38px] bg-slate-950 text-white shadow-2xl shadow-slate-900/10">
          <div className="grid lg:grid-cols-12">
            <div className="p-8 sm:p-10 lg:col-span-7 lg:p-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">
                <Icon name="shield" className="h-4 w-4 text-indigo-400" />

                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-300">
                  PROJECT-FIRST THINKING
                </span>
              </div>

              <h2 className="mt-6 text-4xl font-black leading-[0.98] tracking-tight sm:text-5xl">
                A skill claim is useful.{" "}
                <span className="text-indigo-400">
                  A finished project gives it context.
                </span>
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400">
                A project can show how a student approaches a problem, makes
                technical choices, handles bugs, connects systems, improves the
                experience, and finishes the work.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <DarkProof text="Working project output" />
                <DarkProof text="GitHub repository" />
                <DarkProof text="Technology stack" />
                <DarkProof text="Project documentation" />
                <DarkProof text="Problem-solving process" />
                <DarkProof text="Student contribution" />
              </div>
            </div>

            <div className="border-t border-white/10 bg-white/[0.035] p-8 sm:p-10 lg:col-span-5 lg:border-l lg:border-t-0 lg:p-12">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">
                WHAT A PROJECT CAN SHOW
              </p>

              <div className="mt-7 space-y-4">
                <DarkInfo
                  icon="target"
                  title="How you think"
                  text="The reasoning behind the solution matters as much as the final interface."
                />

                <DarkInfo
                  icon="layers"
                  title="How you structure"
                  text="Architecture and implementation reveal depth that a skill list cannot."
                />

                <DarkInfo
                  icon="book"
                  title="How you explain"
                  text="Documentation and communication help others understand your technical decisions."
                />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            WHO IT SERVES
        ===================================================== */}

        <section className="about-reveal mt-32">
          <SectionLabel>WHO DEVNEX SERVES</SectionLabel>

          <h2 className="mt-5 max-w-4xl text-4xl font-black leading-[0.98] tracking-tight sm:text-5xl">
            One platform.{" "}
            <span className="text-indigo-600">
              Three connected communities.
            </span>
          </h2>
        </section>

        <div className="about-card-grid mt-10 grid gap-6 lg:grid-cols-3">
          {audiences.map((item) => (
            <AudienceCard key={item.eyebrow} {...item} />
          ))}
        </div>

        {/* =====================================================
            SIMPLE FLOW
        ===================================================== */}

        <section className="about-reveal mt-32 rounded-[34px] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8 sm:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionLabel>THE DEVNEX JOURNEY</SectionLabel>

              <h2 className="mt-5 text-4xl font-black leading-[0.98] tracking-tight sm:text-5xl">
                From hidden folder to{" "}
                <span className="text-indigo-600">visible proof.</span>
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
              <JourneyItem
                number="01"
                title="Build"
                text="Create something real."
              />
              <JourneyItem
                number="02"
                title="Publish"
                text="Add project context, code, and demo."
              />
              <JourneyItem
                number="03"
                title="Present"
                text="Explain the thinking behind the work."
              />
              <JourneyItem
                number="04"
                title="Get Seen"
                text="Make the project easier to discover."
              />
            </div>
          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ===================================================== */}

        <section className="about-reveal mt-32 overflow-hidden rounded-[38px] bg-indigo-600 px-8 py-14 text-white shadow-2xl shadow-indigo-600/20 sm:px-12 sm:py-16 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
                <Icon name="code" className="h-4 w-4" />

                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  BUILT FOR STUDENTS WHO BUILD
                </span>
              </div>

              <h2 className="mt-6 max-w-5xl text-4xl font-black leading-[0.98] tracking-tight sm:text-5xl lg:text-6xl">
                Your strongest project could tell your story better than your
                résumé.
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-7 text-indigo-100 sm:text-lg">
                Turn what you built into a professional project profile and make
                your work easier to discover.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:col-span-4">
              <a
                href="/upload"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black text-indigo-700 shadow-xl transition hover:-translate-y-1"
              >
                Submit Your Project
                <Icon name="arrow" className="h-4 w-4" />
              </a>

              <a
                href="/features"
                className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-black text-white transition hover:bg-white/20"
              >
                Explore Projects
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function SectionLabel({ children }) {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-indigo-600" />

      <span className="text-[10px] font-black uppercase tracking-[0.24em] text-indigo-600">
        {children}
      </span>
    </div>
  );
}

function HeroVisualCard({ icon, label, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon name={icon} className="h-4 w-4" />
        </div>

        <span className="text-lg font-black text-slate-200">{label}</span>
      </div>

      <h3 className="mt-5 text-base font-black text-slate-950">{title}</h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
    </div>
  );
}

function ProblemCard({ number, title, text }) {
  return (
    <article className="about-card rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <span className="text-4xl font-black text-slate-100">{number}</span>

      <h3 className="mt-6 text-lg font-black leading-tight text-slate-950">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">{text}</p>
    </article>
  );
}

function MissionCard({ number, icon, title, text }) {
  return (
    <article className="about-card relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
      <div className="absolute right-[-80px] top-[-80px] h-56 w-56 rounded-full bg-indigo-500/[0.07] blur-[70px]" />

      <div className="relative flex items-start justify-between">
        <span className="text-6xl font-black text-slate-100">{number}</span>

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
          <Icon name={icon} className="h-6 w-6" />
        </div>
      </div>

      <h3 className="relative mt-8 text-3xl font-black text-slate-950">
        {title}
      </h3>

      <p className="relative mt-4 max-w-xl text-base leading-7 text-slate-600">
        {text}
      </p>
    </article>
  );
}

function ComparisonRow({ label, title, active }) {
  return (
    <div
      className={`grid gap-4 border-b border-slate-100 px-6 py-6 last:border-b-0 sm:grid-cols-[170px_1fr] sm:items-center sm:px-8 ${
        active ? "bg-indigo-50/70" : ""
      }`}
    >
      <span
        className={`text-[10px] font-black uppercase tracking-[0.18em] ${
          active ? "text-indigo-600" : "text-slate-400"
        }`}
      >
        {label}
      </span>

      <span
        className={`text-xl font-black ${
          active ? "text-indigo-700" : "text-slate-700"
        }`}
      >
        {title}
      </span>
    </div>
  );
}

function PrincipleCard({ icon, title, text }) {
  return (
    <article className="about-card rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <Icon name={icon} className="h-5 w-5" />
      </div>

      <h3 className="mt-5 text-lg font-black text-slate-950">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </article>
  );
}

function DarkProof({ text }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
        <Icon name="check" className="h-3.5 w-3.5" />
      </div>

      <span className="text-sm font-semibold text-slate-200">{text}</span>
    </div>
  );
}

function DarkInfo({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
          <Icon name={icon} className="h-4 w-4" />
        </div>

        <h3 className="text-sm font-black text-white">{title}</h3>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}

function AudienceCard({ icon, eyebrow, title, text, bullets }) {
  return (
    <article className="about-card overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
      <div className="p-7">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
          <Icon name={icon} className="h-5 w-5" />
        </div>

        <p className="mt-7 text-[9px] font-black uppercase tracking-[0.22em] text-indigo-600">
          {eyebrow}
        </p>

        <h3 className="mt-3 text-2xl font-black leading-tight text-slate-950">
          {title}
        </h3>

        <p className="mt-4 text-sm leading-6 text-slate-500">{text}</p>

        <div className="mt-7 space-y-3">
          {bullets.map((bullet) => (
            <div key={bullet} className="flex items-start gap-2">
              <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                <Icon name="check" className="h-3 w-3" />
              </div>

              <span className="text-sm font-semibold text-slate-700">
                {bullet}
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function JourneyItem({ number, title, text }) {
  return (
    <div className="rounded-2xl border border-white/80 bg-white/80 p-5 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between">
        <span className="text-3xl font-black text-slate-100">{number}</span>

        <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
      </div>

      <h3 className="mt-4 text-lg font-black text-slate-950">{title}</h3>

      <p className="mt-1 text-sm text-slate-500">{text}</p>
    </div>
  );
}

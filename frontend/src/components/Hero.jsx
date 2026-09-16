import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Award,
  BadgeCheck,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Code2,
  FileCode2,
  GitBranch,
  Globe2,
  GraduationCap,
  Network,
  Play,
  Rocket,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  Trophy,
  Upload,
  Users,
  Workflow,
  ArrowRight,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const domains = [
  {
    number: "01",
    icon: <Code2 className="h-6 w-6" />,
    title: "Web & Full-Stack Development",
    stack: "React • Next.js • Node.js • PHP • Django • APIs",
    text: "Build production-style websites, portals, e-commerce systems, dashboards, SaaS products, and full-stack applications.",
  },
  {
    number: "02",
    icon: <Bot className="h-6 w-6" />,
    title: "AI & Machine Learning",
    stack: "Python • ML • NLP • Computer Vision • GenAI",
    text: "Create AI-powered applications, intelligent assistants, predictive tools, automation systems, and practical machine-learning products.",
  },
  {
    number: "03",
    icon: <Smartphone className="h-6 w-6" />,
    title: "Mobile Application Development",
    stack: "Flutter • React Native • Android • iOS",
    text: "Showcase native and cross-platform mobile applications that solve consumer, institute, community, or business problems.",
  },
  {
    number: "04",
    icon: <Workflow className="h-6 w-6" />,
    title: "SaaS & Utility Automation",
    stack: "APIs • Extensions • DevTools • Automation",
    text: "Build utilities, browser extensions, workflow tools, micro-SaaS products, integrations, and productivity automation.",
  },
];

const steps = [
  {
    number: "01",
    icon: <Target className="h-5 w-5" />,
    title: "Choose Your Track",
    text: "Select the domain that best matches your project and review its evaluation criteria.",
  },
  {
    number: "02",
    icon: <Upload className="h-5 w-5" />,
    title: "Submit Your Project",
    text: "Share your GitHub repository, live demo, project details, institute information, and AI-tool disclosure.",
  },
  {
    number: "03",
    icon: <Search className="h-5 w-5" />,
    title: "Project Screening",
    text: "The submission is checked for completeness, relevance, originality signals, and technical readiness.",
  },
  {
    number: "04",
    icon: <BrainCircuit className="h-5 w-5" />,
    title: "Technical Defense",
    text: "Shortlisted developers explain their code, architecture, decisions, and ownership in a live technical round.",
  },
  {
    number: "05",
    icon: <Trophy className="h-5 w-5" />,
    title: "Recognition",
    text: "Finalists receive verified recognition, compete for awards, and can be featured in the Hall of Fame.",
  },
];

const benefits = [
  {
    icon: <BadgeCheck className="h-5 w-5" />,
    title: "Verified Project Profile",
    text: "Turn a repository into structured proof of what you actually built.",
  },
  {
    icon: <FileCode2 className="h-5 w-5" />,
    title: "Code Ownership Defense",
    text: "Explain your architecture and implementation instead of relying only on screenshots.",
  },
  {
    icon: <Award className="h-5 w-5" />,
    title: "Achievement Recognition",
    text: "Earn finalist, category, and season-level recognition based on the competition process.",
  },
  {
    icon: <Globe2 className="h-5 w-5" />,
    title: "Hall of Fame Visibility",
    text: "Selected work can become part of a public archive of high-performing student projects.",
  },
  {
    icon: <Network className="h-5 w-5" />,
    title: "Institute Visibility",
    text: "Help institutes demonstrate student project quality beyond academic marks.",
  },
  {
    icon: <BriefcaseBusiness className="h-5 w-5" />,
    title: "Industry Discovery",
    text: "Create a cleaner path for companies and sponsors to discover project-backed talent.",
  },
];

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

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const grid = gridRef.current;
    const light = cursorLightRef.current;
    const cardLight = cardLightRef.current;

    if (!section) return;

    const ctx = gsap.context(() => {
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

      gsap
        .timeline({
          defaults: {
            ease: "power3.out",
          },
        })
        .fromTo(
          badgeRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
        )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.2",
        )
        .fromTo(
          textRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.3",
        )
        .fromTo(
          pillsRef.current ? Array.from(pillsRef.current.children) : [],
          { opacity: 0, y: 15, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            stagger: 0.07,
          },
          "-=0.2",
        )
        .fromTo(
          buttonsRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.45 },
          "-=0.15",
        )
        .fromTo(
          card,
          { y: 35, scale: 0.96 },
          { y: 0, scale: 1, duration: 0.7 },
          "-=0.4",
        );

      gsap.utils.toArray(".home-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 42 },
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

      gsap.utils.toArray(".home-card-grid").forEach((gridElement) => {
        const cards = gridElement.querySelectorAll(".home-reveal-card");

        if (!cards.length) return;

        gsap.fromTo(
          cards,
          { opacity: 0, y: 35, scale: 0.98 },
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
    }, section);

    const handleMouseMove = (event) => {
      if (!grid || !light) return;

      const rect = section.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
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

    const handleCardMove = (event) => {
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
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

    section.addEventListener("mousemove", handleMouseMove);

    if (card) {
      card.addEventListener("mousemove", handleCardMove);
      card.addEventListener("mouseleave", resetCard);
    }

    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      window.clearTimeout(refreshTimer);
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
      className="relative overflow-hidden bg-slate-50 pb-24 pt-4 text-slate-900 lg:pt-6"
    >
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          ref={gridRef}
          className="absolute -inset-24 h-[calc(100%+192px)] w-[calc(100%+192px)] opacity-55"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath d='M 48 0 L 0 0 0 48' fill='none' stroke='%234f46e5' stroke-width='1.2' stroke-opacity='0.24'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
          }}
        />

        <div
          ref={cursorLightRef}
          className="pointer-events-none absolute h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-pink-500/10 blur-[100px]"
        />

        <div className="absolute right-[-160px] top-[900px] h-[520px] w-[520px] rounded-full bg-indigo-500/[0.06] blur-[110px]" />
        <div className="absolute left-[-180px] top-[2200px] h-[520px] w-[520px] rounded-full bg-purple-500/[0.06] blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
        {/* HERO */}
        <div className="grid min-w-0 grid-cols-1 items-center gap-10 pt-3 lg:grid-cols-12 lg:pt-8">
          <div className="min-w-0 space-y-5 text-center lg:col-span-6 lg:text-left">
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

            <h1
              ref={headlineRef}
              className="text-4xl font-extrabold leading-[1.03] tracking-tight text-slate-900 opacity-0 sm:text-5xl lg:text-6xl"
            >
              Build Your Code.{" "}
              <span className="text-indigo-600">Prove Your Skill.</span> Enter
              The Hall Of Fame.
            </h1>

            <p
              ref={textRef}
              className="mx-auto max-w-xl text-base leading-relaxed text-slate-600 opacity-0 sm:text-lg lg:mx-0"
            >
              HUBWEB is a student developer challenge and talent-discovery
              platform where builders submit real projects, defend their code,
              earn verified recognition, and compete for category and season
              awards.
            </p>

            <div
              ref={pillsRef}
              className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-3"
            >
              <FeaturePill
                icon={<Sparkles className="h-4 w-4" />}
                title="100% Free Entry"
                text="Submit without an upfront fee"
              />

              <FeaturePill
                icon={<ShieldCheck className="h-4 w-4" />}
                title="Verified Code Defense"
                text="Show true project ownership"
              />

              <FeaturePill
                icon={<Users className="h-4 w-4" />}
                title="Talent Visibility"
                text="Build a project-backed profile"
              />
            </div>

            <div
              ref={buttonsRef}
              className="flex flex-col items-center justify-center gap-3 pt-2 opacity-0 sm:flex-row lg:justify-start"
            >
              <a
                href="/upload"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:-translate-y-0.5 hover:bg-indigo-700 sm:w-auto"
              >
                Submit Your GitHub Project
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="/hall-of-fame"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-7 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-white sm:w-auto"
              >
                Explore Hall of Fame
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100">
                  <Play className="h-2.5 w-2.5 fill-slate-700 text-slate-700" />
                </span>
              </a>
            </div>
          </div>

          <div className="min-w-0 w-full lg:col-span-6 [perspective:1200px]">
            <div
              ref={cardRef}
              className="relative z-20 block w-full min-w-0 overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-2xl"
              style={{
                transformStyle: "preserve-3d",
                transformPerspective: 1200,
              }}
            >
              <div
                ref={cardLightRef}
                className="pointer-events-none absolute left-0 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/15 opacity-0 blur-3xl"
              />

              <div
                className="relative z-10 flex items-center justify-between border-b border-slate-100 pb-4"
                style={{ transform: "translateZ(30px)" }}
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

              <div
                className="relative z-10 grid gap-3 pt-5 sm:grid-cols-2"
                style={{ transform: "translateZ(20px)" }}
              >
                <CardField label="Status" value="Verified Finalist" verified />
                <CardField label="Code Defense Score" value="94 / 100" />
                <CardField label="Rank" value="#1 AI Track" />
                <CardField label="Season" value="Season 01" />
              </div>

              <div
                className="relative z-10 mt-5 flex items-center justify-between rounded-2xl bg-slate-50 p-4"
                style={{ transform: "translateZ(15px)" }}
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

        {/* PLATFORM ECOSYSTEM */}
        <div className="home-reveal mt-24 border-y border-slate-200/80 py-8">
          <div className="mb-6 flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-indigo-600">
                Platform Ecosystem
              </p>
              <h2 className="mt-1 text-lg font-black text-slate-900 sm:text-xl">
                Built around real project evidence.
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-relaxed text-slate-500">
              Repository submission, technical verification, recognition, and
              talent discovery are connected into one student journey.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <EcosystemItem
              icon={<GitBranch className="h-5 w-5" />}
              title="GitHub Repository"
              text="Project evidence"
            />
            <EcosystemItem
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Code Verification"
              text="Ownership defense"
            />
            <EcosystemItem
              icon={<Award className="h-5 w-5" />}
              title="Recognition"
              text="Season achievements"
            />
            <EcosystemItem
              icon={<BriefcaseBusiness className="h-5 w-5" />}
              title="Talent Discovery"
              text="Project-backed profiles"
            />
          </div>
        </div>

        {/* WHAT HUBWEB IS */}
        <div className="home-reveal mt-28 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel>WHAT HUBWEB IS</SectionLabel>
            <h2 className="mt-4 max-w-4xl text-4xl font-black leading-[0.98] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              A platform for students to{" "}
              <span className="text-indigo-600">
                prove skill through projects.
              </span>
            </h2>
          </div>

          <div className="lg:col-span-5">
            <p className="text-base leading-7 text-slate-600 sm:text-lg">
              Marks and certificates show learning. Projects show execution.
              HUBWEB is designed to help student developers present work, verify
              ownership, compete against relevant technical peers, and build a
              stronger public proof-of-skill profile.
            </p>
          </div>
        </div>

        <div className="home-card-grid mt-10 grid gap-5 md:grid-cols-3">
          <InfoCard
            icon={<GraduationCap className="h-5 w-5" />}
            eyebrow="FOR STUDENTS"
            title="Build proof beyond a résumé."
            text="Submit something you have actually built and turn it into structured evidence of skill."
          />
          <InfoCard
            icon={<Building2 className="h-5 w-5" />}
            eyebrow="FOR INSTITUTES"
            title="Show what your students can build."
            text="Create stronger visibility around practical work, not only classroom scores or certificates."
          />
          <InfoCard
            icon={<BriefcaseBusiness className="h-5 w-5" />}
            eyebrow="FOR INDUSTRY"
            title="Discover talent through execution."
            text="Explore developers through projects, verification signals, and category-level achievements."
          />
        </div>

        {/* DOMAINS */}
        <div id="domains" className="home-reveal mt-32">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionLabel>CORE COMPETITION DOMAINS</SectionLabel>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                Choose what you build.
              </h2>
            </div>

            <div className="max-w-xl md:text-right">
              <p className="text-base leading-7 text-slate-500">
                Projects are evaluated inside relevant technical tracks so
                students are compared with peers solving similar engineering
                problems.
              </p>
            </div>
          </div>
        </div>

        <div className="home-card-grid mt-10 grid gap-5 md:grid-cols-2">
          {domains.map((domain) => (
            <DomainCard key={domain.number} {...domain} />
          ))}
        </div>

        <div className="home-reveal mt-7 flex justify-center">
          <a
            href="/categories"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-600"
          >
            Explore All Competition Tracks
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* PROCESS */}
        <div id="how-it-works" className="home-reveal mt-32 text-center">
          <SectionLabel>HOW HUBWEB WORKS</SectionLabel>

          <h2 className="mx-auto mt-4 max-w-5xl text-5xl font-black leading-[0.95] tracking-tight text-slate-900 sm:text-6xl md:text-7xl">
            Submit. Verify. Defend.{" "}
            <span className="text-indigo-600">Get Recognized.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-slate-500 sm:text-lg">
            One clear flow takes a student from an existing project to a
            verified competition profile and finalist recognition.
          </p>
        </div>

        <div className="home-card-grid mt-16 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {steps.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>

        {/* VERIFICATION */}
        <div className="home-reveal mt-32 overflow-hidden rounded-[34px] bg-slate-950 text-white shadow-2xl shadow-slate-900/10">
          <div className="grid lg:grid-cols-12">
            <div className="p-7 sm:p-10 lg:col-span-7 lg:p-14">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5">
                <ShieldCheck className="h-4 w-4 text-indigo-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-300">
                  Verification Layer
                </span>
              </div>

              <h2 className="mt-6 max-w-3xl text-4xl font-black leading-[1] tracking-tight sm:text-5xl">
                A screenshot is not proof.{" "}
                <span className="text-indigo-400">
                  Your code should tell the story.
                </span>
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400">
                Shortlisted projects can move through a technical defense where
                developers explain their code structure, architecture,
                decisions, dependencies, and contribution.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <VerificationPoint text="Repository and project review" />
                <VerificationPoint text="Live architecture explanation" />
                <VerificationPoint text="Code ownership questions" />
                <VerificationPoint text="AI-tool disclosure" />
                <VerificationPoint text="Technical scoring" />
                <VerificationPoint text="Final verification status" />
              </div>
            </div>

            <div className="relative border-t border-white/10 bg-white/[0.035] p-7 sm:p-10 lg:col-span-5 lg:border-l lg:border-t-0 lg:p-12">
              <div className="absolute right-[-80px] top-[-80px] h-64 w-64 rounded-full bg-indigo-500/20 blur-[90px]" />

              <p className="relative text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">
                VERIFIED PROFILE SIGNALS
              </p>

              <div className="relative mt-7 space-y-4">
                <DarkMetric
                  label="Project"
                  value="Repository + Live Product"
                  icon={<Code2 className="h-4 w-4" />}
                />
                <DarkMetric
                  label="Technical"
                  value="Live Code Defense"
                  icon={<BrainCircuit className="h-4 w-4" />}
                />
                <DarkMetric
                  label="Recognition"
                  value="Finalist / Category / Season"
                  icon={<Award className="h-4 w-4" />}
                />
                <DarkMetric
                  label="Discovery"
                  value="Hall of Fame Profile"
                  icon={<Globe2 className="h-4 w-4" />}
                />
              </div>
            </div>
          </div>
        </div>

        {/* STUDENT BENEFITS */}
        <div className="home-reveal mt-32">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <SectionLabel>WHY STUDENTS JOIN</SectionLabel>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                More than a competition entry.
              </h2>
            </div>

            <p className="text-base leading-7 text-slate-500 lg:col-span-5">
              Every part of the platform is designed around one idea: help
              students turn real technical work into clearer, more credible
              proof of skill.
            </p>
          </div>
        </div>

        <div className="home-card-grid mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <BenefitCard key={benefit.title} {...benefit} />
          ))}
        </div>

        {/* AUDIENCE */}
        <div className="home-reveal mt-32">
          <SectionLabel>BUILT FOR AN ECOSYSTEM</SectionLabel>
          <h2 className="mt-4 max-w-4xl text-4xl font-black leading-[1] tracking-tight text-slate-900 sm:text-5xl">
            Students build. Institutes enable.{" "}
            <span className="text-indigo-600">Industry discovers.</span>
          </h2>
        </div>

        <div className="home-card-grid mt-10 grid gap-6 lg:grid-cols-2">
          <AudienceCard
            icon={<Building2 className="h-6 w-6" />}
            eyebrow="FOR INSTITUTES & COLLEGES"
            title="Give student projects a stronger public stage."
            text="Use HUBWEB as an external challenge layer for practical work, student recognition, institute visibility, and project-led achievement."
            bullets={[
              "Student participation visibility",
              "Institute-level recognition",
              "Project and finalist showcase",
              "Challenge collaboration opportunities",
            ]}
            link="/about"
            button="Explore Institute Participation"
          />

          <AudienceCard
            icon={<BriefcaseBusiness className="h-6 w-6" />}
            eyebrow="FOR COMPANIES & SPONSORS"
            title="Discover developers through what they have built."
            text="Support category challenges, create real-world problem statements, and explore talent through project evidence instead of only résumé keywords."
            bullets={[
              "Challenge sponsorship opportunities",
              "Project-backed talent discovery",
              "Finalist and category visibility",
              "Employer and technology branding",
            ]}
            link="/about"
            button="Explore Industry Partnerships"
          />
        </div>

        {/* PARTICIPATION MODEL */}
        <div className="home-reveal mt-32 overflow-hidden rounded-[32px] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-7 sm:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <SectionLabel>PARTICIPATION MODEL</SectionLabel>
              <h2 className="mt-4 text-4xl font-black leading-[1] tracking-tight text-slate-900 sm:text-5xl">
                Start with your project.{" "}
                <span className="text-indigo-600">Entry stays simple.</span>
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                Students can begin by submitting an existing eligible project.
                Any finalist-stage fees, event passes, or optional paid
                experiences should be shown clearly before a student commits to
                them.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1">
              <AccessRow
                title="Student Submission"
                value="FREE"
                text="No upfront project submission fee"
              />
              <AccessRow
                title="Finalist Experience"
                value="IF APPLICABLE"
                text="Disclosed before confirmation"
              />
              <AccessRow
                title="Institute / Industry"
                value="PARTNERSHIP"
                text="Custom collaboration model"
              />
            </div>
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="home-reveal mt-32 overflow-hidden rounded-[36px] bg-indigo-600 px-7 py-12 text-white shadow-2xl shadow-indigo-600/20 sm:px-10 sm:py-16 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5">
                <Rocket className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  SEASON 01
                </span>
              </div>

              <h2 className="mt-5 text-4xl font-black leading-[0.98] tracking-tight sm:text-5xl lg:text-6xl">
                Your best project should not stay hidden in a folder.
              </h2>

              <p className="mt-5 max-w-2xl text-base leading-7 text-indigo-100 sm:text-lg">
                Submit your GitHub project, enter the evaluation flow, and build
                a stronger proof-of-skill profile through HUBWEB.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:col-span-4">
              <a
                href="/upload"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-black text-indigo-700 shadow-xl transition hover:-translate-y-0.5"
              >
                Start Your Submission
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="/categories"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/[0.06] px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Explore Competition Tracks
              </a>
            </div>
          </div>
        </div>

        <div className="home-reveal mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-7 text-center sm:flex-row sm:text-left">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-900">
              HUBWEB • Student Developer Challenge Platform
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Project submission • Technical verification • Recognition • Talent
              discovery
            </p>
          </div>

          <a
            href="/about"
            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 transition hover:text-indigo-700"
          >
            Learn more about HUBWEB
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

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

function EcosystemItem({ icon, title, text }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-black text-slate-900">{title}</p>
        <p className="mt-0.5 truncate text-xs text-slate-500">{text}</p>
      </div>
    </div>
  );
}

function InfoCard({ icon, eyebrow, title, text }) {
  return (
    <article className="home-reveal-card rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        {icon}
      </div>

      <p className="mt-6 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600">
        {eyebrow}
      </p>

      <h3 className="mt-2 text-xl font-black leading-tight text-slate-900">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">{text}</p>
    </article>
  );
}

function DomainCard({ number, icon, title, stack, text }) {
  return (
    <article className="home-reveal-card group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="pointer-events-none absolute right-[-70px] top-[-70px] h-48 w-48 rounded-full bg-indigo-500/[0.07] blur-3xl transition group-hover:bg-indigo-500/[0.12]" />

      <div className="relative flex items-start justify-between">
        <span className="text-5xl font-black tracking-tight text-slate-100">
          {number}
        </span>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
          {icon}
        </div>
      </div>

      <div className="relative mt-8">
        <h3 className="text-2xl font-black leading-tight text-slate-900">
          {title}
        </h3>

        <p className="mt-3 text-[10px] font-black uppercase tracking-[0.14em] text-indigo-600">
          {stack}
        </p>

        <p className="mt-4 text-sm leading-6 text-slate-500">{text}</p>

        <a
          href="/categories"
          className="mt-7 inline-flex items-center gap-2 text-sm font-black text-slate-900 transition group-hover:text-indigo-600"
        >
          Explore Track
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}

function StepCard({ number, icon, title, text }) {
  return (
    <article className="home-reveal-card relative rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <span className="text-3xl font-black text-slate-200">{number}</span>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          {icon}
        </div>
      </div>

      <h3 className="mt-7 text-lg font-black leading-tight text-slate-900">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-500">{text}</p>
    </article>
  );
}

function VerificationPoint({ text }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
      <span className="text-sm font-semibold text-slate-200">{text}</span>
    </div>
  );
}

function DarkMetric({ label, value, icon }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-black uppercase tracking-[0.16em] text-slate-500">
          {label}
        </p>
        <p className="mt-1 text-sm font-black text-white">{value}</p>
      </div>
    </div>
  );
}

function BenefitCard({ icon, title, text }) {
  return (
    <article className="home-reveal-card rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-200">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-black text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </article>
  );
}

function AudienceCard({ icon, eyebrow, title, text, bullets, link, button }) {
  return (
    <article className="home-reveal-card overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
      <div className="p-7 sm:p-9">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
          {icon}
        </div>

        <p className="mt-7 text-[9px] font-black uppercase tracking-[0.22em] text-indigo-600">
          {eyebrow}
        </p>

        <h3 className="mt-3 max-w-xl text-3xl font-black leading-[1.05] tracking-tight text-slate-900">
          {title}
        </h3>

        <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">{text}</p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {bullets.map((bullet) => (
            <div key={bullet} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span className="text-sm font-semibold text-slate-700">
                {bullet}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/70 px-7 py-5 sm:px-9">
        <a
          href={link}
          className="inline-flex items-center gap-2 text-sm font-black text-indigo-600 transition hover:gap-3"
        >
          {button}
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}

function AccessRow({ title, value, text }) {
  return (
    <div className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-black text-slate-900">{title}</p>
        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-indigo-600">
          {value}
        </span>
      </div>

      <p className="mt-1.5 text-xs text-slate-500">{text}</p>
    </div>
  );
}

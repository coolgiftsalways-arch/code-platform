import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   DEVNEX CATEGORY DATA
========================================================= */

const categories = [
  {
    number: "01",
    slug: "web-full-stack",
    icon: "code",
    eyebrow: "WEB SYSTEMS",
    title: "Web & Full-Stack Development",
    stack:
      "HTML · CSS · JavaScript · React · Next.js · Node.js · PHP · MongoDB · MySQL",
    description:
      "Build complete digital experiences for the web — from responsive interfaces and e-commerce platforms to APIs, dashboards, portals, and production-style full-stack products.",
    examples: [
      "Full-stack applications",
      "E-commerce platforms",
      "Dashboards & portals",
      "REST / backend APIs",
    ],
    accent: "from-indigo-500/20 via-indigo-500/5 to-transparent",
  },
  {
    number: "02",
    slug: "ai-machine-learning",
    icon: "brain",
    eyebrow: "INTELLIGENT SYSTEMS",
    title: "AI & Machine Learning",
    stack:
      "Python · TensorFlow · PyTorch · OpenAI · NLP · Computer Vision · Scikit-learn",
    description:
      "Create intelligent systems that predict, understand, generate, recommend, automate, or learn from data and real-world inputs.",
    examples: [
      "AI assistants",
      "Computer vision",
      "Recommendation systems",
      "Prediction engines",
    ],
    accent: "from-violet-500/20 via-violet-500/5 to-transparent",
  },
  {
    number: "03",
    slug: "mobile-development",
    icon: "phone",
    eyebrow: "MOBILE PRODUCTS",
    title: "Mobile Application Development",
    stack: "Flutter · React Native · Kotlin · Swift · Firebase · Android",
    description:
      "Build Android, iOS, and cross-platform applications designed around real users, mobile workflows, and device-first experiences.",
    examples: [
      "Android applications",
      "Cross-platform apps",
      "Productivity tools",
      "Community applications",
    ],
    accent: "from-cyan-500/20 via-cyan-500/5 to-transparent",
  },
  {
    number: "04",
    slug: "saas-automation",
    icon: "workflow",
    eyebrow: "UTILITY SYSTEMS",
    title: "SaaS & Utility Automation",
    stack:
      "React · Node.js · Python · APIs · Extensions · Automation · Integrations",
    description:
      "Turn everyday problems into focused products, productivity tools, browser extensions, internal systems, and workflow automation.",
    examples: [
      "Micro-SaaS products",
      "Workflow automation",
      "Browser extensions",
      "Developer utilities",
    ],
    accent: "from-amber-500/20 via-amber-500/5 to-transparent",
  },
  {
    number: "05",
    slug: "data-science",
    icon: "chart",
    eyebrow: "DATA & INSIGHTS",
    title: "Data Science & Analytics",
    stack: "Python · SQL · Pandas · Power BI · Tableau · Excel · Matplotlib",
    description:
      "Transform raw information into useful insights through analytics, dashboards, forecasting, visualisation, and business intelligence.",
    examples: [
      "Analytics dashboards",
      "Forecasting systems",
      "Data visualisation",
      "Business intelligence",
    ],
    accent: "from-emerald-500/20 via-emerald-500/5 to-transparent",
  },
  {
    number: "06",
    slug: "cybersecurity",
    icon: "shield",
    eyebrow: "SECURITY SYSTEMS",
    title: "Cybersecurity",
    stack: "Python · Linux · Networking · OWASP · Cryptography · Security APIs",
    description:
      "Build, analyse, test, and understand secure digital systems through defensive tooling, authentication, monitoring, and security research.",
    examples: [
      "Security dashboards",
      "Network monitoring",
      "Auth systems",
      "Educational security tools",
    ],
    accent: "from-rose-500/20 via-rose-500/5 to-transparent",
  },
  {
    number: "07",
    slug: "cloud-devops",
    icon: "cloud",
    eyebrow: "INFRASTRUCTURE",
    title: "Cloud & DevOps",
    stack: "AWS · Azure · Docker · Kubernetes · GitHub Actions · Linux · Nginx",
    description:
      "Build infrastructure that keeps applications deployable, scalable, observable, and reliable across development and production environments.",
    examples: [
      "Cloud deployments",
      "CI/CD pipelines",
      "Container systems",
      "Monitoring setups",
    ],
    accent: "from-sky-500/20 via-sky-500/5 to-transparent",
  },
  {
    number: "08",
    slug: "ui-ux-product-design",
    icon: "palette",
    eyebrow: "DIGITAL EXPERIENCE",
    title: "UI/UX & Product Design",
    stack: "Figma · Framer · Adobe XD · Photoshop · Illustrator · Prototyping",
    description:
      "Design digital products that are useful, understandable, visually strong, and easy to navigate — from research to polished interface systems.",
    examples: [
      "Mobile UI/UX",
      "SaaS interfaces",
      "Design systems",
      "Interactive prototypes",
    ],
    accent: "from-fuchsia-500/20 via-fuchsia-500/5 to-transparent",
  },
];

const projectStrength = [
  {
    number: "01",
    icon: "target",
    title: "Problem & Purpose",
    text: "A strong project clearly explains why it exists, who it helps, and what problem it is trying to solve.",
  },
  {
    number: "02",
    icon: "code",
    title: "Technical Execution",
    text: "The core functionality should work properly and demonstrate meaningful engineering or design effort.",
  },
  {
    number: "03",
    icon: "layers",
    title: "Code & Architecture",
    text: "Structure, maintainability, data flow, APIs, components, and implementation choices should make sense.",
  },
  {
    number: "04",
    icon: "sparkles",
    title: "Original Contribution",
    text: "Students should be able to explain what they personally created, changed, designed, or improved.",
  },
  {
    number: "05",
    icon: "eye",
    title: "Product Experience",
    text: "The project should be understandable, usable, responsive, and presented with attention to the experience.",
  },
  {
    number: "06",
    icon: "book",
    title: "Documentation",
    text: "A reviewer should be able to understand the project, technology stack, setup, and major decisions.",
  },
];

/* =========================================================
   INLINE ICONS
   No lucide-react dependency
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
    code: (
      <>
        <path d="m8 9-4 3 4 3" />
        <path d="m16 9 4 3-4 3" />
        <path d="m14 5-4 14" />
      </>
    ),
    brain: (
      <>
        <path d="M9.5 4A3.5 3.5 0 0 0 6 7.5c0 .5.1 1 .3 1.4A3.5 3.5 0 0 0 7.5 15H9" />
        <path d="M14.5 4A3.5 3.5 0 0 1 18 7.5c0 .5-.1 1-.3 1.4A3.5 3.5 0 0 1 16.5 15H15" />
        <path d="M12 4v16" />
        <path d="M8 20a4 4 0 0 1-1-7.9" />
        <path d="M16 20a4 4 0 0 0 1-7.9" />
      </>
    ),
    phone: (
      <>
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <path d="M11 18h2" />
      </>
    ),
    workflow: (
      <>
        <rect x="3" y="3" width="6" height="6" rx="1" />
        <rect x="15" y="15" width="6" height="6" rx="1" />
        <path d="M9 6h4a2 2 0 0 1 2 2v7" />
        <path d="m12 12 3 3 3-3" />
      </>
    ),
    chart: (
      <>
        <path d="M4 20V10" />
        <path d="M9 20V4" />
        <path d="M14 20v-7" />
        <path d="M19 20V7" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    cloud: (
      <path d="M17.5 19H7a5 5 0 0 1-.8-9.9A7 7 0 0 1 19.6 11 4 4 0 0 1 17.5 19Z" />
    ),
    palette: (
      <>
        <path d="M12 3a9 9 0 0 0 0 18h1.4a2 2 0 0 0 1.5-3.3 2 2 0 0 1 1.5-3.3H18A3 3 0 0 0 21 11a9 9 0 0 0-9-8Z" />
        <circle cx="7.5" cy="10" r=".8" fill="currentColor" stroke="none" />
        <circle cx="10" cy="6.5" r=".8" fill="currentColor" stroke="none" />
        <circle cx="14" cy="6.5" r=".8" fill="currentColor" stroke="none" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" />
      </>
    ),
    layers: (
      <>
        <path d="m12 2 9 5-9 5-9-5 9-5Z" />
        <path d="m3 12 9 5 9-5" />
        <path d="m3 17 9 5 9-5" />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 3-1.2 3.8L7 8l3.8 1.2L12 13l1.2-3.8L17 8l-3.8-1.2L12 3Z" />
        <path d="m19 13-.7 2.3L16 16l2.3.7L19 19l.7-2.3L22 16l-2.3-.7L19 13Z" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    book: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
  };

  return <svg {...common}>{icons[name]}</svg>;
}

/* =========================================================
   PAGE
========================================================= */

export default function CategoriesPage() {
  const navigate = useNavigate();

  const pageRef = useRef(null);
  const heroVisualRef = useRef(null);
  const heroGlowRef = useRef(null);
  const bgGridRef = useRef(null);

  const [activeCategory, setActiveCategory] = useState(0);

  /* =====================================================
     ANIMATIONS
  ===================================================== */

  useEffect(() => {
    const page = pageRef.current;

    if (!page) return;

    const ctx = gsap.context(() => {
      const hero = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      hero
        .fromTo(
          ".cat-kicker",
          {
            opacity: 0,
            y: 18,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
          },
        )
        .fromTo(
          ".cat-title-line",
          {
            opacity: 0,
            y: 80,
            rotateX: -16,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.85,
            stagger: 0.1,
          },
          "-=0.25",
        )
        .fromTo(
          ".cat-intro",
          {
            opacity: 0,
            y: 24,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
          },
          "-=0.45",
        )
        .fromTo(
          ".cat-hero-actions",
          {
            opacity: 0,
            y: 18,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
          },
          "-=0.35",
        )
        .fromTo(
          heroVisualRef.current,
          {
            opacity: 0,
            y: 35,
            scale: 0.95,
            rotateY: -5,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateY: 0,
            duration: 0.9,
          },
          "-=0.6",
        );

      gsap.to(".hero-orbit-a", {
        rotation: 360,
        duration: 24,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });

      gsap.to(".hero-orbit-b", {
        rotation: -360,
        duration: 34,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });

      gsap.to(".hero-pulse", {
        scale: 1.18,
        opacity: 0.45,
        duration: 2.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      gsap.to(".marquee-track", {
        xPercent: -50,
        duration: 28,
        repeat: -1,
        ease: "none",
      });

      gsap.utils.toArray(".cat-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          {
            opacity: 0,
            y: 48,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 86%",
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray(".category-card").forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 60,
            scale: 0.97,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            delay: (index % 2) * 0.05,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              once: true,
            },
          },
        );

        const shine = card.querySelector(".card-shine");

        const move = (event) => {
          const rect = card.getBoundingClientRect();

          const x = (event.clientX - rect.left) / rect.width - 0.5;

          const y = (event.clientY - rect.top) / rect.height - 0.5;

          gsap.to(card, {
            rotateY: x * 5,
            rotateX: y * -5,
            y: -8,
            duration: 0.35,
            ease: "power2.out",
            transformPerspective: 1000,
            transformOrigin: "center center",
            overwrite: true,
          });

          if (shine) {
            gsap.to(shine, {
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
              opacity: 1,
              duration: 0.25,
              overwrite: true,
            });
          }
        };

        const leave = () => {
          gsap.to(card, {
            rotateY: 0,
            rotateX: 0,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
          });

          if (shine) {
            gsap.to(shine, {
              opacity: 0,
              duration: 0.25,
            });
          }
        };

        card.addEventListener("mousemove", move);
        card.addEventListener("mouseleave", leave);

        card._devnexMove = move;
        card._devnexLeave = leave;
      });

      gsap.utils.toArray(".strength-card").forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.04,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 89%",
              once: true,
            },
          },
        );
      });

      gsap.fromTo(
        ".cta-panel",
        {
          opacity: 0,
          scale: 0.97,
          y: 40,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cta-panel",
            start: "top 86%",
            once: true,
          },
        },
      );
    }, page);

    const handleMouseMove = (event) => {
      const rect = page.getBoundingClientRect();

      const x = event.clientX - rect.left;

      const y = event.clientY - rect.top;

      if (bgGridRef.current) {
        gsap.to(bgGridRef.current, {
          x: (x / rect.width - 0.5) * 20,
          y: (y / rect.height - 0.5) * 20,
          duration: 1,
          ease: "power3.out",
          overwrite: true,
        });
      }

      if (heroGlowRef.current) {
        gsap.to(heroGlowRef.current, {
          x,
          y,
          duration: 0.5,
          ease: "power2.out",
          overwrite: true,
        });
      }
    };

    page.addEventListener("mousemove", handleMouseMove);

    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      window.clearTimeout(refreshTimer);

      page.removeEventListener("mousemove", handleMouseMove);

      page.querySelectorAll(".category-card").forEach((card) => {
        if (card._devnexMove) {
          card.removeEventListener("mousemove", card._devnexMove);
        }

        if (card._devnexLeave) {
          card.removeEventListener("mouseleave", card._devnexLeave);
        }
      });

      ctx.revert();
    };
  }, []);

  /* =====================================================
     AUTO CATEGORY ROTATION
  ===================================================== */

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveCategory((current) => (current + 1) % categories.length);
    }, 2600);

    return () => window.clearInterval(interval);
  }, []);

  const goToSubmit = () => {
    navigate("/upload");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const goToGallery = () => {
    navigate("/features");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main
      ref={pageRef}
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#f8f9fc]
        pb-28
        text-slate-950
      "
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          ref={bgGridRef}
          className="
            absolute
            -inset-28
            opacity-[0.55]
          "
          style={{
            backgroundImage:
              "radial-gradient(rgba(79,70,229,0.16) 1px, transparent 1px)",

            backgroundSize: "44px 44px",
          }}
        />

        <div
          ref={heroGlowRef}
          className="
            absolute
            h-[520px]
            w-[520px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-gradient-to-r
            from-indigo-500/15
            via-violet-500/10
            to-fuchsia-500/10
            blur-[120px]
          "
        />

        <div
          className="
            absolute
            right-[-180px]
            top-[900px]
            h-[520px]
            w-[520px]
            rounded-full
            bg-indigo-500/[0.06]
            blur-[120px]
          "
        />

        <div
          className="
            absolute
            left-[-200px]
            top-[2600px]
            h-[520px]
            w-[520px]
            rounded-full
            bg-fuchsia-500/[0.05]
            blur-[120px]
          "
        />
      </div>

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-7xl
          px-6
        "
      >
        {/* =================================================
            HERO
        ================================================= */}

        <section
          className="
            grid
            min-h-screen
            items-center
            gap-12
            pt-20
            lg:grid-cols-12
          "
        >
          {/* LEFT */}

          <div className="lg:col-span-7">
            <div
              className="
                cat-kicker
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-indigo-100
                bg-white/80
                px-4
                py-2
                shadow-sm
                backdrop-blur-xl
              "
            >
              <Icon name="grid" className="h-4 w-4 text-indigo-600" />

              <span
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.2em]
                  text-indigo-600
                "
              >
                DEVNEX Technical Categories
              </span>
            </div>

            <h1
              className="
                mt-7
                text-[clamp(3.2rem,7vw,6.8rem)]
                font-black
                leading-[0.84]
                tracking-[-0.065em]
              "
            >
              <span
                className="
                  cat-title-line
                  block
                "
              >
                CHOOSE
              </span>

              <span
                className="
                  cat-title-line
                  block
                  text-indigo-600
                "
              >
                WHAT
              </span>

              <span
                className="
                  cat-title-line
                  block
                "
              >
                YOU BUILD.
              </span>
            </h1>

            <p
              className="
                cat-intro
                mt-8
                max-w-2xl
                text-base
                leading-8
                text-slate-600
                sm:text-lg
              "
            >
              Different technical disciplines require different skills. Explore
              student projects by the problems they solve and the technologies
              used to build them.
            </p>

            <div
              className="
                cat-hero-actions
                mt-8
                flex
                flex-col
                gap-3
                sm:flex-row
              "
            >
              <button
                type="button"
                onClick={goToGallery}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-indigo-600
                  px-7
                  py-4
                  text-sm
                  font-black
                  text-white
                  shadow-xl
                  shadow-indigo-600/20
                  transition
                  hover:-translate-y-1
                  hover:bg-indigo-700
                "
              >
                Explore Projects
                <Icon name="arrow" className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={goToSubmit}
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white/90
                  px-7
                  py-4
                  text-sm
                  font-black
                  text-slate-950
                  shadow-sm
                  backdrop-blur
                  transition
                  hover:-translate-y-1
                  hover:border-indigo-200
                  hover:text-indigo-600
                "
              >
                Submit Your Build
              </button>
            </div>

            <div
              className="
                cat-hero-actions
                mt-9
                flex
                flex-wrap
                gap-x-8
                gap-y-3
                text-[10px]
                font-black
                uppercase
                tracking-[0.14em]
                text-slate-400
              "
            >
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-600" />
                08 Technical Categories
              </span>

              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Student Project Discovery
              </span>

              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-violet-500" />
                GitHub + Live Demos
              </span>
            </div>
          </div>

          {/* RIGHT VISUAL */}

          <div
            className="
              lg:col-span-5
              lg:pl-4
            "
          >
            <div
              ref={heroVisualRef}
              className="
                relative
                mx-auto
                max-w-[520px]
                [perspective:1200px]
              "
            >
              <div
                className="
                  relative
                  aspect-square
                  overflow-hidden
                  rounded-[42px]
                  border
                  border-slate-200
                  bg-slate-950
                  shadow-[0_40px_100px_rgba(15,23,42,0.22)]
                "
              >
                <div
                  className="
                    absolute
                    inset-0
                    opacity-[0.08]
                  "
                  style={{
                    backgroundImage: `
                      linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)
                    `,

                    backgroundSize: "34px 34px",
                  }}
                />

                <div
                  className="
                    hero-pulse
                    absolute
                    left-1/2
                    top-1/2
                    h-48
                    w-48
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-indigo-600/30
                    blur-[75px]
                  "
                />

                <div
                  className="
                    hero-orbit-a
                    absolute
                    left-1/2
                    top-1/2
                    h-[72%]
                    w-[72%]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    border
                    border-white/10
                  "
                >
                  <span
                    className="
                      absolute
                      left-1/2
                      top-[-5px]
                      h-2.5
                      w-2.5
                      rounded-full
                      bg-indigo-400
                      shadow-[0_0_20px_rgba(129,140,248,.9)]
                    "
                  />
                </div>

                <div
                  className="
                    hero-orbit-b
                    absolute
                    left-1/2
                    top-1/2
                    h-[52%]
                    w-[52%]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    border
                    border-dashed
                    border-white/15
                  "
                >
                  <span
                    className="
                      absolute
                      bottom-[15%]
                      right-[-4px]
                      h-2
                      w-2
                      rounded-full
                      bg-fuchsia-400
                    "
                  />
                </div>

                {/* ACTIVE CATEGORY */}

                <div
                  className="
                    absolute
                    left-1/2
                    top-1/2
                    w-[78%]
                    -translate-x-1/2
                    -translate-y-1/2
                  "
                >
                  <p
                    className="
                      text-center
                      text-[9px]
                      font-black
                      uppercase
                      tracking-[0.24em]
                      text-indigo-300
                    "
                  >
                    Currently Exploring
                  </p>

                  <div
                    className="
                      mx-auto
                      mt-5
                      flex
                      h-16
                      w-16
                      items-center
                      justify-center
                      rounded-[20px]
                      border
                      border-white/10
                      bg-white/10
                      text-white
                      shadow-2xl
                      backdrop-blur
                    "
                  >
                    <Icon
                      name={categories[activeCategory].icon}
                      className="h-7 w-7"
                    />
                  </div>

                  <h2
                    className="
                      mt-5
                      text-center
                      text-3xl
                      font-black
                      leading-[0.98]
                      tracking-tight
                      text-white
                    "
                  >
                    {categories[activeCategory].title}
                  </h2>

                  <p
                    className="
                      mx-auto
                      mt-4
                      max-w-xs
                      text-center
                      text-xs
                      leading-5
                      text-slate-400
                    "
                  >
                    {categories[activeCategory].stack}
                  </p>
                </div>

                <div
                  className="
                    absolute
                    left-5
                    top-5
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.05]
                    px-3
                    py-1.5
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.16em]
                    text-slate-400
                    backdrop-blur
                  "
                >
                  01 — 08
                </div>

                <div
                  className="
                    absolute
                    bottom-5
                    right-5
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-emerald-400/20
                    bg-emerald-400/10
                    px-3
                    py-1.5
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.14em]
                    text-emerald-300
                  "
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  Explore Freely
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            MARQUEE
        ================================================= */}

        <section
          className="
            cat-reveal
            overflow-hidden
            border-y
            border-slate-200
            py-5
          "
        >
          <div className="marquee-track flex w-max">
            {[...categories, ...categories].map((item, index) => (
              <div
                key={`${item.slug}-${index}`}
                className="
                    flex
                    items-center
                    gap-5
                    pr-10
                    text-sm
                    font-black
                    uppercase
                    tracking-[0.12em]
                    text-slate-400
                  "
              >
                <span className="h-2 w-2 rounded-full bg-indigo-600" />

                {item.title}
              </div>
            ))}
          </div>
        </section>

        {/* =================================================
            INTRO
        ================================================= */}

        <section
          className="
            cat-reveal
            grid
            gap-8
            py-28
            lg:grid-cols-12
            lg:items-end
          "
        >
          <div className="lg:col-span-7">
            <SectionLabel>TECHNICAL CATEGORIES</SectionLabel>

            <h2
              className="
                mt-5
                max-w-4xl
                text-4xl
                font-black
                leading-[0.98]
                tracking-tight
                sm:text-5xl
                lg:text-6xl
              "
            >
              Different fields.
              <span className="block text-indigo-600">
                Different kinds of proof.
              </span>
            </h2>
          </div>

          <p
            className="
              text-base
              leading-7
              text-slate-600
              lg:col-span-5
            "
          >
            DEVNEX organises projects by technical discipline so students can
            present their strongest work clearly and visitors can discover
            relevant talent faster.
          </p>
        </section>

        {/* =================================================
            8 CATEGORIES
        ================================================= */}

        <section
          className="
            grid
            gap-6
            lg:grid-cols-2
          "
        >
          {categories.map((item) => (
            <CategoryCard key={item.number} {...item} onSubmit={goToSubmit} />
          ))}
        </section>

        {/* =================================================
            WHAT MAKES STRONG PROJECT
        ================================================= */}

        <section className="cat-reveal py-32">
          <div
            className="
              grid
              gap-8
              lg:grid-cols-12
              lg:items-end
            "
          >
            <div className="lg:col-span-7">
              <SectionLabel>WHAT MAKES A STRONG PROJECT?</SectionLabel>

              <h2
                className="
                  mt-5
                  max-w-4xl
                  text-4xl
                  font-black
                  leading-[0.98]
                  tracking-tight
                  sm:text-5xl
                "
              >
                Technology matters.
                <span className="block text-indigo-600">
                  Understanding matters more.
                </span>
              </h2>
            </div>

            <p
              className="
                text-base
                leading-7
                text-slate-600
                lg:col-span-5
              "
            >
              Strong work is more than a polished screenshot. DEVNEX looks at
              the problem, execution, architecture, contribution, experience,
              and clarity behind the project.
            </p>
          </div>

          <div
            className="
              mt-12
              grid
              gap-5
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            {projectStrength.map((item) => (
              <StrengthCard key={item.number} {...item} />
            ))}
          </div>
        </section>

        {/* =================================================
            DARK FEATURE
        ================================================= */}

        <section
          className="
            cat-reveal
            relative
            overflow-hidden
            rounded-[40px]
            bg-slate-950
            px-7
            py-16
            text-white
            shadow-2xl
            shadow-slate-900/10
            sm:px-10
            lg:px-14
          "
        >
          <div
            className="
              absolute
              inset-0
              opacity-[0.08]
            "
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,.8) 1px, transparent 1px)",

              backgroundSize: "30px 30px",
            }}
          />

          <div
            className="
              absolute
              right-[-100px]
              top-[-120px]
              h-[420px]
              w-[420px]
              rounded-full
              bg-indigo-500/20
              blur-[100px]
            "
          />

          <div
            className="
              relative
              grid
              gap-12
              lg:grid-cols-12
              lg:items-center
            "
          >
            <div className="lg:col-span-7">
              <p
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.24em]
                  text-indigo-300
                "
              >
                ONE PROJECT CAN CROSS MANY TECHNOLOGIES
              </p>

              <h2
                className="
                  mt-5
                  text-4xl
                  font-black
                  leading-[0.98]
                  tracking-tight
                  sm:text-5xl
                  lg:text-6xl
                "
              >
                Choose the category that best describes{" "}
                <span className="text-indigo-400">
                  the project&apos;s core purpose.
                </span>
              </h2>

              <p
                className="
                  mt-6
                  max-w-2xl
                  text-base
                  leading-7
                  text-slate-400
                "
              >
                A project may use React, Python, APIs, AI, databases, cloud
                tools, and design systems together. That is normal. The category
                should describe where the main technical value lives.
              </p>
            </div>

            <div
              className="
                grid
                gap-3
                lg:col-span-5
              "
            >
              <DarkRule
                question="Mostly a complete web product?"
                answer="Web & Full-Stack"
              />

              <DarkRule
                question="AI drives the main value?"
                answer="AI & Machine Learning"
              />

              <DarkRule
                question="Designed around phones?"
                answer="Mobile Development"
              />

              <DarkRule
                question="Automates repetitive work?"
                answer="SaaS & Automation"
              />
            </div>
          </div>
        </section>

        {/* =================================================
            CTA
        ================================================= */}

        <section
          className="
            cta-panel
            relative
            mt-32
            overflow-hidden
            rounded-[40px]
            bg-indigo-600
            px-8
            py-14
            text-white
            shadow-2xl
            shadow-indigo-600/20
            sm:px-12
            sm:py-16
            lg:px-16
          "
        >
          <div
            className="
              absolute
              -right-24
              -top-24
              h-72
              w-72
              rounded-full
              bg-white/10
              blur-[80px]
            "
          />

          <div
            className="
              relative
              grid
              gap-10
              lg:grid-cols-12
              lg:items-center
            "
          >
            <div className="lg:col-span-8">
              <span
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.22em]
                  text-indigo-100
                "
              >
                YOUR PROJECT BELONGS HERE
              </span>

              <h2
                className="
                  mt-4
                  max-w-4xl
                  text-4xl
                  font-black
                  leading-[0.95]
                  tracking-tight
                  sm:text-5xl
                  lg:text-6xl
                "
              >
                CHOOSE YOUR TRACK.
                <span className="block">SUBMIT YOUR BUILD.</span>
              </h2>

              <p
                className="
                  mt-5
                  max-w-2xl
                  text-base
                  leading-7
                  text-indigo-100
                "
              >
                Turn your project into visible proof of what you can build.
              </p>
            </div>

            <div
              className="
                flex
                flex-col
                gap-3
                lg:col-span-4
              "
            >
              <button
                type="button"
                onClick={goToSubmit}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-white
                  px-6
                  py-4
                  text-sm
                  font-black
                  text-indigo-700
                  shadow-xl
                  transition
                  hover:-translate-y-1
                "
              >
                Start Your Submission
                <Icon name="arrow" className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={goToGallery}
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-white/20
                  bg-white/10
                  px-6
                  py-4
                  text-sm
                  font-black
                  text-white
                  transition
                  hover:bg-white/20
                "
              >
                Explore Student Projects
              </button>
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
    <div
      className="
        inline-flex
        items-center
        gap-2
      "
    >
      <span
        className="
          h-2
          w-2
          rounded-full
          bg-indigo-600
        "
      />

      <span
        className="
          text-[10px]
          font-black
          uppercase
          tracking-[0.24em]
          text-indigo-600
        "
      >
        {children}
      </span>
    </div>
  );
}

function CategoryCard({
  number,
  icon,
  eyebrow,
  title,
  stack,
  description,
  examples,
  accent,
  onSubmit,
}) {
  return (
    <article
      className="
        category-card
        group
        relative
        overflow-hidden
        rounded-[34px]
        border
        border-slate-200
        bg-white/85
        p-7
        shadow-sm
        backdrop-blur-xl
        transition-shadow
        duration-500
        hover:border-indigo-200
        hover:shadow-[0_30px_80px_rgba(15,23,42,0.11)]
        sm:p-8
        [transform-style:preserve-3d]
      "
    >
      <div
        className={`
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-br
          ${accent}
          opacity-80
        `}
      />

      <div
        className="
          card-shine
          pointer-events-none
          absolute
          left-0
          top-0
          h-56
          w-56
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-white/60
          opacity-0
          blur-[60px]
        "
      />

      <span
        className="
          pointer-events-none
          absolute
          -right-2
          -top-10
          text-[150px]
          font-black
          leading-none
          tracking-[-0.08em]
          text-slate-950/[0.035]
          transition-transform
          duration-700
          group-hover:translate-x-2
          group-hover:-translate-y-2
        "
      >
        {number}
      </span>

      <div
        className="
          relative
          z-10
        "
        style={{
          transform: "translateZ(20px)",
        }}
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-slate-950
              p-3.5
              text-white
              shadow-lg
              transition
              duration-500
              group-hover:rotate-3
              group-hover:scale-105
              group-hover:bg-indigo-600
            "
          >
            <Icon name={icon} className="h-6 w-6" />
          </div>

          <span
            className="
              rounded-full
              border
              border-slate-200
              bg-white/80
              px-3
              py-1.5
              text-[9px]
              font-black
              uppercase
              tracking-[0.16em]
              text-slate-500
              backdrop-blur
            "
          >
            {eyebrow}
          </span>
        </div>

        <h3
          className="
            mt-8
            max-w-xl
            text-3xl
            font-black
            leading-[0.98]
            tracking-tight
            text-slate-950
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-4
            text-[10px]
            font-black
            uppercase
            leading-5
            tracking-[0.12em]
            text-indigo-600
          "
        >
          {stack}
        </p>

        <p
          className="
            mt-5
            max-w-xl
            text-sm
            leading-7
            text-slate-600
          "
        >
          {description}
        </p>

        <div
          className="
            mt-7
            grid
            gap-2
            sm:grid-cols-2
          "
        >
          {examples.map((item) => (
            <div
              key={item}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-slate-100
                bg-white/65
                px-3
                py-2.5
                backdrop-blur
              "
            >
              <span
                className="
                  flex
                  h-5
                  w-5
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-indigo-50
                  text-indigo-600
                "
              >
                <Icon name="check" className="h-3 w-3" />
              </span>

              <span
                className="
                  text-xs
                  font-semibold
                  text-slate-700
                "
              >
                {item}
              </span>
            </div>
          ))}
        </div>

        <div
          className="
            mt-8
            flex
            items-center
            justify-between
            gap-4
            border-t
            border-slate-100
            pt-5
          "
        >
          <span
            className="
              text-[9px]
              font-black
              uppercase
              tracking-[0.14em]
              text-slate-400
            "
          >
            Explore this technical track
          </span>

          <button
            type="button"
            onClick={onSubmit}
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-slate-950
              text-white
              transition
              duration-300
              group-hover:bg-indigo-600
            "
          >
            <Icon name="arrow" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

function StrengthCard({ number, icon, title, text }) {
  return (
    <article
      className="
        strength-card
        rounded-[28px]
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        transition
        duration-300
        hover:-translate-y-1
        hover:border-indigo-200
        hover:shadow-lg
      "
    >
      <div
        className="
          flex
          items-start
          justify-between
        "
      >
        <span
          className="
            text-4xl
            font-black
            text-slate-100
          "
        >
          {number}
        </span>

        <div
          className="
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
          <Icon name={icon} className="h-4 w-4" />
        </div>
      </div>

      <h3
        className="
          mt-6
          text-lg
          font-black
          text-slate-950
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-3
          text-sm
          leading-6
          text-slate-500
        "
      >
        {text}
      </p>
    </article>
  );
}

function DarkRule({ question, answer }) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-white/[0.05]
        p-4
        backdrop-blur
      "
    >
      <p
        className="
          text-xs
          font-semibold
          text-slate-400
        "
      >
        {question}
      </p>

      <p
        className="
          mt-1
          text-sm
          font-black
          text-white
        "
      >
        {answer}
      </p>
    </div>
  );
}

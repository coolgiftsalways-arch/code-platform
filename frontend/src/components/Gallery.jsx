import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* =========================================================
   LOCAL MEDIA
========================================================= */

import one from "../Image/Topone.MP4";
import two from "../Image/gmtwo.mp4";
import three from "../Image/gkten.MP4";
import four from "../Image/markit.MP4";
import five from "../Image/AI.mp4";

import one1 from "../Image/mgone.JPG";
import two1 from "../Image/mgtwo.JPG";
import there1 from "../Image/market.jpg";
import Four from "../Image/AI.png";
import six from "../Image/saas.png";
import sixe from "../Image/app.png";

gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   DATA
========================================================= */

const featuredProjects = [
  {
    id: 1,
    src: one,
    title: "DEVNEX Project Archive",
    category: "PROJECT SHOWCASE",
    description:
      "A visual collection of student-built products, technical experiments, portfolio work, and practical software projects.",
    stack: "PROJECTS • CODE • PRODUCT",
  },
  {
    id: 2,
    src: two,
    title: "Web & Full-Stack Development",
    category: "WEB",
    description:
      "Production-style websites, portals, dashboards, marketplaces, APIs, and full-stack applications.",
    stack: "REACT • NODE • APIs",
  },
  {
    id: 3,
    src: three,
    title: "SaaS & Utility Automation",
    category: "AUTOMATION",
    description:
      "Workflow tools, browser utilities, developer products, micro-SaaS, and business automation.",
    stack: "APIs • DEVTOOLS • SAAS",
  },
  {
    id: 4,
    src: four,
    title: "Mobile Application Development",
    category: "MOBILE",
    description:
      "Mobile-first products built around productivity, education, communities, services, and real user needs.",
    stack: "FLUTTER • REACT NATIVE",
  },
  {
    id: 5,
    src: five,
    title: "AI & Machine Learning",
    category: "AI / ML",
    description:
      "AI assistants, intelligent workflows, prediction systems, computer vision, and practical ML products.",
    stack: "PYTHON • ML • GENAI",
  },
];

const archiveItems = [
  {
    id: 1,
    src: one1,
    title: "Web Development",
    category: "FULL-STACK",
    meta: "Web application architecture",
  },
  {
    id: 2,
    src: two1,
    title: "Future Interface",
    category: "PRODUCT UI",
    meta: "Interactive product experience",
  },
  {
    id: 3,
    src: there1,
    title: "Product Systems",
    category: "DIGITAL PRODUCT",
    meta: "User flows and product design",
  },
  {
    id: 4,
    src: Four,
    title: "AI & Machine Learning",
    category: "AI / ML",
    meta: "Intelligent application layer",
  },
  {
    id: 5,
    src: six,
    title: "SaaS & Utility Automation",
    category: "AUTOMATION",
    meta: "Workflow and utility products",
  },
  {
    id: 6,
    src: sixe,
    title: "Mobile Application",
    category: "MOBILE",
    meta: "Mobile-first product experience",
  },
];

const proofPoints = [
  {
    icon: "github",
    title: "Repository Evidence",
    text: "A public repository can show structure, implementation choices, documentation, and technical depth.",
  },
  {
    icon: "globe",
    title: "Live Product",
    text: "A working deployment helps visitors understand how the project behaves as a real experience.",
  },
  {
    icon: "shield",
    title: "Project Ownership",
    text: "Strong profiles make the student's contribution, decisions, and technical understanding easier to see.",
  },
  {
    icon: "award",
    title: "Recognition Layer",
    text: "Selected work can become featured, category-highlighted, or part of the Hall of Fame.",
  },
];

const profileItems = [
  "Project title, problem, and solution",
  "Student or team profile",
  "Technical category and technology stack",
  "Public GitHub repository and live demo",
  "Project story, decisions, and challenges",
  "Recognition or Hall of Fame placement",
];

const flowItems = [
  {
    number: "01",
    icon: "layers",
    title: "Submit",
    text: "A student shares the project, category, technology stack, repository, demo, and context.",
  },
  {
    number: "02",
    icon: "eye",
    title: "Review",
    text: "The project is presented with enough technical and product context for visitors to understand it.",
  },
  {
    number: "03",
    icon: "shield",
    title: "Prove",
    text: "Clear project evidence helps show ownership, execution, and practical understanding.",
  },
  {
    number: "04",
    icon: "award",
    title: "Get Seen",
    text: "Strong work can move into featured collections, category highlights, and recognition surfaces.",
  },
];

/* =========================================================
   INLINE ICONS
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
      </>
    ),

    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </>
    ),

    github: (
      <>
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.5 5.5 0 0 0 19.3 3.7 5.1 5.1 0 0 0 19.2 0S18 0 15 1.7a13.4 13.4 0 0 0-7 0C5 0 3.8 0 3.8 0a5.1 5.1 0 0 0-.1 3.7A5.5 5.5 0 0 0 2.2 7.5c0 5.4 3.5 6.6 6.8 7A4.8 4.8 0 0 0 8 18v4" />
        <path d="M8 19c-3 .9-3-1.5-4-2" />
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

    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),

    file: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8" />
        <path d="M8 17h6" />
      </>
    ),

    check: <path d="m5 12 4 4L19 6" />,

    mouse: (
      <>
        <rect x="7" y="2" width="10" height="20" rx="5" />
        <path d="M12 6v4" />
      </>
    ),
  };

  return <svg {...common}>{icons[name]}</svg>;
}

/* =========================================================
   AUTO VIDEO
========================================================= */

function AutoVideo({ src, className = "", priority = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;

    if (!video) return;

    video.muted = true;

    if (priority) {
      video.play().catch(() => {});

      return () => {
        video.pause();
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      {
        rootMargin: "200px 0px",
        threshold: 0.08,
      },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [src, priority]);

  return (
    <video
      ref={ref}
      src={src}
      autoPlay={priority}
      muted
      loop
      playsInline
      preload={priority ? "auto" : "metadata"}
      className={className}
      aria-hidden="true"
    />
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function Gallery() {
  const navigate = useNavigate();

  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const heroMediaRef = useRef(null);
  const gridRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const page = pageRef.current;

    if (!page) return;

    const ctx = gsap.context(() => {
      /* =====================================================
         HERO ENTRANCE
      ===================================================== */

      const heroTimeline = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      heroTimeline
        .fromTo(
          ".gallery-kicker",
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
          },
        )
        .fromTo(
          ".gallery-title-line",
          {
            opacity: 0,
            y: 80,
            rotateX: -15,
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
          ".gallery-copy",
          {
            opacity: 0,
            y: 25,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          "-=0.4",
        )
        .fromTo(
          ".gallery-actions",
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
          heroMediaRef.current,
          {
            opacity: 0,
            y: 40,
            scale: 0.94,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
          },
          "-=0.55",
        );

      /* =====================================================
         HERO SCROLL ZOOM
      ===================================================== */

      const mm = gsap.matchMedia();

      mm.add("(min-width: 900px)", () => {
        gsap.to(heroMediaRef.current, {
          scale: 1.12,
          borderRadius: 14,
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom 25%",
            scrub: 0.8,
          },
        });

        gsap.to(".hero-video-inner", {
          scale: 1.06,
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom 25%",
            scrub: 0.8,
          },
        });
      });

      /* =====================================================
         REVEALS
      ===================================================== */

      gsap.utils.toArray(".gallery-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          {
            opacity: 0,
            y: 50,
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

      /* =====================================================
         VIDEO CARDS
      ===================================================== */

      gsap.utils.toArray(".video-project-card").forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 65,
            scale: 0.96,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: (index % 2) * 0.07,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              once: true,
            },
          },
        );

        const media = card.querySelector(".project-media");

        const shine = card.querySelector(".project-shine");

        const move = (event) => {
          const rect = card.getBoundingClientRect();

          const x = (event.clientX - rect.left) / rect.width - 0.5;

          const y = (event.clientY - rect.top) / rect.height - 0.5;

          gsap.to(card, {
            rotateY: x * 4,
            rotateX: y * -4,
            y: -8,
            transformPerspective: 1000,
            duration: 0.35,
            ease: "power2.out",
            overwrite: true,
          });

          if (media) {
            gsap.to(media, {
              scale: 1.07,
              x: x * -10,
              y: y * -10,
              duration: 0.55,
              ease: "power2.out",
              overwrite: true,
            });
          }

          if (shine) {
            gsap.to(shine, {
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
              opacity: 1,
              duration: 0.2,
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

          if (media) {
            gsap.to(media, {
              scale: 1,
              x: 0,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
            });
          }

          if (shine) {
            gsap.to(shine, {
              opacity: 0,
              duration: 0.25,
            });
          }
        };

        card.addEventListener("mousemove", move);

        card.addEventListener("mouseleave", leave);

        card._galleryMove = move;

        card._galleryLeave = leave;
      });

      /* =====================================================
         ARCHIVE CARDS
      ===================================================== */

      gsap.utils.toArray(".archive-project-card").forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            delay: (index % 3) * 0.05,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              once: true,
            },
          },
        );

        const image = card.querySelector(".archive-image");

        const enter = () => {
          gsap.to(card, {
            y: -7,
            duration: 0.35,
            ease: "power3.out",
          });

          if (image) {
            gsap.to(image, {
              scale: 1.08,
              duration: 0.8,
              ease: "power3.out",
            });
          }
        };

        const leave = () => {
          gsap.to(card, {
            y: 0,
            duration: 0.45,
            ease: "power3.out",
          });

          if (image) {
            gsap.to(image, {
              scale: 1,
              duration: 0.8,
              ease: "power3.out",
            });
          }
        };

        card.addEventListener("mouseenter", enter);

        card.addEventListener("mouseleave", leave);

        card._archiveEnter = enter;

        card._archiveLeave = leave;
      });

      /* =====================================================
         PROOF CARDS
      ===================================================== */

      gsap.utils.toArray(".proof-card").forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            x: index % 2 === 0 ? -25 : 25,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.65,
            delay: index * 0.05,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              once: true,
            },
          },
        );
      });

      /* =====================================================
         FLOW CARDS
      ===================================================== */

      gsap.utils.toArray(".flow-card").forEach((card, index) => {
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
            delay: index * 0.07,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              once: true,
            },
          },
        );
      });

      /* =====================================================
         MARQUEES
      ===================================================== */

      gsap.to(".gallery-marquee-track", {
        xPercent: -50,
        duration: 30,
        repeat: -1,
        ease: "none",
      });

      gsap.to(".gallery-marquee-track-reverse", {
        xPercent: 50,
        duration: 34,
        repeat: -1,
        ease: "none",
      });

      /* =====================================================
         CTA
      ===================================================== */

      gsap.fromTo(
        ".gallery-cta",
        {
          opacity: 0,
          scale: 0.96,
          y: 50,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".gallery-cta",
            start: "top 86%",
            once: true,
          },
        },
      );

      /* =====================================================
         CTA ORBS
      ===================================================== */

      gsap.to(".gallery-orb-a", {
        x: 35,
        y: -22,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".gallery-orb-b", {
        x: -25,
        y: 28,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      const refreshTimer = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);

      return () => {
        window.clearTimeout(refreshTimer);

        mm.revert();
      };
    }, page);

    /* =====================================================
       MOUSE BACKGROUND
    ===================================================== */

    const mouseMove = (event) => {
      const rect = page.getBoundingClientRect();

      const x = event.clientX - rect.left;

      const y = event.clientY - rect.top;

      if (gridRef.current) {
        gsap.to(gridRef.current, {
          x: (x / rect.width - 0.5) * 20,

          y: (y / rect.height - 0.5) * 20,

          duration: 1.2,
          ease: "power3.out",
          overwrite: true,
        });
      }

      if (glowRef.current) {
        gsap.to(glowRef.current, {
          x,
          y,
          duration: 0.5,
          ease: "power2.out",
          overwrite: true,
        });
      }
    };

    page.addEventListener("mousemove", mouseMove);

    return () => {
      page.removeEventListener("mousemove", mouseMove);

      page.querySelectorAll(".video-project-card").forEach((card) => {
        if (card._galleryMove) {
          card.removeEventListener("mousemove", card._galleryMove);
        }

        if (card._galleryLeave) {
          card.removeEventListener("mouseleave", card._galleryLeave);
        }
      });

      page.querySelectorAll(".archive-project-card").forEach((card) => {
        if (card._archiveEnter) {
          card.removeEventListener("mouseenter", card._archiveEnter);
        }

        if (card._archiveLeave) {
          card.removeEventListener("mouseleave", card._archiveLeave);
        }
      });

      ctx.revert();
    };
  }, []);

  const goToUpload = () => {
    navigate("/upload");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const goToCategories = () => {
    navigate("/categories");

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
        text-slate-950
      "
    >
      {/* =====================================================
          GLOBAL BACKGROUND
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          overflow-hidden
        "
      >
        <div
          ref={gridRef}
          className="
            absolute
            -inset-24
            opacity-[0.45]
          "
          style={{
            backgroundImage:
              "radial-gradient(rgba(79,70,229,0.15) 1px, transparent 1px)",

            backgroundSize: "46px 46px",
          }}
        />

        <div
          ref={glowRef}
          className="
            absolute
            h-[520px]
            w-[520px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-gradient-to-r
            from-indigo-500/14
            via-violet-500/10
            to-fuchsia-500/8
            blur-[120px]
          "
        />

        <div
          className="
            absolute
            right-[-180px]
            top-[1200px]
            h-[520px]
            w-[520px]
            rounded-full
            bg-indigo-500/[0.05]
            blur-[120px]
          "
        />
      </div>
      {/* =====================================================
          HERO — SINGLE VIDEO START
      ===================================================== */}

      <section
        ref={heroRef}
        className="
          relative
          z-10
          min-h-[125vh]
          px-4
          pb-12
          pt-5
          sm:px-6
          lg:min-h-[145vh]
        "
      >
        <div
          className="
            sticky
            top-[88px]
            mx-auto
            flex
            h-[calc(100vh-105px)]
            max-w-[1540px]
            items-center
            justify-center
          "
        >
          <div
            ref={heroMediaRef}
            className="
              relative
              h-[min(74vh,780px)]
              w-full
              max-w-[1420px]
              overflow-hidden
              rounded-[30px]
              bg-slate-950
              shadow-[0_40px_120px_rgba(79,70,229,0.18)]
              will-change-transform
            "
          >
            <div
              className="
                hero-video-inner
                h-full
                w-full
                will-change-transform
              "
            >
              <AutoVideo
                src={featuredProjects[0].src}
                priority
                className="
                  h-full
                  w-full
                  object-cover
                "
              />
            </div>

            {/* OVERLAYS */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-r
                from-black/75
                via-black/20
                to-black/20
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-gradient-to-t
                from-black/80
                via-transparent
                to-black/15
              "
            />

            {/* TOP LEFT */}

            <div
              className="
                gallery-kicker
                absolute
                left-5
                top-5
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-white/20
                bg-black/20
                px-3
                py-1.5
                text-[9px]
                font-black
                uppercase
                tracking-[0.18em]
                text-white
                backdrop-blur-md
                sm:left-7
                sm:top-7
              "
            >
              <Icon name="sparkles" className="h-3.5 w-3.5 text-indigo-300" />
              DEVNEX PROJECT GALLERY
            </div>

            {/* TOP RIGHT */}

            <div
              className="
                absolute
                right-5
                top-5
                hidden
                items-center
                gap-2
                rounded-full
                border
                border-white/15
                bg-white/10
                px-3
                py-1.5
                text-[9px]
                font-black
                uppercase
                tracking-[0.14em]
                text-white
                backdrop-blur-md
                sm:flex
                sm:right-7
                sm:top-7
              "
            >
              <Icon name="mouse" className="h-3.5 w-3.5" />
              Scroll to explore
            </div>

            {/* HERO CONTENT */}

            <div
              className="
                absolute
                inset-x-0
                bottom-0
                p-6
                sm:p-9
                lg:p-12
              "
            >
              <div className="max-w-5xl">
                <p
                  className="
                    gallery-copy
                    mb-4
                    text-[10px]
                    font-black
                    uppercase
                    tracking-[0.24em]
                    text-indigo-300
                  "
                >
                  BUILT BY STUDENTS · PROVEN BY PROJECTS
                </p>

                <h1
                  className="
                    overflow-hidden
                    text-4xl
                    font-black
                    leading-[0.9]
                    tracking-[-0.055em]
                    text-white
                    sm:text-5xl
                    lg:text-7xl
                  "
                >
                  <span className="gallery-title-line block">
                    Built by students.
                  </span>

                  <span
                    className="
                      gallery-title-line
                      block
                      text-indigo-300
                    "
                  >
                    Made to be seen.
                  </span>
                </h1>

                <p
                  className="
                    gallery-copy
                    mt-5
                    max-w-2xl
                    text-sm
                    leading-6
                    text-slate-200
                    sm:text-base
                  "
                >
                  Explore real student-built products, interfaces, systems,
                  experiments, applications, and technical work across DEVNEX.
                </p>

                <div
                  className="
                    gallery-actions
                    mt-7
                    flex
                    flex-col
                    gap-3
                    sm:flex-row
                  "
                >
                  <button
                    type="button"
                    onClick={goToUpload}
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-full
                      bg-indigo-600
                      px-7
                      py-3.5
                      text-xs
                      font-black
                      uppercase
                      tracking-[0.12em]
                      text-white
                      shadow-lg
                      shadow-indigo-600/30
                      transition
                      hover:-translate-y-1
                      hover:bg-indigo-500
                    "
                  >
                    Submit Your Project
                    <Icon name="arrow" className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={goToCategories}
                    className="
                      inline-flex
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/20
                      bg-white/10
                      px-7
                      py-3.5
                      text-xs
                      font-black
                      uppercase
                      tracking-[0.12em]
                      text-white
                      backdrop-blur
                      transition
                      hover:bg-white/20
                    "
                  >
                    Explore Categories
                  </button>
                </div>
              </div>
            </div>

            {/* BOTTOM RIGHT STATUS */}

            <div
              className="
                absolute
                bottom-6
                right-6
                hidden
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
                backdrop-blur
                lg:flex
              "
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="
                    absolute
                    inline-flex
                    h-full
                    w-full
                    animate-ping
                    rounded-full
                    bg-emerald-400
                    opacity-60
                  "
                />

                <span
                  className="
                    relative
                    inline-flex
                    h-2
                    w-2
                    rounded-full
                    bg-emerald-400
                  "
                />
              </span>
              Project Showcase
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MARQUEE
      ===================================================== */}

      <section
        className="
          gallery-reveal
          relative
          z-10
          overflow-hidden
          border-y
          border-slate-200
          bg-white/35
          py-5
          backdrop-blur
        "
      >
        <div className="gallery-marquee-track flex w-max">
          {[
            "WEB & FULL-STACK",
            "AI & MACHINE LEARNING",
            "MOBILE APPLICATIONS",
            "SAAS & AUTOMATION",
            "DATA SCIENCE",
            "CYBERSECURITY",
            "CLOUD & DEVOPS",
            "UI/UX DESIGN",
            "WEB & FULL-STACK",
            "AI & MACHINE LEARNING",
            "MOBILE APPLICATIONS",
            "SAAS & AUTOMATION",
            "DATA SCIENCE",
            "CYBERSECURITY",
            "CLOUD & DEVOPS",
            "UI/UX DESIGN",
          ].map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="
                  flex
                  items-center
                  gap-5
                  pr-12
                  text-sm
                  font-black
                  uppercase
                  tracking-[0.14em]
                  text-slate-400
                "
            >
              <span className="h-2 w-2 rounded-full bg-indigo-600" />

              {item}
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          FEATURED PROJECTS
      ===================================================== */}

      <section
        className="
          relative
          z-10
          mx-auto
          max-w-[1500px]
          px-5
          py-28
          md:px-10
          md:py-36
        "
      >
        <div
          className="
            gallery-reveal
            mb-16
            grid
            gap-8
            lg:grid-cols-12
            lg:items-end
          "
        >
          <div className="lg:col-span-8">
            <SectionLabel>01 / PROJECT SHOWCASE</SectionLabel>

            <h2
              className="
                mt-5
                max-w-5xl
                text-5xl
                font-black
                leading-[0.9]
                tracking-[-0.065em]
                sm:text-6xl
                md:text-7xl
              "
            >
              Explore what
              <br />
              students <span className="italic text-indigo-600">build.</span>
            </h2>
          </div>

          <p
            className="
              text-sm
              leading-7
              text-slate-500
              lg:col-span-4
            "
          >
            A good gallery should help people understand more than how a project
            looks. It should show what was built, why it matters, and what
            technologies were used.
          </p>
        </div>

        <div
          className="
            grid
            gap-6
            md:grid-cols-2
          "
        >
          {featuredProjects.slice(1).map((video, index) => (
            <VideoProjectCard key={video.id} video={video} index={index} />
          ))}
        </div>
      </section>

      {/* =====================================================
          PROOF LAYER
      ===================================================== */}

      <section
        className="
          relative
          z-10
          px-5
          py-24
          md:px-10
          md:py-32
        "
      >
        <div
          className="
            gallery-reveal
            mx-auto
            max-w-[1500px]
            overflow-hidden
            rounded-[40px]
            bg-slate-950
            text-white
            shadow-[0_35px_90px_rgba(15,23,42,0.18)]
          "
        >
          <div
            className="
              relative
              grid
              lg:grid-cols-12
            "
          >
            <div
              className="
                absolute
                right-[-100px]
                top-[-100px]
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
                p-8
                sm:p-10
                lg:col-span-6
                lg:p-14
              "
            >
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/10
                  bg-white/[0.05]
                  px-3
                  py-1.5
                "
              >
                <Icon name="shield" className="h-4 w-4 text-indigo-300" />

                <span
                  className="
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.18em]
                    text-indigo-300
                  "
                >
                  PROJECT PROOF LAYER
                </span>
              </div>

              <h2
                className="
                  mt-6
                  text-4xl
                  font-black
                  leading-[0.96]
                  tracking-tight
                  sm:text-5xl
                "
              >
                A gallery should show more than{" "}
                <span className="text-indigo-300">screenshots.</span>
              </h2>

              <p
                className="
                  mt-6
                  max-w-xl
                  text-sm
                  leading-7
                  text-slate-400
                  sm:text-base
                "
              >
                Project pages become more useful when visitors can understand
                the problem, stack, repository, live product, contribution, and
                recognition around the work.
              </p>
            </div>

            <div
              className="
                relative
                grid
                gap-3
                border-t
                border-white/10
                p-8
                sm:grid-cols-2
                sm:p-10
                lg:col-span-6
                lg:border-l
                lg:border-t-0
                lg:p-12
              "
            >
              {proofPoints.map((item) => (
                <ProofCard key={item.title} {...item} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ARCHIVE
      ===================================================== */}

      <section
        className="
          relative
          z-10
          mx-auto
          max-w-[1500px]
          px-5
          py-28
          md:px-10
          md:py-36
        "
      >
        <div
          className="
            gallery-reveal
            mb-16
            grid
            gap-8
            lg:grid-cols-12
            lg:items-end
          "
        >
          <div className="lg:col-span-8">
            <SectionLabel>02 / DISCOVER</SectionLabel>

            <h2
              className="
                mt-5
                text-5xl
                font-black
                leading-[0.9]
                tracking-[-0.065em]
                sm:text-6xl
                md:text-7xl
              "
            >
              More technical
              <br />
              <span className="italic text-indigo-600">directions.</span>
            </h2>
          </div>

          <p
            className="
              text-sm
              leading-7
              text-slate-500
              lg:col-span-4
            "
          >
            Discover projects through technical category, interface direction,
            product type, and the practical problem being solved.
          </p>
        </div>

        <div
          className="
            grid
            gap-5
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {archiveItems.map((item, index) => (
            <ArchiveCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </section>

      {/* =====================================================
          SECOND MARQUEE
      ===================================================== */}

      <section
        className="
          gallery-reveal
          relative
          z-10
          overflow-hidden
          bg-indigo-600
          py-5
          text-white
        "
      >
        <div
          className="
            gallery-marquee-track-reverse
            flex
            w-max
            -translate-x-1/2
          "
        >
          {[
            "BUILD",
            "DOCUMENT",
            "PUBLISH",
            "PROVE",
            "GET DISCOVERED",
            "BUILD",
            "DOCUMENT",
            "PUBLISH",
            "PROVE",
            "GET DISCOVERED",
          ].map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="
                  flex
                  items-center
                  gap-5
                  pr-14
                  text-xl
                  font-black
                  uppercase
                  tracking-[-0.02em]
                  text-white
                "
            >
              <span className="h-2 w-2 rounded-full bg-white" />

              {item}
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          PROJECT PROFILE
      ===================================================== */}

      <section
        className="
          relative
          z-10
          px-5
          py-28
          md:px-10
          md:py-32
        "
      >
        <div
          className="
            gallery-reveal
            mx-auto
            grid
            max-w-[1500px]
            gap-10
            overflow-hidden
            rounded-[40px]
            border
            border-indigo-100
            bg-gradient-to-br
            from-indigo-50
            via-white
            to-violet-50
            p-8
            shadow-sm
            sm:p-10
            lg:grid-cols-12
            lg:p-12
          "
        >
          <div className="lg:col-span-5">
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                bg-indigo-600
                text-white
                shadow-lg
                shadow-indigo-600/20
              "
            >
              <Icon name="file" className="h-5 w-5" />
            </div>

            <p
              className="
                mt-7
                text-[10px]
                font-black
                uppercase
                tracking-[0.25em]
                text-indigo-600
              "
            >
              PROJECT PROFILE
            </p>

            <h2
              className="
                mt-3
                text-4xl
                font-black
                leading-[0.98]
                tracking-tight
                sm:text-5xl
              "
            >
              Turn every strong build into a{" "}
              <span className="text-indigo-600">real profile.</span>
            </h2>

            <p
              className="
                mt-5
                text-sm
                leading-7
                text-slate-500
                sm:text-base
              "
            >
              Instead of stopping at a thumbnail, DEVNEX can present the project
              with enough context to become useful proof of practical ability.
            </p>
          </div>

          <div
            className="
              grid
              gap-3
              sm:grid-cols-2
              lg:col-span-7
            "
          >
            {profileItems.map((item) => (
              <ProfileItem key={item} text={item} />
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          FLOW
      ===================================================== */}

      <section
        className="
          relative
          z-10
          mx-auto
          max-w-[1500px]
          px-5
          py-28
          md:px-10
          md:py-32
        "
      >
        <div className="gallery-reveal">
          <SectionLabel>03 / FROM BUILD TO VISIBILITY</SectionLabel>

          <h2
            className="
              mt-5
              max-w-5xl
              text-4xl
              font-black
              leading-[0.98]
              tracking-tight
              sm:text-5xl
              lg:text-6xl
            "
          >
            A project becomes stronger when people can{" "}
            <span className="text-indigo-600">understand it.</span>
          </h2>
        </div>

        <div
          className="
            mt-12
            grid
            gap-4
            md:grid-cols-2
            lg:grid-cols-4
          "
        >
          {flowItems.map((item) => (
            <FlowCard key={item.number} {...item} />
          ))}
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section
        className="
          relative
          z-10
          px-5
          pb-28
          pt-16
          md:px-10
          md:pb-36
        "
      >
        <div
          className="
            gallery-cta
            relative
            mx-auto
            max-w-[1500px]
            overflow-hidden
            rounded-[42px]
            bg-indigo-600
            px-8
            py-16
            text-white
            shadow-2xl
            shadow-indigo-600/20
            sm:px-12
            sm:py-20
            lg:px-16
          "
        >
          <div
            className="
              gallery-orb-a
              absolute
              -right-20
              -top-20
              h-72
              w-72
              rounded-full
              bg-white/10
              blur-[70px]
            "
          />

          <div
            className="
              gallery-orb-b
              absolute
              -bottom-24
              left-[20%]
              h-64
              w-64
              rounded-full
              bg-violet-300/15
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
              <p
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.24em]
                  text-indigo-100
                "
              >
                BUILT SOMETHING YOU&apos;RE PROUD OF?
              </p>

              <h2
                className="
                  mt-5
                  max-w-5xl
                  text-4xl
                  font-black
                  leading-[0.94]
                  tracking-tight
                  sm:text-5xl
                  lg:text-6xl
                "
              >
                Don&apos;t leave it hidden in a folder.
              </h2>

              <p
                className="
                  mt-6
                  max-w-2xl
                  text-base
                  leading-7
                  text-indigo-100
                  sm:text-lg
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
                onClick={goToUpload}
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
                Submit Your Project
                <Icon name="arrow" className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={goToCategories}
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
                Explore Categories
              </button>
            </div>
          </div>
        </div>
      </section>
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
      <span className="h-2 w-2 rounded-full bg-indigo-600" />

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

function VideoProjectCard({ video, index }) {
  return (
    <article
      className="
        video-project-card
        group
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-slate-200
        bg-slate-950
        shadow-md
        [transform-style:preserve-3d]
      "
    >
      <div
        className="
          project-shine
          pointer-events-none
          absolute
          left-0
          top-0
          z-20
          h-56
          w-56
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-white/15
          opacity-0
          blur-[60px]
        "
      />

      <div
        className="
          relative
          aspect-[16/10]
          overflow-hidden
        "
      >
        <div
          className="
            project-media
            h-full
            w-full
            will-change-transform
          "
        >
          <AutoVideo
            src={video.src}
            className="
              h-full
              w-full
              object-cover
            "
          />
        </div>

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-slate-950
            via-slate-950/20
            to-transparent
          "
        />

        <div
          className="
            absolute
            left-5
            top-5
            flex
            flex-wrap
            gap-2
          "
        >
          <span
            className="
              rounded-full
              border
              border-white/20
              bg-white/10
              px-3
              py-1.5
              text-[9px]
              font-black
              uppercase
              tracking-[0.16em]
              text-white
              backdrop-blur
            "
          >
            0{index + 1} / {video.category}
          </span>

          <span
            className="
              rounded-full
              border
              border-emerald-400/25
              bg-emerald-400/10
              px-3
              py-1.5
              text-[9px]
              font-black
              uppercase
              tracking-[0.14em]
              text-emerald-300
              backdrop-blur
            "
          >
            PROJECT
          </span>
        </div>

        <div
          className="
            absolute
            bottom-6
            left-6
            right-6
          "
        >
          <p
            className="
              text-[9px]
              font-black
              uppercase
              tracking-[0.16em]
              text-indigo-300
            "
          >
            {video.stack}
          </p>

          <h3
            className="
              mt-2
              text-2xl
              font-black
              tracking-tight
              text-white
              md:text-3xl
            "
          >
            {video.title}
          </h3>

          <p
            className="
              mt-2
              max-w-xl
              text-xs
              leading-5
              text-slate-300
              sm:text-sm
            "
          >
            {video.description}
          </p>
        </div>
      </div>
    </article>
  );
}

function ArchiveCard({ item, index }) {
  return (
    <article
      className="
        archive-project-card
        group
        relative
        overflow-hidden
        rounded-[28px]
        border
        border-slate-200
        bg-slate-950
        shadow-sm
      "
    >
      <div
        className="
          relative
          aspect-[16/10]
          overflow-hidden
        "
      >
        <img
          src={item.src}
          alt={item.title}
          loading="lazy"
          className="
            archive-image
            h-full
            w-full
            object-cover
            opacity-95
            will-change-transform
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-slate-950
            via-slate-950/20
            to-transparent
          "
        />

        <div
          className="
            absolute
            left-4
            top-4
          "
        >
          <span
            className="
              rounded-full
              border
              border-white/20
              bg-white/10
              px-3
              py-1.5
              text-[9px]
              font-black
              uppercase
              tracking-[0.16em]
              text-white
              backdrop-blur
            "
          >
            0{index + 1} / {item.category}
          </span>
        </div>

        <div
          className="
            absolute
            bottom-5
            left-5
            right-5
          "
        >
          <p
            className="
              text-[9px]
              font-black
              uppercase
              tracking-[0.14em]
              text-indigo-300
            "
          >
            {item.meta}
          </p>

          <h3
            className="
              mt-1
              text-xl
              font-black
              tracking-tight
              text-white
              md:text-2xl
            "
          >
            {item.title}
          </h3>
        </div>
      </div>
    </article>
  );
}

function ProofCard({ icon, title, text }) {
  return (
    <article
      className="
        proof-card
        rounded-2xl
        border
        border-white/10
        bg-white/[0.05]
        p-5
        backdrop-blur
      "
    >
      <div
        className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          bg-indigo-500/15
          text-indigo-300
        "
      >
        <Icon name={icon} className="h-4 w-4" />
      </div>

      <h3
        className="
          mt-4
          text-base
          font-black
          text-white
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-2
          text-xs
          leading-6
          text-slate-400
        "
      >
        {text}
      </p>
    </article>
  );
}

function ProfileItem({ text }) {
  return (
    <div
      className="
        flex
        items-start
        gap-3
        rounded-2xl
        border
        border-white/80
        bg-white/80
        p-4
        shadow-sm
        backdrop-blur
        transition
        duration-300
        hover:-translate-y-1
        hover:border-indigo-200
      "
    >
      <div
        className="
          mt-0.5
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
      </div>

      <span
        className="
          text-sm
          font-semibold
          leading-6
          text-slate-700
        "
      >
        {text}
      </span>
    </div>
  );
}

function FlowCard({ number, icon, title, text }) {
  return (
    <article
      className="
        flow-card
        group
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
            text-3xl
            font-black
            text-slate-200
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
            transition
            duration-300
            group-hover:rotate-3
            group-hover:scale-105
          "
        >
          <Icon name={icon} className="h-4 w-4" />
        </div>
      </div>

      <h3
        className="
          mt-7
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

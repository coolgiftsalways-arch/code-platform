import{ useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../style/HallOfFame.css";

gsap.registerPlugin(ScrollTrigger);

const winners = [
  {
    id: "01",
    title: "OBSIDIAN",
    category: "CREATIVE / DIGITAL",
    year: "2026",
    award: "SITE OF THE DAY",
    creator: "Studio Obsidian",
    about:
      "An immersive digital ecosystem exploring dark aesthetics, fluid motion, and avant-garde typography.",
    tech: ["React", "GSAP", "WebGL", "Tailwind"],
    link: "https://example.com",
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=2000&q=90",
  },
  {
    id: "02",
    title: "NOIR STUDIO",
    category: "ART / DIRECTION",
    year: "2026",
    award: "SPECIAL MENTION",
    creator: "Noir Collective",
    about:
      "Minimalist portfolio showcasing high-end fashion and architectural direction with ultra-smooth scrolling.",
    tech: ["Next.js", "Three.js", "Locomotive"],
    link: "https://example.com",
    image:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=2000&q=90",
  },
  {
    id: "03",
    title: "FORM / ZERO",
    category: "DIGITAL EXPERIENCE",
    year: "2025",
    award: "DEVELOPER AWARD",
    creator: "Zero Lab",
    about:
      "Experimental web platform featuring heavy geometry, sound design, and custom interactive shaders.",
    tech: ["Vue", "GLSL", "Canvas API"],
    link: "https://example.com",
    image:
      "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=2000&q=90",
  },
  {
    id: "04",
    title: "MONOCHROME",
    category: "BRANDING / WEB",
    year: "2025",
    award: "HONORABLE MENTION",
    creator: "Mono Studio",
    about:
      "A deep dive into high-contrast interfaces, clean grids, and thoughtful spatial user experiences.",
    tech: ["React", "CSS Modules", "Framer Motion"],
    link: "https://example.com",
    image:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=2000&q=90",
  },
  {
    id: "05",
    title: "AETHER",
    category: "INTERACTIVE",
    year: "2025",
    award: "SITE OF THE MONTH",
    creator: "Aether Labs",
    about:
      "Cloud-based visual synthesizer and audio-reactive 3D playground built entirely for the modern web.",
    tech: ["Three.js", "Web Audio API", "React"],
    link: "https://example.com",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=90",
  },
  {
    id: "06",
    title: "KINETIC",
    category: "MOTION DESIGN",
    year: "2025",
    award: "SPECIAL MENTION",
    creator: "Motion Works",
    about:
      "Kinetic typography case study exploring variable fonts, gravity simulation, and dynamic color tracks.",
    tech: ["GSAP", "SVG", "Tailwind"],
    link: "https://example.com",
    image:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=2000&q=90",
  },
  {
    id: "07",
    title: "VORTEX",
    category: "ECOSYSTEM",
    year: "2025",
    award: "DEVELOPER AWARD",
    creator: "Vortex Group",
    about:
      "Decentralized dashboard featuring complex node charts, fast data streaming, and immersive panels.",
    tech: ["Next.js", "D3.js", "Tailwind"],
    link: "https://example.com",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=2000&q=90",
  },
  {
    id: "08",
    title: "SYNTAX",
    category: "DEV TOOLS",
    year: "2025",
    award: "SITE OF THE DAY",
    creator: "Syntax UI",
    about:
      "Developer workflow suite with theme generators, real-time code preview, and accessibility scorecards.",
    tech: ["React", "TypeScript", "Monaco Editor"],
    link: "https://example.com",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=2000&q=90",
  },
  {
    id: "09",
    title: "ECHO",
    category: "AUDIO / VISUAL",
    year: "2025",
    award: "SPECIAL MENTION",
    creator: "Echo Sound",
    about:
      "Podcast and sound archive platform blending rich editorial layouts with ambient soundscapes.",
    tech: ["Nuxt", "Web Audio", "CSS Grid"],
    link: "https://example.com",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=2000&q=90",
  },
  {
    id: "10",
    title: "NEO TOKYO",
    category: "COMMERCE",
    year: "2025",
    award: "SITE OF THE YEAR",
    creator: "Tokyo Digital",
    about:
      "Futuristic e-commerce concept featuring 3D product customization and cinematic lighting effects.",
    tech: ["React Three Fiber", "Shopify Headless", "GSAP"],
    link: "https://example.com",
    image:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=2000&q=90",
  },
];

export default function HallOfFame() {
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      const heroTimeline = gsap.timeline();

      heroTimeline
        .from(".hof-kicker", {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        })
        .from(
          ".hof-title-line",
          {
            yPercent: 110,
            opacity: 0,
            duration: 1.2,
            stagger: 0.12,
            ease: "power4.out",
          },
          "-=0.3",
        )
        .from(
          ".hof-description",
          {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6",
        );

      // Parallax title
      gsap.to(".hof-hero-title", {
        y: 120,
        ease: "none",
        scrollTrigger: {
          trigger: ".hof-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Top 3 Cards Entrance
      gsap.from(".hof-card", {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".hof-top-three",
          start: "top 80%",
        },
      });

      // Top 10 List Items Entrance
      gsap.from(".hof-list-item", {
        x: -50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".hof-list",
          start: "top 80%",
        },
      });

      // Final CTA entrance
      gsap.from(".hof-final h2", {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".hof-final",
          start: "top 75%",
        },
      });
    }, pageRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <main className="hof-page" ref={pageRef}>
      {/* =========================================================
          SVG DYNAMIC BACKGROUND
      ========================================================= */}
      <div className="hof-svg-background">
        <svg
          className="hof-svg"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <g opacity="0.45">
            {/* Orbits / Circles */}
            <circle
              className="svg-orbit orbit-one"
              cx="300"
              cy="250"
              r="220"
              stroke="#4f46e5"
              strokeWidth="1"
              strokeDasharray="4 8"
            />
            <circle
              className="svg-orbit orbit-two"
              cx="1150"
              cy="650"
              r="340"
              stroke="#4f46e5"
              strokeWidth="1.5"
              strokeDasharray="12 16"
            />
            <circle
              className="svg-orbit orbit-three"
              cx="900"
              cy="200"
              r="180"
              stroke="#4f46e5"
              strokeWidth="1"
            />
            <circle
              className="svg-orbit orbit-four"
              cx="200"
              cy="750"
              r="280"
              stroke="#4f46e5"
              strokeWidth="1"
              strokeDasharray="8 12"
            />

            {/* Glowing Orbs / Blurs */}
            <circle
              className="svg-glow glow-one"
              cx="450"
              cy="350"
              r="120"
              fill="#4f46e5"
              fillOpacity="0.08"
              filter="blur(50px)"
            />
            <circle
              className="svg-glow glow-two"
              cx="1000"
              cy="500"
              r="160"
              fill="#4f46e5"
              fillOpacity="0.06"
              filter="blur(70px)"
            />

            {/* Connecting Curving Paths */}
            <path
              className="svg-line svg-line-one"
              d="M -100 150 C 400 50, 600 700, 1500 400"
              stroke="#4f46e5"
              strokeWidth="1.5"
            />
            <path
              className="svg-line svg-line-two"
              d="M 100 900 C 500 300, 900 800, 1600 200"
              stroke="#4f46e5"
              strokeWidth="1"
            />
            <path
              className="svg-line svg-line-three"
              d="M 0 500 C 600 900, 800 100, 1440 600"
              stroke="#4f46e5"
              strokeWidth="1"
            />

            {/* Pulsing Nodes / Points */}
            <circle
              className="svg-point point-one"
              cx="300"
              cy="250"
              r="4"
              fill="#4f46e5"
            />
            <circle
              className="svg-point point-two"
              cx="810"
              cy="450"
              r="5"
              fill="#4f46e5"
            />
            <circle
              className="svg-point point-three"
              cx="1150"
              cy="310"
              r="3.5"
              fill="#4f46e5"
            />
            <circle
              className="svg-point point-four"
              cx="480"
              cy="680"
              r="4.5"
              fill="#4f46e5"
            />
          </g>
        </svg>
      </div>

      {/* =========================================================
          HERO SECTION
      ========================================================= */}
      <section className="hof-hero">
        <div className="hof-topbar">
          <span className="hof-kicker">01 — HALL OF FAME</span>
          <span>DIGITAL EXCELLENCE / 2025–26</span>
        </div>

        <div className="hof-hero-title">
          <div className="hof-title-mask">
            <h1 className="hof-title-line hof-main-title">HALL</h1>
          </div>
          <div className="hof-title-mask">
            <h1 className="hof-title-line hof-main-title hof-outline">
              OF FAME
            </h1>
          </div>
        </div>

        <div className="hof-hero-bottom">
          <p className="hof-description">
            Recognizing the absolute pinnacle of web craftsmanship, visual
            direction, and digital engineering worldwide.
          </p>
          <span>SCROLL TO EXPLORE ↓</span>
        </div>
      </section>

      {/* =========================================================
          SECTION: WINNERS / TOP 3 HIGHLIGHTS
      ========================================================= */}
      <section className="hof-section">
        <div className="hof-section-title">
          <span>02 — FEATURED WINNERS</span>
          <span>PODIUM SELECTION</span>
        </div>

        <div className="hof-top-three">
          {winners.slice(0, 3).map((item, idx) => (
            <div className="hof-card" key={item.id}>
              <div className="hof-card-image">
                <img src={item.image} alt={item.title} />
                <div className="hof-rank">#{idx + 1}</div>
              </div>
              <div className="hof-card-bottom">
                <div>
                  <span>{item.award}</span>
                  <h2>{item.title}</h2>
                </div>
                <p>{item.year}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          SECTION: TOP 10 COMPLETE LIST (INSTANTLY VIEWABLE)
      ========================================================= */}
      <section className="hof-section">
        <div className="hof-section-title">
          <span>03 — FULL RANKINGS</span>
          <span>TOP 10 ARCHIVE</span>
        </div>

        <div className="hof-list">
          {winners.map((item, idx) => (
            <div className="hof-list-item" key={item.id}>
              <div className="hof-list-rank">0{idx + 1}</div>
              <div className="hof-list-image">
                <img src={item.image} alt={item.title} />
              </div>
              <div className="hof-list-name">
                <h3>{item.title}</h3>
                <span>{item.category}</span>
              </div>
              <div className="hof-list-creator">{item.creator}</div>
              <div className="hof-list-year">{item.year}</div>
              <div className="hof-list-arrow">↗</div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          FINAL CTA SECTION
      ========================================================= */}
      <section className="hof-final">
        <span>04 — SUBMISSIONS</span>
        <h2>
          THINK YOUR WORK <br />
          <i>BELONGS HERE?</i>
        </h2>
        
      </section>
    </main>
  );
}

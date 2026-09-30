import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../style/HallOfFame.css";

gsap.registerPlugin(ScrollTrigger);

const winners = [
  {
    id: "01",
    title: "OBSIDIAN",
    page: "HOME PAGE",
    category: "CREATIVE / DIGITAL",
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1600&q=90",
  },
  {
    id: "02",
    title: "NOIR STUDIO",
    page: "PORTFOLIO",
    category: "ART / DIRECTION",
    image:
      "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1600&q=90",
  },
  {
    id: "03",
    title: "FORM / ZERO",
    page: "EXPERIENCE",
    category: "DIGITAL EXPERIENCE",
    image:
      "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1600&q=90",
  },
  {
    id: "04",
    title: "MONOCHROME",
    page: "BRANDING",
    category: "BRANDING / WEB",
    image:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1600&q=90",
  },
  {
    id: "05",
    title: "AETHER",
    page: "INTERACTIVE",
    category: "INTERACTIVE",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=90",
  },
  {
    id: "06",
    title: "KINETIC",
    page: "MOTION",
    category: "MOTION DESIGN",
    image:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1600&q=90",
  },
  {
    id: "07",
    title: "VORTEX",
    page: "DIGITAL",
    category: "ECOSYSTEM",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=90",
  },
  {
    id: "08",
    title: "SYNTAX",
    page: "DEVELOPER",
    category: "DEV TOOLS",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=90",
  },
  {
    id: "09",
    title: "ECHO",
    page: "AUDIO / VISUAL",
    category: "AUDIO EXPERIENCE",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=90",
  },
  {
    id: "10",
    title: "NEO TOKYO",
    page: "E-COMMERCE",
    category: "COMMERCE",
    image:
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=90",
  },
  {
    id: "11",
    title: "VOID",
    page: "CREATIVE",
    category: "ART DIRECTION",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1600&q=90",
  },
  {
    id: "12",
    title: "ORBIT",
    page: "3D EXPERIENCE",
    category: "WEBGL / 3D",
    image:
      "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=1600&q=90",
  },
  {
    id: "13",
    title: "RAW",
    page: "FASHION",
    category: "FASHION / EDITORIAL",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=90",
  },
  {
    id: "14",
    title: "ELEMENT",
    page: "AGENCY",
    category: "CREATIVE STUDIO",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=90",
  },
  {
    id: "15",
    title: "MOTION LAB",
    page: "ANIMATION",
    category: "MOTION / DIGITAL",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=90",
  },
  {
    id: "16",
    title: "LUMINA",
    page: "DESIGN",
    category: "VISUAL DESIGN",
    image:
      "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1600&q=90",
  },
  {
    id: "17",
    title: "CHROME",
    page: "PRODUCT",
    category: "PRODUCT DESIGN",
    image:
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1600&q=90",
  },
  {
    id: "18",
    title: "PARALLAX",
    page: "EXPERIMENTAL",
    category: "WEB EXPERIENCE",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=90",
  },
  {
    id: "19",
    title: "NEXUS",
    page: "TECHNOLOGY",
    category: "TECH / DIGITAL",
    image:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1600&q=90",
  },
  {
    id: "20",
    title: "AFTER DARK",
    page: "SHOWCASE",
    category: "DIGITAL SHOWCASE",
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=90",
  },
];

export default function HallOfFame() {
  const pageRef = useRef(null);
  const counterRef = useRef(null);
  const [archiveCount, setArchiveCount] = useState(1);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ================================
      // HERO ENTRANCE
      // ================================

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

      // ================================
      // HERO PARALLAX
      // ================================

      gsap.to(".hof-hero-title", {
        y: 130,
        ease: "none",
        scrollTrigger: {
          trigger: ".hof-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // ================================
      // CARDS
      // ================================

      gsap.utils.toArray(".hof-card").forEach((card) => {
        gsap.from(card, {
          y: 100,
          opacity: 0,
          scale: 0.96,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });

        const image = card.querySelector(".hof-premium-image");
        const content = card.querySelector(".hof-premium-content");
        const glow = card.querySelector(".hof-premium-glow");
        const arrow = card.querySelector(".hof-premium-arrow");

        const handleMove = (event) => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;

          gsap.to(card, {
            rotateY: x * 4.5,
            rotateX: y * -4.5,
            y: -8,
            duration: 0.35,
            ease: "power2.out",
            transformPerspective: 1200,
            transformOrigin: "center center",
            overwrite: true,
          });

          if (image) {
            gsap.to(image, {
              scale: 1.08,
              x: x * -12,
              y: y * -12,
              duration: 0.55,
              ease: "power2.out",
              overwrite: true,
            });
          }

          if (content) {
            gsap.to(content, {
              x: x * 6,
              y: y * 6,
              duration: 0.4,
              ease: "power2.out",
              overwrite: true,
            });
          }

          if (glow) {
            gsap.to(glow, {
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
              opacity: 1,
              duration: 0.2,
              overwrite: true,
            });
          }

          if (arrow) {
            gsap.to(arrow, {
              rotate: -45,
              scale: 1.05,
              duration: 0.3,
              ease: "power2.out",
            });
          }
        };

        const handleLeave = () => {
          gsap.to(card, {
            rotateY: 0,
            rotateX: 0,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
          });

          if (image) {
            gsap.to(image, {
              scale: 1,
              x: 0,
              y: 0,
              duration: 0.65,
              ease: "power3.out",
            });
          }

          if (content) {
            gsap.to(content, {
              x: 0,
              y: 0,
              duration: 0.55,
              ease: "power3.out",
            });
          }

          if (glow) {
            gsap.to(glow, {
              opacity: 0,
              duration: 0.25,
            });
          }

          if (arrow) {
            gsap.to(arrow, {
              rotate: 0,
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
            });
          }
        };

        card.addEventListener("mousemove", handleMove);
        card.addEventListener("mouseleave", handleLeave);

        card._hofPremiumMove = handleMove;
        card._hofPremiumLeave = handleLeave;
      });

      // ================================
      // SVG ORBITS
      // ================================

      gsap.to(".orbit-one", {
        rotation: 360,
        transformOrigin: "center",
        duration: 30,
        repeat: -1,
        ease: "none",
      });

      gsap.to(".orbit-two", {
        rotation: -360,
        transformOrigin: "center",
        duration: 40,
        repeat: -1,
        ease: "none",
      });

      gsap.to(".orbit-three", {
        rotation: 360,
        transformOrigin: "center",
        duration: 25,
        repeat: -1,
        ease: "none",
      });

      // ================================
      // GLOW MOVEMENT
      // ================================

      gsap.to(".glow-one", {
        x: 150,
        y: 80,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".glow-two", {
        x: -120,
        y: -80,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // ================================
      // FINAL SECTION
      // ================================

      gsap.from(".hof-final h2", {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".hof-final",
          start: "top 80%",
        },
      });
    }, pageRef);

    return () => {
      pageRef.current?.querySelectorAll(".hof-card").forEach((card) => {
        if (card._hofPremiumMove) {
          card.removeEventListener("mousemove", card._hofPremiumMove);
        }

        if (card._hofPremiumLeave) {
          card.removeEventListener("mouseleave", card._hofPremiumLeave);
        }
      });

      ctx.revert();
    };
  }, []);

  /* =====================================
     ARCHIVE COUNTER 01 -> 20
  ====================================== */

  useEffect(() => {
    const target = counterRef.current;

    if (!target) return;

    let frameId;
    let hasStarted = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasStarted) return;

        hasStarted = true;

        const startValue = 1;
        const endValue = 20;
        const duration = 3500;
        const startTime = performance.now();

        const animate = (time) => {
          const progress = Math.min((time - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = Math.round(
            startValue + (endValue - startValue) * eased,
          );

          setArchiveCount(value);

          if (progress < 1) {
            frameId = requestAnimationFrame(animate);
          }
        };

        frameId = requestAnimationFrame(animate);
        observer.disconnect();
      },
      {
        threshold: 0.35,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();

      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <main className="hof-page" ref={pageRef}>
      {/* =====================================
          BACKGROUND
      ====================================== */}

      <div className="hof-svg-background">
        <svg
          className="hof-svg"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <g opacity="0.45">
            <circle
              className="svg-orbit orbit-one"
              cx="300"
              cy="250"
              r="220"
              stroke="#7357ff"
              strokeWidth="1"
              strokeDasharray="4 8"
            />

            <circle
              className="svg-orbit orbit-two"
              cx="1150"
              cy="650"
              r="340"
              stroke="#7357ff"
              strokeWidth="1"
              strokeDasharray="12 16"
            />

            <circle
              className="svg-orbit orbit-three"
              cx="900"
              cy="200"
              r="180"
              stroke="#7357ff"
              strokeWidth="1"
            />

            <circle
              className="svg-orbit orbit-four"
              cx="200"
              cy="750"
              r="280"
              stroke="#7357ff"
              strokeWidth="1"
              strokeDasharray="8 12"
            />

            <circle
              className="svg-glow glow-one"
              cx="450"
              cy="350"
              r="140"
              fill="#7357ff"
              fillOpacity="0.12"
            />

            <circle
              className="svg-glow glow-two"
              cx="1000"
              cy="500"
              r="190"
              fill="#7357ff"
              fillOpacity="0.08"
            />

            <path
              className="svg-line"
              d="M -100 150 C 400 50, 600 700, 1500 400"
              stroke="#7357ff"
              strokeWidth="1"
            />

            <path
              className="svg-line"
              d="M 100 900 C 500 300, 900 800, 1600 200"
              stroke="#7357ff"
              strokeWidth="1"
            />

            <path
              className="svg-line"
              d="M 0 500 C 600 900, 800 100, 1440 600"
              stroke="#7357ff"
              strokeWidth="1"
            />

            <circle cx="300" cy="250" r="4" fill="#7357ff" />
            <circle cx="810" cy="450" r="5" fill="#7357ff" />
            <circle cx="1150" cy="310" r="3.5" fill="#7357ff" />
            <circle cx="480" cy="680" r="4.5" fill="#7357ff" />
          </g>
        </svg>
      </div>

      {/* =====================================
          HERO
      ====================================== */}

      <section className="hof-hero">
        <div className="hof-topbar">
          <span className="hof-kicker">01 — HALL OF FAME</span>

          <span className="hof-topbar-right">DIGITAL EXCELLENCE / 2026</span>
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
            Celebrating outstanding digital projects, creative experiences and
            visual excellence from our selected Hall of Fame.
          </p>

          <span className="hof-scroll-text">SCROLL TO EXPLORE ↓</span>
        </div>
      </section>

      {/* =====================================
          SELECTED WORK — PREMIUM EDITORIAL CARDS
      ====================================== */}

      <section className="hof-section">
        <div className="hof-section-title">
          <span>02 — SELECTED WORK</span>

          <span>20 PROJECTS / 2026</span>
        </div>

        <div className="hof-premium-grid">
          {winners.map((item, index) => {
            const layout =
              index % 7 === 0
                ? "hof-premium-card--hero"
                : index % 7 === 1
                  ? "hof-premium-card--portrait"
                  : index % 7 === 2
                    ? "hof-premium-card--wide"
                    : index % 7 === 3
                      ? "hof-premium-card--square"
                      : index % 7 === 4
                        ? "hof-premium-card--wide"
                        : index % 7 === 5
                          ? "hof-premium-card--portrait"
                          : "hof-premium-card--square";

            return (
              <article
                className={`hof-card hof-premium-card ${layout}`}
                key={item.id}
              >
                <div className="hof-premium-media">
                  <img
                    className="hof-premium-image"
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                  />

                  <div className="hof-premium-overlay" />

                  <div className="hof-premium-glow" />

                  <div className="hof-premium-top">
                    <span className="hof-premium-rank">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="hof-premium-category">
                      {item.category}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="hof-premium-arrow"
                    aria-label={`View ${item.title}`}
                  >
                    ↗
                  </button>

                  <div className="hof-premium-content">
                    <p className="hof-premium-page">{item.page}</p>

                    <h2>{item.title}</h2>

                    <div className="hof-premium-bottom">
                      <span>DEVNEX SELECTED</span>

                      <span>HOF {String(index + 1).padStart(2, "0")}</span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* =====================================
          BIG NUMBER
      ====================================== */}

      <section ref={counterRef} className="hof-counter-section">
        <div className="hof-counter-small">
          <span>03</span>
          <span>ARCHIVE</span>
        </div>

        <div className="hof-big-counter">
          <span>{String(archiveCount).padStart(2, "0")}</span>

          <div>
            <p>SELECTED</p>
            <p>DIGITAL</p>
            <p>PROJECTS</p>
          </div>
        </div>
      </section>

      {/* =====================================
          FINAL
      ====================================== */}

      <section className="hof-final">
        <span className="hof-final-label">04 — SUBMISSIONS</span>

        <h2>
          THINK YOUR WORK
          <br />
          <i>BELONGS HERE?</i>
        </h2>

        <a href="#contact" className="hof-final-button">
          <span>SUBMIT PROJECT</span>
          <span>↗</span>
        </a>
      </section>

      {/* =====================================
          CARD-ONLY PREMIUM OVERRIDES
          Everything else on the page stays unchanged.
      ====================================== */}

      <style>{`
        .hof-premium-grid {
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          grid-auto-rows: 92px;
          gap: 22px;
          margin-top: 42px;
        }

        .hof-premium-card {
          position: relative;
          overflow: hidden;
          min-height: 360px;
          border-radius: 30px;
          background: #070b14;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow:
            0 18px 50px rgba(15, 23, 42, 0.08),
            0 2px 10px rgba(15, 23, 42, 0.05);
          transform-style: preserve-3d;
          will-change: transform;
        }

        .hof-premium-card--hero {
          grid-column: span 7;
          grid-row: span 7;
        }

        .hof-premium-card--portrait {
          grid-column: span 5;
          grid-row: span 6;
        }

        .hof-premium-card--wide {
          grid-column: span 7;
          grid-row: span 5;
        }

        .hof-premium-card--square {
          grid-column: span 5;
          grid-row: span 5;
        }

        .hof-premium-media {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: inherit;
        }

        .hof-premium-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          will-change: transform;
          filter: saturate(0.9) contrast(1.02);
        }

        .hof-premium-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              180deg,
              rgba(2, 6, 23, 0.06) 0%,
              rgba(2, 6, 23, 0.08) 32%,
              rgba(2, 6, 23, 0.88) 100%
            );
          transition: background 0.45s ease;
        }

        .hof-premium-card:hover .hof-premium-overlay {
          background:
            linear-gradient(
              180deg,
              rgba(2, 6, 23, 0.02) 0%,
              rgba(2, 6, 23, 0.04) 28%,
              rgba(2, 6, 23, 0.94) 100%
            );
        }

        .hof-premium-glow {
          pointer-events: none;
          position: absolute;
          left: 0;
          top: 0;
          width: 260px;
          height: 260px;
          transform: translate(-50%, -50%);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.2);
          filter: blur(70px);
          opacity: 0;
          z-index: 3;
        }

        .hof-premium-top {
          position: absolute;
          left: 20px;
          right: 20px;
          top: 20px;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .hof-premium-rank {
          display: inline-flex;
          width: 44px;
          height: 44px;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.22);
          background: rgba(2, 6, 23, 0.3);
          color: #fff;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.08em;
          backdrop-filter: blur(14px);
        }

        .hof-premium-category {
          max-width: 62%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.22);
          background: rgba(255, 255, 255, 0.1);
          padding: 9px 13px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          backdrop-filter: blur(14px);
        }

        .hof-premium-arrow {
          position: absolute;
          right: 22px;
          bottom: 24px;
          z-index: 8;
          display: flex;
          width: 48px;
          height: 48px;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 999px;
          background: #fff;
          color: #0f172a;
          font-size: 17px;
          cursor: pointer;
          box-shadow: 0 14px 30px rgba(0, 0, 0, 0.2);
          opacity: 0;
          transform: translateY(12px);
          transition:
            opacity 0.3s ease,
            transform 0.3s ease,
            background 0.3s ease,
            color 0.3s ease;
        }

        .hof-premium-card:hover .hof-premium-arrow {
          opacity: 1;
          transform: translateY(0);
        }

        .hof-premium-arrow:hover {
          background: #4f46e5;
          color: #fff;
        }

        .hof-premium-content {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 6;
          padding: 26px;
          padding-right: 90px;
          color: #fff;
          transform: translateZ(24px);
          will-change: transform;
        }

        .hof-premium-page {
          margin: 0 0 10px;
          color: #a5b4fc;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.17em;
          text-transform: uppercase;
        }

        .hof-premium-content h2 {
          margin: 0;
          max-width: 90%;
          color: #fff;
          font-size: clamp(1.7rem, 3vw, 3.8rem);
          font-weight: 950;
          line-height: 0.92;
          letter-spacing: -0.05em;
          text-transform: uppercase;
        }

        .hof-premium-card--portrait .hof-premium-content h2,
        .hof-premium-card--square .hof-premium-content h2 {
          font-size: clamp(1.65rem, 2.4vw, 2.7rem);
        }

        .hof-premium-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.14);
          color: rgba(255, 255, 255, 0.58);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .hof-premium-card::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 4;
          pointer-events: none;
          border-radius: inherit;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
        }

        @media (max-width: 1100px) {
          .hof-premium-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            grid-auto-rows: auto;
          }

          .hof-premium-card,
          .hof-premium-card--hero,
          .hof-premium-card--portrait,
          .hof-premium-card--wide,
          .hof-premium-card--square {
            grid-column: auto;
            grid-row: auto;
            min-height: 480px;
          }

          .hof-premium-card:nth-child(3n + 1) {
            min-height: 560px;
          }
        }

        @media (max-width: 700px) {
          .hof-premium-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .hof-premium-card,
          .hof-premium-card--hero,
          .hof-premium-card--portrait,
          .hof-premium-card--wide,
          .hof-premium-card--square,
          .hof-premium-card:nth-child(3n + 1) {
            min-height: 440px;
          }

          .hof-premium-top {
            left: 16px;
            right: 16px;
            top: 16px;
          }

          .hof-premium-content {
            padding: 20px;
            padding-right: 72px;
          }

          .hof-premium-arrow {
            right: 16px;
            bottom: 18px;
            opacity: 1;
            transform: none;
          }

          .hof-premium-content h2,
          .hof-premium-card--portrait .hof-premium-content h2,
          .hof-premium-card--square .hof-premium-content h2 {
            font-size: 2rem;
          }
        }
      `}</style>
    </main>
  );
}

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../style/Sponsors.css";

import sp1 from "../Image/sp1.png";
import sp2 from "../Image/sp2.png";
import sp3 from "../Image/sp3.png";
import sp4 from "../Image/sp4.png";
import sp5 from "../Image/sp5.png";

gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   ICONS
========================================================= */

function Icon({ name, size = 20 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),

    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),

    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),

    chart: (
      <>
        <path d="M4 20V10" />
        <path d="M10 20V4" />
        <path d="M16 20v-7" />
        <path d="M22 20V7" />
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

    crown: (
      <>
        <path d="m3 7 4 4 5-7 5 7 4-4-2 11H5L3 7Z" />
        <path d="M5 18h14" />
      </>
    ),

    cube: (
      <>
        <path d="m12 2 8 4.5v9L12 20l-8-4.5v-9L12 2Z" />
        <path d="m4 6.5 8 4.5 8-4.5" />
        <path d="M12 11v9" />
      </>
    ),

    megaphone: (
      <>
        <path d="m3 11 15-5v12L3 13v-2Z" />
        <path d="M11.6 16.5 13 21H8l-1.3-6" />
        <path d="M21 9v6" />
      </>
    ),

    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),

    handshake: (
      <>
        <path d="m8 12 3 3c1 1 2.5 1 3.5 0l5-5" />
        <path d="m3 11 4-4 3 1 2-2c1-1 2.5-1 3.5 0L21 11" />
        <path d="m4 12 4 4" />
        <path d="m7 15 2 2" />
      </>
    ),
  };

  return <svg {...common}>{icons[name]}</svg>;
}

/* =========================================================
   DATA
========================================================= */

const benefits = [
  {
    icon: "eye",
    number: "01",
    title: "High Visibility",
    text: "Put your brand in front of students, builders, creators, institutions and emerging technology talent.",
  },
  {
    icon: "users",
    number: "02",
    title: "Real Engagement",
    text: "Create memorable interactions through demos, experiences, challenges, showcases and community moments.",
  },
  {
    icon: "chart",
    number: "03",
    title: "Brand Growth",
    text: "Build long-term recall by supporting ambitious projects and the next generation of technical builders.",
  },
  {
    icon: "globe",
    number: "04",
    title: "Community Reach",
    text: "Connect across projects, events, digital content and DEVNEX's growing project-first ecosystem.",
  },
];

const partnershipTypes = [
  {
    icon: "crown",
    tag: "MAXIMUM PRESENCE",
    title: "Title Partner",
    text: "Own the highest-visibility partnership position across DEVNEX experiences.",
    image: sp3,
  },
  {
    icon: "cube",
    tag: "PRODUCT EXPERIENCE",
    title: "Product Partner",
    text: "Put products directly into the hands of students, builders and attendees.",
    image: sp4,
  },
  {
    icon: "grid",
    tag: "FOCUSED VISIBILITY",
    title: "Category Partner",
    text: "Own a relevant category, experience, challenge, stage or project track.",
    image: sp2,
  },
  {
    icon: "megaphone",
    tag: "STORY + REACH",
    title: "Media Partner",
    text: "Collaborate across digital storytelling, promotion and event coverage.",
    image: sp5,
  },
];

const process = [
  {
    number: "01",
    title: "Connect",
    text: "Tell us about your brand.",
  },
  {
    number: "02",
    title: "Shape",
    text: "We design the right partnership.",
  },
  {
    number: "03",
    title: "Launch",
    text: "Activate your presence.",
  },
  {
    number: "04",
    title: "Grow",
    text: "Build meaningful visibility.",
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function Sponsors() {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const cursorLightRef = useRef(null);

  useEffect(() => {
    const page = pageRef.current;

    if (!page) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
      });

      tl.fromTo(
        ".sponsor-eyebrow",
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
        },
      )
        .fromTo(
          ".sponsor-hero-word",
          {
            opacity: 0,
            y: 70,
            rotateX: 18,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            stagger: 0.09,
            duration: 0.9,
          },
          "-=0.4",
        )
        .fromTo(
          ".sponsor-hero-copy",
          {
            opacity: 0,
            y: 25,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          "-=0.6",
        )
        .fromTo(
          ".sponsor-hero-actions",
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
          },
          "-=0.45",
        )
        .fromTo(
          ".sponsor-mini-stats",
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
          },
          "-=0.4",
        )
        .fromTo(
          ".hero-art-piece",
          {
            opacity: 0,
            scale: 0.9,
            y: 35,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            stagger: 0.12,
          },
          "-=0.8",
        );

      gsap.utils.toArray(".sponsor-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          },
        );
      });

      gsap.fromTo(
        ".benefit-card",
        {
          opacity: 0,
          y: 40,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.09,
          duration: 0.75,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".benefits-grid",
            start: "top 85%",
            once: true,
          },
        },
      );

      gsap.fromTo(
        ".partnership-card",
        {
          opacity: 0,
          y: 55,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.11,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".partnership-grid",
            start: "top 85%",
            once: true,
          },
        },
      );

      gsap.to(".hero-main-image img", {
        yPercent: 7,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".sponsor-dark-image img", {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: ".sponsor-dark-section",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, page);

    const handleMouseMove = (event) => {
      if (!cursorLightRef.current) return;

      gsap.to(cursorLightRef.current, {
        x: event.clientX,
        y: event.clientY,
        duration: 0.55,
        ease: "power3.out",
        overwrite: true,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    const timer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      window.clearTimeout(timer);

      window.removeEventListener("mousemove", handleMouseMove);

      ctx.revert();
    };
  }, []);

  return (
    <main ref={pageRef} className="sponsors-page">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="sponsors-grid-bg" />

      <div ref={cursorLightRef} className="sponsors-cursor-light" />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section ref={heroRef} className="sponsor-hero">
        <div className="sponsor-shell">
          <div className="sponsor-hero-layout">
            {/* LEFT */}

            <div className="sponsor-hero-content">
              <div className="sponsor-eyebrow">
                <span className="eyebrow-dot" />
                SPONSORSHIP / PARTNERSHIPS
              </div>

              <h1 className="sponsor-hero-title">
                <span className="sponsor-hero-word">Partner</span>

                <span className="sponsor-hero-word">with ideas</span>

                <span className="sponsor-hero-word">that build</span>

                <span className="sponsor-hero-word gradient-word">
                  real impact.
                </span>
              </h1>

              <p className="sponsor-hero-copy">
                DEVNEX connects ambitious student builders, practical projects,
                institutions and industry. Partner with a platform designed to
                turn hidden talent into visible opportunity.
              </p>

              <div className="sponsor-hero-actions">
                <a href="#partner" className="primary-sponsor-btn">
                  <span>Become a Sponsor</span>

                  <span className="button-icon">
                    <Icon name="arrow" size={17} />
                  </span>
                </a>

                <a href="#partnerships" className="secondary-sponsor-btn">
                  Explore Partnerships
                  <Icon name="arrow" size={16} />
                </a>
              </div>

              <div className="sponsor-mini-stats">
                <div>
                  <strong>01</strong>
                  <span>Project-first platform</span>
                </div>

                <div>
                  <strong>02</strong>
                  <span>Student + industry bridge</span>
                </div>

                <div>
                  <strong>03</strong>
                  <span>Real-world visibility</span>
                </div>
              </div>
            </div>

            {/* RIGHT */}

            <div className="sponsor-hero-art">
              <div className="hero-art-orbit orbit-one" />
              <div className="hero-art-orbit orbit-two" />

              <div className="hero-art-piece hero-main-image">
                <img src={sp1} alt="DEVNEX event" />
              </div>

              <div className="hero-art-piece hero-small-image hero-small-top">
                <img src={sp2} alt="DEVNEX ideas" />

                <span>IDEAS</span>
              </div>

              <div className="hero-art-piece hero-small-image hero-small-bottom">
                <img src={sp3} alt="DEVNEX projects" />

                <span>PROJECTS</span>
              </div>

              <div className="hero-floating-card hero-art-piece">
                <span className="floating-card-index">DEV / 01</span>

                <strong>
                  BUILD.
                  <br />
                  SHOW.
                  <br />
                  GROW.
                </strong>

                <span className="floating-arrow">
                  <Icon name="arrow" size={17} />
                </span>
              </div>

              <div className="hero-round-label">
                <span>IDEAS</span>

                <i />

                <span>PROJECTS</span>
              </div>
            </div>
          </div>
        </div>

        {/* MARQUEE */}

        <div className="sponsor-marquee">
          <div className="sponsor-marquee-track">
            <span>BUILD WITH DEVNEX</span>
            <i />

            <span>SUPPORT REAL PROJECTS</span>
            <i />

            <span>DISCOVER TALENT</span>
            <i />

            <span>CREATE OPPORTUNITY</span>
            <i />

            <span>BUILD WITH DEVNEX</span>
            <i />

            <span>SUPPORT REAL PROJECTS</span>
            <i />

            <span>DISCOVER TALENT</span>
            <i />

            <span>CREATE OPPORTUNITY</span>
            <i />
          </div>
        </div>
      </section>

      {/* =====================================================
          WHY DEVNEX
      ===================================================== */}

      <section className="sponsor-section sponsor-intro-section">
        <div className="sponsor-shell">
          <div className="section-heading-layout sponsor-reveal">
            <div>
              <div className="section-kicker">
                <span />
                WHY DEVNEX
              </div>

              <h2>
                More than
                <br />
                <em>brand exposure.</em>
              </h2>
            </div>

            <div className="section-copy">
              <p>
                Strong partnerships should create value on both sides. DEVNEX
                gives brands a meaningful way to support students while
                connecting with the builders, creators and technologists shaping
                what comes next.
              </p>

              <a href="#partnerships" className="text-link">
                Explore the opportunity
                <Icon name="arrow" size={16} />
              </a>
            </div>
          </div>

          <div className="benefits-grid">
            {benefits.map((item) => (
              <article className="benefit-card" key={item.number}>
                <div className="benefit-card-top">
                  <div className="benefit-icon">
                    <Icon name={item.icon} size={21} />
                  </div>

                  <span>{item.number}</span>
                </div>

                <h3>{item.title}</h3>

                <p>{item.text}</p>

                <div className="benefit-line" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          STORY
      ===================================================== */}

      <section className="sponsor-story sponsor-reveal">
        <div className="sponsor-shell">
          <div className="sponsor-story-layout">
            <div className="story-image-main">
              <img src={sp4} alt="DEVNEX student collaboration" />

              <div className="story-image-label">
                <span>PROJECT-FIRST</span>

                <strong>
                  Talent becomes visible
                  <br />
                  when work gets seen.
                </strong>
              </div>
            </div>

            <div className="story-content">
              <span className="story-number">02 / IMPACT</span>

              <h2>
                Support the people
                <br />
                <span>building next.</span>
              </h2>

              <p>
                Every meaningful project starts with curiosity. DEVNEX helps
                turn that curiosity into proof — and partnerships can help give
                those projects a bigger stage.
              </p>

              <div className="story-points">
                <div>
                  <strong>Students</strong>

                  <span>Get visibility and opportunity.</span>
                </div>

                <div>
                  <strong>Institutions</strong>

                  <span>Show practical student outcomes.</span>
                </div>

                <div>
                  <strong>Brands</strong>

                  <span>Connect with emerging talent.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PARTNERSHIPS
      ===================================================== */}

      <section id="partnerships" className="sponsor-dark-section">
        <div className="sponsor-dark-image">
          <img src={sp5} alt="" />
        </div>

        <div className="sponsor-dark-overlay" />

        <div className="sponsor-shell sponsor-dark-content">
          <div className="dark-heading sponsor-reveal">
            <div>
              <div className="dark-kicker">PARTNERSHIP MODELS</div>

              <h2>
                Find your place
                <br />
                <span>inside DEVNEX.</span>
              </h2>
            </div>

            <p>
              No two brands are the same. Partnership opportunities can be
              shaped around visibility, products, experiences, content,
              recruitment, education or community impact.
            </p>
          </div>

          <div className="partnership-grid">
            {partnershipTypes.map((item, index) => (
              <article className="partnership-card" key={item.title}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="partnership-image"
                />

                <div className="partnership-shade" />

                <div className="partnership-card-content">
                  <div className="partnership-card-top">
                    <span className="partnership-icon">
                      <Icon name={item.icon} size={21} />
                    </span>

                    <span className="partnership-index">0{index + 1}</span>
                  </div>

                  <div>
                    <small>{item.tag}</small>

                    <h3>{item.title}</h3>

                    <p>{item.text}</p>

                    <button
                      className="round-card-button"
                      type="button"
                      aria-label={item.title}
                    >
                      <Icon name="arrow" size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          VALUE
      ===================================================== */}

      <section className="sponsor-numbers">
        <div className="sponsor-shell">
          <div className="numbers-header sponsor-reveal">
            <div>
              <div className="section-kicker">
                <span />
                PARTNERSHIP VALUE
              </div>

              <h2>
                Built for more than
                <span> impressions.</span>
              </h2>
            </div>
          </div>

          <div className="numbers-grid sponsor-reveal">
            <div className="number-item">
              <strong>01</strong>

              <h3>Visibility</h3>

              <p>Across DEVNEX experiences and digital touchpoints.</p>
            </div>

            <div className="number-item">
              <strong>02</strong>

              <h3>Connection</h3>

              <p>Between brands, institutions and emerging builders.</p>
            </div>

            <div className="number-item">
              <strong>03</strong>

              <h3>Participation</h3>

              <p>Create activations people can actually experience.</p>
            </div>

            <div className="number-item">
              <strong>04</strong>

              <h3>Discovery</h3>

              <p>Meet talent through demonstrated project execution.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PROCESS
      ===================================================== */}

      <section className="sponsor-process">
        <div className="sponsor-shell">
          <div className="process-heading sponsor-reveal">
            <div>
              <div className="section-kicker">
                <span />
                HOW IT WORKS
              </div>

              <h2>
                From hello
                <br />
                <em>to impact.</em>
              </h2>
            </div>

            <p>
              Simple conversations. Clear goals. A partnership designed around
              what actually matters to your brand.
            </p>
          </div>

          <div className="process-grid sponsor-reveal">
            {process.map((item, index) => (
              <div className="process-card" key={item.number}>
                <span className="process-number">{item.number}</span>

                <div className="process-dot" />

                <h3>{item.title}</h3>

                <p>{item.text}</p>

                {index < process.length - 1 && (
                  <span className="process-arrow">
                    <Icon name="arrow" size={18} />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section id="partner" className="sponsor-final">
        <div className="sponsor-shell">
          <div className="final-card sponsor-reveal">
            <div className="final-orb final-orb-one" />
            <div className="final-orb final-orb-two" />

            <div className="final-grid-pattern" />

            <div className="final-content">
              <div className="final-label">
                <Icon name="handshake" size={16} />
                PARTNER WITH DEVNEX
              </div>

              <h2>
                Let's build something
                <br />
                <span>bigger together.</span>
              </h2>

              <p>
                Support meaningful student work, discover emerging talent and
                create a partnership people remember.
              </p>
            </div>

            <div className="final-actions">
              <a href="mailto:hello@devnex.in" className="final-main-btn">
                Become a Sponsor
                <Icon name="arrow" size={17} />
              </a>

              <a href="mailto:hello@devnex.in" className="final-secondary-btn">
                Contact Our Team
              </a>
            </div>

            <span className="final-big-text">DEVNEX</span>
          </div>
        </div>
      </section>
    </main>
  );
}

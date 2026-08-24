import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Import your local videos from the Image folder
import one from "../Image/glone.MP4";
import two from "../Image/gmtwo.mp4";
import three from "../Image/gkten.MP4";
import four from "../Image/markit.MP4";
import five from "../Image/AI.mp4";



// image
import one1 from "../Image/mgone.JPG";
import two1 from "../Image/mgtwo.JPG";
import there1 from "../Image/market.jpg";
import Four from "../Image/AI.png";
import six from "../Image/saas.png";
import sixe from "../Image/app.png";



gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   MEDIA ITEMS (5 TOTAL VIDEOS: 1 HERO + 4 GRID)
========================================================= */

const workVideos = [
  {
    id: 1,
    src: one,
    title: "Creative Studio",
    category: "DESIGN",
  },
  {
    id: 2,
    src: two,
    title: "WEB DEVELOPMENT",
    category: "WEB",
  },
  {
    id: 3,
    src: three,
    title: "SaaS & Utility Automation",
    category: "CODE",
  },
  {
    id: 4,
    src: four,
    title: "Digital Marketing",
    category: "UI / UX",
  },
  {
    id: 5,
    src: five,
    title: "AI & Machine Learning",
    category: "MOTION",
  },
];

const inspirationImages = [
  {
    id: 1,
    src: one1,
    title: "WEB DEVELOPMENT",
    category: "CODE",
  },
  {
    id: 2,
    src: two1,
    title: "Future Interface",
    category: "UI / UX",
  },
  {
    id: 3,
    src: there1,
    title: "Digital Marketing",
    category: "PRODUCT",
  },
  {
    id: 4,
    src: Four,
    title: "AI & Machine Learning",
    category: "CREATIVE",
  },
  {
    id: 5,
    src: six,
    title: "Mobile Application Development",
    category: "FINTECH",
  },
  {
    id: 6,
    src: sixe,
    title: "SaaS & Utility Automation",
    category: "BRANDING",
  },
];

/* =========================================================
   BACKGROUND
========================================================= */

function AnimatedLines() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute left-[8%] top-0 h-full w-px bg-[#4f46e5]/[0.06]" />
      <div className="absolute left-[25%] top-0 h-full w-px bg-[#4f46e5]/[0.06]" />
      <div className="absolute left-[50%] top-0 h-full w-px bg-[#4f46e5]/[0.06]" />
      <div className="absolute left-[75%] top-0 h-full w-px bg-[#4f46e5]/[0.06]" />
      <div className="absolute right-[8%] top-0 h-full w-px bg-[#4f46e5]/[0.06]" />

      <div className="absolute left-0 top-[20%] h-px w-full bg-[#4f46e5]/[0.06]" />
      <div className="absolute left-0 top-[50%] h-px w-full bg-[#4f46e5]/[0.06]" />
      <div className="absolute left-0 top-[80%] h-px w-full bg-[#4f46e5]/[0.06]" />

      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1000 2000"
        preserveAspectRatio="none"
      >
        <path
          d="M 80 0 C 160 220 20 380 130 570 C 250 760 40 880 180 1080 C 300 1250 120 1450 250 1650 C 340 1780 280 1900 330 2000"
          fill="none"
          stroke="#4f46e5"
          strokeOpacity="0.12"
          strokeWidth="1"
        />
        <path
          d="M 900 0 C 800 180 960 360 850 560 C 760 740 940 900 820 1100 C 700 1300 900 1470 770 1650 C 680 1800 760 1900 690 2000"
          fill="none"
          stroke="#4f46e5"
          strokeOpacity="0.12"
          strokeWidth="1"
        />
        <path
          d="M 500 0 C 430 250 570 400 500 650 C 430 900 570 1100 500 1350 C 440 1580 560 1800 500 2000"
          fill="none"
          stroke="#4f46e5"
          strokeOpacity="0.06"
          strokeWidth="1"
        />
      </svg>

      <div className="absolute left-[8%] top-0 h-2 w-2 rounded-full bg-[#4f46e5]/40 animate-line-down" />
      <div className="absolute right-[8%] top-0 h-2 w-2 rounded-full bg-[#4f46e5]/40 animate-line-down delay-700" />
      <div className="absolute left-[50%] top-0 h-1.5 w-1.5 rounded-full bg-[#4f46e5]/30 animate-line-down delay-1400" />
    </div>
  );
}

/* =========================================================
   AUTOPLAY VIDEO
========================================================= */

function AutoVideo({ src, className = "", priority = false }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;

    const playVideo = async () => {
      try {
        await video.play();
      } catch {
        // Browser may delay autoplay until interaction.
      }
    };

    playVideo();

    return () => {
      video.pause();
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
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
   VIDEO CARD
========================================================= */

function VideoCard({ video, index }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        {
          y: 60,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        },
      );
    }, card);

    return () => ctx.revert();
  }, []);

  return (
    <article
      ref={cardRef}
      className="
        group
        relative
        overflow-hidden
        rounded-[26px]
        border
        border-[#e2e8f0]
        bg-[#0f172a]
        shadow-md
      "
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <AutoVideo
          src={video.src}
          className="
            h-full
            w-full
            object-cover
            opacity-95
            transition-transform
            duration-1000
            ease-out
            group-hover:scale-[1.05]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-[#0f172a]/90
            via-[#0f172a]/20
            to-transparent
          "
        />

        <div className="absolute left-5 top-5">
          <span
            className="
              rounded-full
              border
              border-white/25
              bg-white/10
              px-3
              py-1.5
              text-[10px]
              font-medium
              tracking-[0.2em]
              text-white
              backdrop-blur-md
            "
          >
            0{index + 1} / {video.category}
          </span>
        </div>

        <div className="absolute bottom-5 left-5 right-16">
          <h3
            className="
              text-2xl
              font-medium
              tracking-[-0.04em]
              text-white
              md:text-3xl
            "
          >
            {video.title}
          </h3>
        </div>

        <div
          className="
            absolute
            bottom-5
            right-5
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
            border-white/30
            bg-white/10
            text-white
            backdrop-blur-md
            transition-all
            duration-500
            group-hover:scale-110
            group-hover:border-[#4f46e5]
            group-hover:bg-[#4f46e5]
          "
        >
          ↗
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   IMAGE CARD
========================================================= */

function ImageCard({ item, index }) {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        {
          y: 60,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        },
      );
    }, card);

    return () => ctx.revert();
  }, []);

  return (
    <article
      ref={cardRef}
      className="
        group
        relative
        overflow-hidden
        rounded-[26px]
        border
        border-[#e2e8f0]
        bg-[#0f172a]
        shadow-md
      "
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={item.src}
          alt={item.title}
          className="
            h-full
            w-full
            object-cover
            opacity-95
            transition-transform
            duration-1000
            ease-out
            group-hover:scale-[1.05]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-t
            from-[#0f172a]/90
            via-[#0f172a]/20
            to-transparent
          "
        />

        <div className="absolute left-5 top-5">
          <span
            className="
              rounded-full
              border
              border-white/25
              bg-white/10
              px-3
              py-1.5
              text-[10px]
              font-medium
              tracking-[0.2em]
              text-white
              backdrop-blur-md
            "
          >
            0{index + 1} / {item.category}
          </span>
        </div>

        <div className="absolute bottom-5 left-5 right-16">
          <h3
            className="
              text-2xl
              font-medium
              tracking-[-0.04em]
              text-white
              md:text-3xl
            "
          >
            {item.title}
          </h3>
        </div>

        <div
          className="
            absolute
            bottom-5
            right-5
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
            border-white/30
            bg-white/10
            text-white
            backdrop-blur-md
            transition-all
            duration-500
            group-hover:scale-110
            group-hover:border-[#4f46e5]
            group-hover:bg-[#4f46e5]
          "
        >
          ↗
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   GALLERY
========================================================= */

export default function Gallery() {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const heroVideoRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        heroVideoRef.current,
        {
          scale: 0.72,
          opacity: 0,
          y: 60,
          borderRadius: "30px",
        },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          borderRadius: "28px",
          duration: 1.3,
          ease: "power4.out",
        },
      );

      gsap.to(heroVideoRef.current, {
        width: "100vw",
        height: "100vh",
        borderRadius: "0px",
        scale: 1,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom 45%",
          scrub: 1.2,
        },
      });

      gsap.utils.toArray(".reveal-section").forEach((element) => {
        gsap.fromTo(
          element,
          {
            y: 50,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, pageRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <main
      ref={pageRef}
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#f8f9fa]
        text-[#0f172a]
      "
    >
      <AnimatedLines />

      {/* HERO SECTION */}
      <section
        ref={heroRef}
        className="
          relative
          z-10
          min-h-[150vh]
          px-5
          pt-20
        "
      >
        <div
          className="
            relative
            mx-auto
            h-full
            min-h-[140vh]
            max-w-[1500px]
          "
        >
          <div
            ref={heroVideoRef}
            className="
              absolute
              left-1/2
              top-[18vh]
              z-10
              h-[58vh]
              w-[72vw]
              -translate-x-1/2
              overflow-hidden
              rounded-[28px]
              bg-[#0f172a]
              shadow-[0_40px_120px_rgba(79,70,229,0.15)]
              will-change-[width,height,transform,border-radius]
            "
          >
            <AutoVideo
              src={workVideos[0].src}
              priority
              className="
                h-full
                w-full
                object-cover
              "
            />
            <div className="pointer-events-none absolute inset-0 bg-black/10" />
          </div>

          <div
            className="
              absolute
              left-0
              top-[50vh]
              hidden
              -rotate-90
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.4em]
              text-[#64748b]
              lg:block
            "
          >
            SCROLL TO EXPLORE
          </div>

          <div
            className="
              absolute
              right-0
              top-[50vh]
              hidden
              rotate-90
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.4em]
              text-[#64748b]
              lg:block
            "
          >
            2026 — DIGITAL ARCHIVE
          </div>
        </div>
      </section>

      {/* SELECTED WORK */}
      <section
        id="work"
        className="
          relative
          z-10
          mx-auto
          max-w-[1500px]
          px-5
          py-32
          md:px-10
          md:py-48
        "
      >
        <div
          className="
            reveal-section
            mb-20
            flex
            flex-col
            justify-between
            gap-8
            md:flex-row
            md:items-end
          "
        >
          <div>
            <p
              className="
                mb-5
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.4em]
                text-[#64748b]
              "
            >
              01 / SELECTED WORK
            </p>

            <h2
              className="
                max-w-3xl
                text-6xl
                font-extrabold
                leading-[0.9]
                tracking-[-0.065em]
                text-[#0f172a]
                md:text-8xl
              "
            >
              Explore what
              <br />
              people <span className="italic text-[#4f46e5]">build.</span>
            </h2>
          </div>

          <p
            className="
              max-w-sm
              text-sm
              leading-6
              text-[#64748b]
            "
          >
            A visual collection of websites and digital products submitted by
            creators from around the world.
          </p>
        </div>

        {/* 4 Video Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {workVideos.slice(1, 5).map((video, index) => (
            <VideoCard key={video.id} video={video} index={index} />
          ))}
        </div>
      </section>

      {/* DISCOVER (6 IMAGE CARDS GRID) */}
      <section
        className="
          relative
          z-10
          bg-[#f8f9fa]
          px-5
          py-32
          md:px-10
          md:py-48
        "
      >
        <div className="mx-auto max-w-[1500px]">
          <div className="reveal-section mb-20">
            <p
              className="
                mb-5
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.4em]
                text-[#64748b]
              "
            >
              02 / DISCOVER
            </p>

            <h2
              className="
                text-6xl
                font-extrabold
                tracking-[-0.07em]
                text-[#0f172a]
                md:text-8xl
              "
            >
              More
              <br />
              <span className="italic text-[#4f46e5]">inspiration.</span>
            </h2>
          </div>

          {/* 6 Images Grid */}
          <div className="grid gap-5 md:grid-cols-3">
            {inspirationImages.map((item, index) => (
              <ImageCard key={item.id} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT (AWWWARDS WINNING STYLE) */}
      <section
        id="contact"
        className="
          relative
          z-10
          flex
          min-h-screen
          flex-col
          items-center
          justify-center
          overflow-hidden
          bg-[#070b14]
          px-5
          py-24
          text-white
        "
      >
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

        <div className="reveal-section relative z-10 text-center">
          <p
            className="
              mb-6
              text-[11px]
              font-bold
              uppercase
              tracking-[0.45em]
              text-indigo-400
            "
          >
            HAVE SOMETHING TO SHOW?
          </p>

          <h2
            className="
              text-[16vw]
              font-black
              leading-[0.75]
              tracking-[-0.08em]
              select-none
              drop-shadow-2xl
            "
          >
            SHOW
            <br />
            <span className="italic text-[#818cf8] font-serif font-normal">
              us.
            </span>
          </h2>

          <a
            href="/upload"
            className="
              group
              relative
              mt-16
              inline-flex
              items-center
              justify-center
              overflow-hidden
              rounded-full
              bg-[#4f46e5]
              px-12
              py-6
              text-xs
              font-black
              uppercase
              tracking-[0.25em]
              text-white
              shadow-[0_20px_50px_rgba(79,70,229,0.4)]
              transition-all
              duration-500
              hover:bg-[#4338ca]
              hover:scale-110
              hover:shadow-[0_25px_60px_rgba(79,70,229,0.6)]
            "
          >
            <span className="relative z-10">Submit Website</span>
            <div className="absolute inset-0 h-full w-full scale-x-0 bg-white/25 transition-transform duration-500 origin-left group-hover:scale-x-100" />
          </a>
        </div>

        {/* Moving Marquee Ticker */}
        <div className="absolute bottom-8 w-full overflow-hidden whitespace-nowrap opacity-15 pointer-events-none">
          <div className="inline-block animate-marquee text-[12vw] font-black uppercase tracking-tighter text-white">
            SUBMIT YOUR WORK • SHOW US YOUR PROJECT • AWWWARDS WINNING DESIGN •
          </div>
          <div className="inline-block animate-marquee text-[12vw] font-black uppercase tracking-tighter text-white pl-8">
            SUBMIT YOUR WORK • SHOW US YOUR PROJECT • AWWWARDS WINNING DESIGN •
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="
          relative
          z-10
          flex
          flex-col
          justify-between
          gap-5
          border-t
          border-white/10
          bg-[#070b14]
          px-5
          pb-8
          pt-8
          text-xs
          text-white/50
          md:flex-row
          md:px-10
        "
      >
        <p>© 2026 HUBWEB</p>
        <p>BUILT FOR THE WEB</p>
      </footer>

      {/* CSS */}
      <style>{`
        @keyframes lineDown {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }

        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-line-down {
          animation: lineDown 5s linear infinite;
        }

        .animate-marquee {
          animation: marquee 25s linear infinite;
        }

        .delay-700 {
          animation-delay: 2s;
        }

        .delay-1400 {
          animation-delay: 4s;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          padding: 0;
        }

        video, img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        ::selection {
          background: #4f46e5;
          color: white;
        }

        @media (max-width: 768px) {
          .hero-video {
            width: 92vw;
            height: 55vh;
          }
        }
      `}</style>
    </main>
  );
}

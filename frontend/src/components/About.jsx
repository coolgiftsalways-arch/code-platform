import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Code,
  Globe,
  Zap,
  ArrowRight,
  CheckCircle2,
  Users,
  Rocket,
  ShieldCheck,
  Heart,
  Sparkles,
  Server,
  Cpu,
} from "lucide-react";

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const cardSlides = [
  {
    title: "Season 01 Metrics",
    subtitle: "Status • Active Execution",
    stat: "₹1,00,000+",
    statLabel: "Total Prize Pool",
    url: "Live Code Screening Engine",
    tag: "Active",
    icon: Code,
  },
  {
    title: "Merit Verification",
    subtitle: "GitHub & README Check",
    stat: "100%",
    statLabel: "Code Ownership",
    url: "Automated API Scanning",
    tag: "Secure",
    icon: ShieldCheck,
  },
  {
    title: "Partner Institutes",
    subtitle: "Colleges & Computer Classes",
    stat: "50+",
    statLabel: "Leaderboard Tracking",
    url: "INST-MUM01 Ecosystem",
    tag: "Optimized",
    icon: Server,
  },
  {
    title: "Virtual Defense",
    subtitle: "5-Minute Live Session",
    stat: "5m",
    statLabel: "Technical Defense",
    url: "Expert Jury Evaluation",
    tag: "Live",
    icon: Zap,
  },
  {
    title: "Hall of Fame",
    subtitle: "Verified Developer Portfolios",
    stat: "SEO",
    statLabel: "Long-Term Visibility",
    url: "Hiring Partner Network",
    tag: "Fast",
    icon: Cpu,
  },
];

export default function AboutUs() {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const cursorLightRef = useRef(null);
  const mockupRef = useRef(null);
  const slideContentRef = useRef(null);
  const lineSvgRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Counter States for ScrollTrigger
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const [count4, setCount4] = useState(0);

  // Entrance animation refs
  const badgeRef = useRef(null);
  const headlineRef = useRef(null);
  const textRef = useRef(null);
  const checksRef = useRef(null);
  const statsRef = useRef(null);
  const storyRef = useRef(null);
  const valuesRef = useRef(null);
  const ctaRef = useRef(null);

  // Auto slide effect every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (slideContentRef.current) {
        gsap.to(slideContentRef.current, {
          opacity: 0,
          y: -15,
          duration: 0.3,
          onComplete: () => {
            setCurrentIndex((prev) => (prev + 1) % cardSlides.length);
            gsap.fromTo(
              slideContentRef.current,
              { opacity: 0, y: 15 },
              { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
            );
          },
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // GSAP & ScrollTrigger setup with slower counting duration (3.5s)
  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    const cursorLight = cursorLightRef.current;

    const ctx = gsap.context(() => {
      // 1. Stats Counter ScrollTrigger Animation (Slower & Smoother)
      if (statsRef.current) {
        ScrollTrigger.create({
          trigger: statsRef.current,
          start: "top 85%",
          onEnter: () => {
            // Target Student Applicants (0 to 1000)
            gsap.to(
              { val: 0 },
              {
                val: 1000,
                duration: 3.5,
                ease: "power1.out",
                onUpdate: function () {
                  setCount1(Math.floor(this.targets()[0].val));
                },
              },
            );

            // Prize Pool & Category Rewards (0 to 100000)
            gsap.to(
              { val: 0 },
              {
                val: 100000,
                duration: 3.5,
                ease: "power1.out",
                onUpdate: function () {
                  setCount2(Math.floor(this.targets()[0].val));
                },
              },
            );

            // Partner Institutes & Colleges (0 to 50)
            gsap.to(
              { val: 0 },
              {
                val: 50,
                duration: 3.5,
                ease: "power1.out",
                onUpdate: function () {
                  setCount3(Math.floor(this.targets()[0].val));
                },
              },
            );

            // Code Ownership Verification (0 to 100)
            gsap.to(
              { val: 0 },
              {
                val: 100,
                duration: 3.5,
                ease: "power1.out",
                onUpdate: function () {
                  setCount4(Math.floor(this.targets()[0].val));
                },
              },
            );
          },
          once: false,
        });
      }

      // 2. Entrance Timelines
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
      )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.5",
        )
        .fromTo(
          textRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.6",
        )
        .fromTo(
          checksRef.current?.children
            ? Array.from(checksRef.current.children)
            : [],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
          "-=0.5",
        )
        .fromTo(
          mockupRef.current,
          { opacity: 0, scale: 0.92, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 1 },
          "-=0.7",
        )
        .fromTo(
          statsRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.6",
        )
        .fromTo(
          storyRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.5",
        )
        .fromTo(
          valuesRef.current?.children
            ? Array.from(valuesRef.current.children)
            : [],
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.15 },
          "-=0.5",
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.4",
        );

      if (lineSvgRef.current) {
        gsap.fromTo(
          lineSvgRef.current,
          { strokeDashoffset: 300 },
          { strokeDashoffset: 0, duration: 2, ease: "power2.out", delay: 0.5 },
        );
      }
    }, sectionRef);

    const handleMouseMove = (e) => {
      if (!section || !grid || !cursorLight) return;
      const rect = section.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const percentX = mouseX / rect.width - 0.5;
      const percentY = mouseY / rect.height - 0.5;

      gsap.to(grid, {
        x: percentX * 30,
        y: percentY * 30,
        duration: 1.2,
        ease: "power3.out",
        overwrite: true,
      });

      gsap.to(cursorLight, {
        x: mouseX,
        y: mouseY,
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      });
    };

    if (section) section.addEventListener("mousemove", handleMouseMove);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      if (section) section.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const currentSlide = cardSlides[currentIndex];
  const ActiveIcon = currentSlide.icon;

  return (
    <>
      {/* 1. Header Navigation Bar */}

      <section
        ref={sectionRef}
        className="relative pt-32 pb-24 overflow-hidden bg-slate-50 min-h-screen text-slate-800 font-sans"
      >
        {/* Background Interactive Grid & Spotlight */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden w-full h-full">
          <div
            ref={gridRef}
            className="absolute -inset-24 w-[calc(100%+192px)] h-[calc(100%+192px)] opacity-60 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:48px_48px]"
          />
          <div
            ref={cursorLightRef}
            className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-pink-500/10 blur-[120px]"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-20">
          {/* 2. Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div
                ref={badgeRef}
                className="inline-flex items-center space-x-2 bg-indigo-50/90 backdrop-blur-sm border border-indigo-100/80 px-4 py-2 rounded-full shadow-sm"
              >
                <Users className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-semibold text-indigo-900">
                  Empowering Grassroots Developers Across Mumbai & MMR
                </span>
              </div>

              <h1
                ref={headlineRef}
                className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1]"
              >
                Bridging The Gap Between Classroom Coding And Real-World Proof.
              </h1>

              <p
                ref={textRef}
                className="text-slate-600 text-lg leading-relaxed max-w-xl"
              >
                We are on a mission to discover, verify, and spotlight student
                developers from computer institutes and colleges—giving true
                builders a national platform backed by industry recognition and
                sponsor visibility.
              </p>

              <div ref={checksRef} className="space-y-3 pt-2">
                <div className="flex items-center space-x-3 text-slate-700 font-medium text-sm">
                  <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>
                    100% Merit-Based Verification via Live Code Defense
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-slate-700 font-medium text-sm">
                  <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span>
                    Direct Access to Top Tech Sponsors & Hiring Pipelines
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div
                ref={mockupRef}
                className="bg-white backdrop-blur-2xl border border-slate-200/80 rounded-[2.5rem] shadow-2xl p-6 sm:p-8 relative overflow-hidden"
              >
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  </div>

                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Season 01 Execution Metrics (Status: Active)
                  </span>
                </div>

                <div ref={slideContentRef} className="py-6 space-y-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                        <ActiveIcon className="w-8 h-8" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-extrabold text-slate-900 text-base">
                            {currentSlide.title}
                          </h4>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                            {currentSlide.tag}
                          </span>
                        </div>
                        <p className="text-xs text-indigo-600 font-medium">
                          {currentSlide.url}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {currentSlide.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-indigo-100/80 p-4 rounded-2xl text-center shadow-sm flex-shrink-0">
                      <span className="text-xl sm:text-2xl font-black text-indigo-600 tracking-tight">
                        {currentSlide.stat}
                      </span>
                      <p className="text-[9px] uppercase tracking-wider font-bold text-slate-500">
                        {currentSlide.statLabel}
                      </p>
                    </div>
                  </div>

                  <div className="w-full h-px bg-slate-100"></div>

                  <div className="space-y-2.5">
                    <div className="w-full h-2.5 bg-slate-100 rounded-full"></div>
                    <div className="w-5/6 h-2.5 bg-slate-100 rounded-full"></div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
                      <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></span>
                      <span>
                        Live GitHub Verification & Code Screening Engine
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                      <Globe className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Key Metrics Bar (4 Counter Cards) */}
          <div
            ref={statsRef}
            className="bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-3xl shadow-sm p-8 grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100 text-center"
          >
            <div className="space-y-1 pt-4 md:pt-0">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {count1.toLocaleString()}+
              </h3>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Target Student Applicants
              </p>
            </div>

            <div className="space-y-1 pt-4 md:pt-0">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                <Rocket className="w-5 h-5" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                ₹{count2.toLocaleString()}+
              </h3>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Prize Pool & Category Rewards
              </p>
            </div>

            <div className="space-y-1 pt-4 md:pt-0">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {count3.toLocaleString()}+
              </h3>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Partner Institutes & Colleges
              </p>
            </div>

            <div className="space-y-1 pt-4 md:pt-0">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {count4}%
              </h3>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Code Ownership Verification
              </p>
            </div>
          </div>

          {/* 4. Two-Column Story & Values Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div ref={storyRef} className="lg:col-span-5 space-y-6">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Why We Built The Championship
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-base">
                <p>
                  Traditional academic marks rarely reflect a developer's true
                  ability to build software. Most student coders build
                  impressive projects during their classes that remain hidden in
                  local drives or unread repositories.
                </p>
                <p>
                  The National Student Developer Championship was created to
                  change that. By combining a zero-barrier submission process
                  with mandatory live code defenses and permanent Hall of Fame
                  indexing, we give every student coder the proof of skill they
                  need to stand out.
                </p>
              </div>
              <div className="pt-4">
                <a
                  href="/categories"
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-7 py-3.5 rounded-2xl shadow-lg shadow-indigo-600/25 transition-all text-sm"
                >
                  Explore Competition Categories{" "}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Our Values
              </h2>

              <div
                ref={valuesRef}
                className="grid grid-cols-1 sm:grid-cols-3 gap-6"
              >
                <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:border-indigo-400 transition-all">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Proof Over Credentials
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    We judge candidates on working code, clean architecture, and
                    project defense—not on college pedigree or degrees.
                  </p>
                </div>

                <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:border-indigo-400 transition-all">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Zero Gatekeeping
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Initial submissions are 100% free, ensuring financial status
                    never stops a talented developer from getting discovered.
                  </p>
                </div>

                <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:border-indigo-400 transition-all">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Long-Term Visibility
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Finalists earn permanent, SEO-indexed Hall of Fame profiles
                    showcasing their verified work to sponsors and future
                    recruiters.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Call-To-Action Banner (Bottom Pre-Footer) */}
          <div
            ref={ctaRef}
            className="bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-indigo-50/80 border border-indigo-100 rounded-3xl p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left"
          >
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Ready to prove what you can build?
              </h3>
              <p className="text-sm text-slate-600 max-w-lg">
                Submit your existing GitHub project for free, pass the 5-minute
                technical defense, and earn your place in the Hall of Fame.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 flex-shrink-0">
              <a
                href="/upload"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-indigo-600/25 transition-all text-sm w-full sm:w-auto text-center"
              >
                Submit Your GitHub Project (Free)
              </a>
              <a
                href="/institutes"
                className="bg-white hover:bg-slate-50 text-slate-800 font-semibold px-8 py-4 rounded-2xl border border-slate-200 shadow-sm transition-all text-sm w-full sm:w-auto text-center flex items-center justify-center gap-1.5"
              >
                View Institute Leaderboard →
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

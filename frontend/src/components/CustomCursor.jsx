import { useEffect, useRef, useState } from "react";

import gsap from "gsap";

/* =========================================================
   DEVNEX PREMIUM CUSTOM CURSOR
========================================================= */

export default function CustomCursor() {
  const pointerRef = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);
  const rippleRef = useRef(null);

  const [enabled, setEnabled] = useState(false);

  const [visible, setVisible] = useState(false);

  const [type, setType] = useState("default");

  const [label, setLabel] = useState("");

  /* =========================================================
     ENABLE ONLY WHEN A REAL MOUSE / TRACKPAD EXISTS
  ========================================================= */

  useEffect(() => {
    const media = window.matchMedia("(any-pointer: fine)");

    const update = () => {
      setEnabled(media.matches);
    };

    update();

    media.addEventListener?.("change", update);

    return () => {
      media.removeEventListener?.("change", update);
    };
  }, []);

  /* =========================================================
     CURSOR ENGINE
  ========================================================= */

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove("devnex-cursor-active");

      return;
    }

    const pointer = pointerRef.current;

    const ring = ringRef.current;

    const glow = glowRef.current;

    const ripple = rippleRef.current;

    if (!pointer || !ring || !glow || !ripple) {
      return;
    }

    document.documentElement.classList.add("devnex-cursor-active");

    /* =====================================================
       QUICK POSITION ANIMATION
    ===================================================== */

    const pointerX = gsap.quickTo(pointer, "x", {
      duration: 0.02,
      ease: "none",
    });

    const pointerY = gsap.quickTo(pointer, "y", {
      duration: 0.02,
      ease: "none",
    });

    const ringX = gsap.quickTo(ring, "x", {
      duration: 0.22,
      ease: "power3.out",
    });

    const ringY = gsap.quickTo(ring, "y", {
      duration: 0.22,
      ease: "power3.out",
    });

    const glowX = gsap.quickTo(glow, "x", {
      duration: 0.4,
      ease: "power3.out",
    });

    const glowY = gsap.quickTo(glow, "y", {
      duration: 0.4,
      ease: "power3.out",
    });

    /* =====================================================
       MOVE
    ===================================================== */

    const handleMove = (event) => {
      const x = event.clientX;

      const y = event.clientY;

      pointerX(x);
      pointerY(y);

      ringX(x);
      ringY(y);

      glowX(x);
      glowY(y);

      setVisible(true);
    };

    /* =====================================================
       TARGET DETECTION
    ===================================================== */

    const handleTarget = (event) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      /* ===============================================
         CUSTOM OVERRIDE

         Example:
         data-cursor="view"
         data-cursor-label="EXPLORE"
      =============================================== */

      const custom = target.closest("[data-cursor]");

      if (custom) {
        const customType = custom.getAttribute("data-cursor");

        const customLabel = custom.getAttribute("data-cursor-label");

        setType(customType || "default");

        setLabel(customLabel || "");

        return;
      }

      /* ===============================================
         DISABLED
      =============================================== */

      if (
        target.closest(
          `
            button:disabled,
            input:disabled,
            textarea:disabled,
            select:disabled,
            [aria-disabled="true"],
            .disabled
          `,
        )
      ) {
        setType("disabled");

        setLabel("NO");

        return;
      }

      /* ===============================================
         PROJECT CARD
      =============================================== */

      if (
        target.closest(
          `
            .hof-card,
            .hof-premium-card,
            .editorial-card,
            .video-project-card,
            .archive-project-card,
            .category-card,
            .project-card,
            .about-card,
            .strength-card,
            .proof-card,
            .flow-card
          `,
        )
      ) {
        setType("project");

        setLabel("VIEW");

        return;
      }

      /* ===============================================
         VIDEO
      =============================================== */

      if (target.closest("video")) {
        setType("video");

        setLabel("PLAY");

        return;
      }

      /* ===============================================
         IMAGE
      =============================================== */

      if (target.closest("img")) {
        setType("image");

        setLabel("ZOOM");

        return;
      }

      /* ===============================================
         DRAGGABLE
      =============================================== */

      if (
        target.closest(
          `
            [draggable="true"],
            .draggable,
            .drag-item
          `,
        )
      ) {
        setType("drag");

        setLabel("DRAG");

        return;
      }

      /* ===============================================
         BUTTON
      =============================================== */

      if (
        target.closest(
          `
            button,
            [role="button"]
          `,
        )
      ) {
        setType("button");

        setLabel("OPEN");

        return;
      }

      /* ===============================================
         LINK
      =============================================== */

      if (target.closest("a")) {
        setType("link");

        setLabel("GO");

        return;
      }

      /* ===============================================
         TEXT INPUT
      =============================================== */

      if (
        target.closest(
          `
            input[type="text"],
            input[type="email"],
            input[type="password"],
            input[type="search"],
            input[type="tel"],
            input[type="url"],
            input[type="number"],
            textarea,
            [contenteditable="true"]
          `,
        )
      ) {
        setType("text");

        setLabel("");

        return;
      }

      /* ===============================================
         DEFAULT
      =============================================== */

      setType("default");

      setLabel("");
    };

    /* =====================================================
       CLICK
    ===================================================== */

    const handleDown = (event) => {
      gsap.to(ring, {
        scale: 0.72,

        duration: 0.12,

        ease: "power2.out",
      });

      gsap.to(pointer, {
        scale: 0.88,

        duration: 0.1,

        ease: "power2.out",
      });

      gsap.killTweensOf(ripple);

      gsap.set(ripple, {
        x: event.clientX,

        y: event.clientY,

        scale: 0.3,

        opacity: 0.9,
      });

      gsap.to(ripple, {
        scale: 2.5,

        opacity: 0,

        duration: 0.55,

        ease: "power2.out",
      });
    };

    const handleUp = () => {
      gsap.to(ring, {
        scale: 1,

        duration: 0.4,

        ease: "elastic.out(1, 0.45)",
      });

      gsap.to(pointer, {
        scale: 1,

        duration: 0.25,

        ease: "power3.out",
      });
    };

    /* =====================================================
       SHOW / HIDE
    ===================================================== */

    const hide = () => {
      setVisible(false);
    };

    const show = () => {
      setVisible(true);
    };

    /* =====================================================
       EVENTS
    ===================================================== */

    window.addEventListener("pointermove", handleMove, {
      passive: true,
    });

    document.addEventListener("pointerover", handleTarget);

    window.addEventListener("pointerdown", handleDown);

    window.addEventListener("pointerup", handleUp);

    document.documentElement.addEventListener("mouseleave", hide);

    document.documentElement.addEventListener("mouseenter", show);

    window.addEventListener("blur", hide);

    return () => {
      document.documentElement.classList.remove("devnex-cursor-active");

      window.removeEventListener("pointermove", handleMove);

      document.removeEventListener("pointerover", handleTarget);

      window.removeEventListener("pointerdown", handleDown);

      window.removeEventListener("pointerup", handleUp);

      document.documentElement.removeEventListener("mouseleave", hide);

      document.documentElement.removeEventListener("mouseenter", show);

      window.removeEventListener("blur", hide);
    };
  }, [enabled]);

  /* =========================================================
     CURSOR SIZE
  ========================================================= */

  const getSize = () => {
    switch (type) {
      case "project":
        return 92;

      case "video":
        return 96;

      case "image":
        return 84;

      case "button":
        return 72;

      case "link":
        return 66;

      case "drag":
        return 80;

      case "disabled":
        return 62;

      case "text":
        return 30;

      default:
        return 46;
    }
  };

  const size = getSize();

  /* =========================================================
     COLOR
  ========================================================= */

  const getRingStyle = () => {
    if (type === "project") {
      return {
        border: "1px solid rgba(79,70,229,.95)",

        background: "rgba(79,70,229,.13)",

        boxShadow: "0 0 32px rgba(79,70,229,.25)",

        backdropFilter: "blur(8px)",
      };
    }

    if (type === "video") {
      return {
        border: "1px solid rgba(139,92,246,.95)",

        background: "rgba(139,92,246,.14)",

        boxShadow: "0 0 34px rgba(139,92,246,.28)",

        backdropFilter: "blur(8px)",
      };
    }

    if (type === "image") {
      return {
        border: "1px solid rgba(99,102,241,.85)",

        background: "rgba(255,255,255,.16)",

        boxShadow: "0 0 28px rgba(99,102,241,.2)",

        backdropFilter: "blur(7px)",
      };
    }

    if (type === "drag") {
      return {
        border: "1px dashed rgba(79,70,229,.95)",

        background: "rgba(79,70,229,.08)",

        boxShadow: "0 0 24px rgba(79,70,229,.2)",
      };
    }

    if (type === "disabled") {
      return {
        border: "1px solid rgba(239,68,68,.9)",

        background: "rgba(239,68,68,.08)",

        boxShadow: "0 0 22px rgba(239,68,68,.16)",
      };
    }

    if (type === "button" || type === "link") {
      return {
        border: "1px solid rgba(79,70,229,.8)",

        background: "rgba(79,70,229,.07)",

        boxShadow: "0 0 24px rgba(79,70,229,.17)",

        backdropFilter: "blur(6px)",
      };
    }

    return {
      border: "1px solid rgba(79,70,229,.48)",

      background: "rgba(255,255,255,.07)",

      boxShadow: "0 0 18px rgba(79,70,229,.12)",
    };
  };

  if (!enabled) {
    return null;
  }

  return (
    <>
      {/* =================================================
          FOLLOWING GLOW
      ================================================= */}

      <div
        ref={glowRef}
        className="devnex-cursor-layer"
        style={{
          position: "fixed",

          left: 0,
          top: 0,

          width: 70,
          height: 70,

          marginLeft: -35,

          marginTop: -35,

          borderRadius: "50%",

          pointerEvents: "none",

          zIndex: 2147483644,

          opacity: visible ? 1 : 0,

          background:
            "radial-gradient(circle, rgba(79,70,229,.15), rgba(99,102,241,.06) 40%, transparent 72%)",

          filter: "blur(7px)",

          transition: "opacity .2s ease",
        }}
      />

      {/* =================================================
          RING
      ================================================= */}

      <div
        ref={ringRef}
        className="devnex-cursor-layer"
        style={{
          position: "fixed",

          left: 0,
          top: 0,

          width: size,

          height: size,

          marginLeft: -(size / 2),

          marginTop: -(size / 2),

          borderRadius: "50%",

          pointerEvents: "none",

          zIndex: 2147483645,

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          opacity: visible ? 1 : 0,

          ...getRingStyle(),

          transition: `
            width .3s cubic-bezier(.2,.8,.2,1),
            height .3s cubic-bezier(.2,.8,.2,1),
            margin .3s cubic-bezier(.2,.8,.2,1),
            background .25s ease,
            border-color .25s ease,
            opacity .2s ease
          `,
        }}
      >
        {/* PROJECT / VIDEO ROTATING OUTER RING */}

        {(type === "project" || type === "video") && (
          <div
            style={{
              position: "absolute",

              inset: -7,

              borderRadius: "50%",

              border: "1px dashed rgba(99,102,241,.42)",

              animation: "devnexCursorSpin 7s linear infinite",
            }}
          />
        )}

        {/* DRAG ARROWS */}

        {type === "drag" && (
          <>
            <span
              style={{
                position: "absolute",

                left: 7,

                fontSize: 14,

                color: "#4f46e5",
              }}
            >
              ←
            </span>

            <span
              style={{
                position: "absolute",

                right: 7,

                fontSize: 14,

                color: "#4f46e5",
              }}
            >
              →
            </span>
          </>
        )}

        {/* LABEL */}

        {label && (
          <span
            style={{
              fontSize: 8,

              fontWeight: 900,

              letterSpacing: "0.16em",

              textTransform: "uppercase",

              whiteSpace: "nowrap",

              color: type === "disabled" ? "#ef4444" : "#4338ca",
            }}
          >
            {label}
          </span>
        )}
      </div>

      {/* =================================================
          POINTER SHAPE
      ================================================= */}

      <div
        ref={pointerRef}
        className="devnex-cursor-layer"
        style={{
          position: "fixed",

          left: 0,
          top: 0,

          pointerEvents: "none",

          zIndex: 2147483647,

          opacity: visible ? 1 : 0,

          filter: "drop-shadow(0 5px 8px rgba(79,70,229,.30))",

          transition: "opacity .15s ease",
        }}
      >
        {/* TEXT */}

        {type === "text" ? (
          <div
            style={{
              position: "relative",

              width: 16,

              height: 27,

              transform: "translate(-8px,-13px)",
            }}
          >
            <span
              style={{
                position: "absolute",

                left: 7,

                top: 0,

                width: 2,

                height: 27,

                background: "#4f46e5",

                borderRadius: 4,

                boxShadow: "0 0 12px rgba(79,70,229,.55)",
              }}
            />

            <span
              style={{
                position: "absolute",

                left: 3,

                top: 0,

                width: 10,

                height: 2,

                background: "#4f46e5",

                borderRadius: 4,
              }}
            />

            <span
              style={{
                position: "absolute",

                left: 3,

                bottom: 0,

                width: 10,

                height: 2,

                background: "#4f46e5",

                borderRadius: 4,
              }}
            />
          </div>
        ) : type === "disabled" ? (
          /* DISABLED */

          <div
            style={{
              width: 18,

              height: 18,

              transform: "translate(-9px,-9px)",

              border: "2px solid #ef4444",

              borderRadius: "50%",

              position: "relative",
            }}
          >
            <span
              style={{
                position: "absolute",

                left: 2,

                top: 7,

                width: 11,

                height: 2,

                transform: "rotate(-45deg)",

                background: "#ef4444",
              }}
            />
          </div>
        ) : (
          /* PREMIUM DEFAULT POINTER */

          <svg
            width="29"
            height="34"
            viewBox="0 0 29 34"
            fill="none"
            style={{
              display: "block",

              transform: "translate(-3px,-2px)",
            }}
          >
            <path
              d="M3 2.7L25.2 18.7L15.4 20.1L10.3 30.2L3 2.7Z"
              fill="url(#devnexCursorGradient)"
              stroke="white"
              strokeWidth="1.45"
              strokeLinejoin="round"
            />

            <path
              d="M5.5 6.2L19.7 16.9L13.1 17.8L9.3 25L5.5 6.2Z"
              fill="rgba(15,23,42,.7)"
            />

            <defs>
              <linearGradient
                id="devnexCursorGradient"
                x1="3"
                y1="3"
                x2="24"
                y2="29"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#111827" />

                <stop offset="0.45" stopColor="#4F46E5" />

                <stop offset="1" stopColor="#A855F7" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </div>

      {/* =================================================
          CLICK RIPPLE
      ================================================= */}

      <div
        ref={rippleRef}
        style={{
          position: "fixed",

          left: 0,
          top: 0,

          width: 32,
          height: 32,

          marginLeft: -16,

          marginTop: -16,

          borderRadius: "50%",

          border: "1.5px solid rgba(79,70,229,.9)",

          pointerEvents: "none",

          zIndex: 2147483643,

          opacity: 0,
        }}
      />

      {/* =================================================
          GLOBAL CSS
      ================================================= */}

      <style>{`
        @keyframes devnexCursorSpin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        .devnex-cursor-active,
        .devnex-cursor-active body,
        .devnex-cursor-active body *,
        .devnex-cursor-active a,
        .devnex-cursor-active button,
        .devnex-cursor-active input,
        .devnex-cursor-active textarea,
        .devnex-cursor-active select,
        .devnex-cursor-active [role="button"] {
          cursor: none !important;
        }

        .devnex-cursor-layer {
          transform-origin: center center;

          will-change: transform;
        }
      `}</style>
    </>
  );
}

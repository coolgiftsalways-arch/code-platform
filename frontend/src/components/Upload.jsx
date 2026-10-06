import { useEffect, useMemo, useRef, useState } from "react";

/* =========================================================
   API
========================================================= */

const API_URL = import.meta.env.VITE_API_URL || "";

/* =========================================================
   INLINE ICONS
   NO lucide-react REQUIRED
========================================================= */

function Icon({ name, className = "h-4 w-4" }) {
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
    user: (
      <>
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
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

    building: (
      <>
        <path d="M3 21h18" />
        <path d="M5 21V5l7-3 7 3v16" />
        <path d="M9 9h1" />
        <path d="M14 9h1" />
        <path d="M9 13h1" />
        <path d="M14 13h1" />
        <path d="M9 17h1" />
        <path d="M14 17h1" />
      </>
    ),

    code: (
      <>
        <path d="m8 9-4 3 4 3" />
        <path d="m16 9 4 3-4 3" />
        <path d="m14 5-4 14" />
      </>
    ),

    shield: (
      <>
        <path d="M12 3 20 6v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),

    check: <path d="m5 12 4 4L19 6" />,

    sparkles: (
      <>
        <path d="m12 3-1.2 3.8L7 8l3.8 1.2L12 13l1.2-3.8L17 8l-3.8-1.2L12 3Z" />
        <path d="m19 13-.7 2.3L16 16l2.3.7L19 19l.7-2.3L22 16l-2.3-.7L19 13Z" />
        <path d="m5 14-.6 2L2 17l2.4.7L5 20l.6-2.3L8 17l-2.4-.7L5 14Z" />
      </>
    ),

    message: (
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.2 9.2 0 0 1-4-.9L3 21l1.9-4A8.2 8.2 0 0 1 3 11.5 8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z" />
    ),

    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),

    location: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),

    alert: (
      <>
        <path d="M12 3 2.5 20h19L12 3Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </>
    ),

    arrowLeft: (
      <>
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </>
    ),

    arrowRight: (
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

    award: (
      <>
        <circle cx="12" cy="8" r="5" />
        <path d="M8.5 12 7 22l5-3 5 3-1.5-10" />
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
  };

  return <svg {...common}>{icons[name]}</svg>;
}

/* =========================================================
   DATA
========================================================= */

const cityStateMap = {
  Mumbai: "Maharashtra",
  Delhi: "Delhi",
  Bangalore: "Karnataka",
  Bengaluru: "Karnataka",
  Hyderabad: "Telangana",
  Ahmedabad: "Gujarat",
  Chennai: "Tamil Nadu",
  Kolkata: "West Bengal",
  Pune: "Maharashtra",
  Jaipur: "Rajasthan",
  Nagpur: "Maharashtra",
  Thane: "Maharashtra",
  Nashik: "Maharashtra",
  "Navi Mumbai": "Maharashtra",
  Kota: "Rajasthan",
  Noida: "Uttar Pradesh",
  Gurgaon: "Haryana",
};

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Chandigarh",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
];

const technologies = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React.js",
  "Next.js",
  "Angular",
  "Vue.js",
  "Tailwind CSS",
  "Bootstrap",
  "Node.js",
  "Express.js",
  "PHP",
  "Laravel",
  "Python",
  "Django",
  "Flask",
  "Java",
  "Spring Boot",
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "Firebase",
  "Supabase",
  "Flutter",
  "React Native",
  "Kotlin",
  "Swift",
  "TensorFlow",
  "PyTorch",
  "OpenAI API",
  "Gemini API",
  "Docker",
  "AWS",
  "Azure",
  "Figma",
  "Other",
];

const categories = [
  "Web & Full-Stack Development",
  "AI & Machine Learning",
  "Mobile Application Development",
  "SaaS & Utility Automation",
  "Data Science & Analytics",
  "Cybersecurity",
  "Cloud & DevOps",
  "UI/UX & Product Design",
];

const beforeApply = [
  {
    icon: "check",
    title: "₹999 entry fee per participant",
    text: "Each participant pays the ₹999 Season 01 entry fee.",
  },
  {
    icon: "github",
    title: "Public repository required",
    text: "Your GitHub repository must remain publicly accessible.",
  },
  {
    icon: "code",
    title: "Existing projects are allowed",
    text: "You may submit a project that you have already built.",
  },
  {
    icon: "shield",
    title: "Be ready to explain your work",
    text: "Shortlisted students may need to explain code and architecture.",
  },
];

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Upload() {
  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [techDropdownValue, setTechDropdownValue] = useState("");

  const formCardRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    mobile: "",
    email: "",
    city: "",
    state: "",

    instituteName: "",
    instituteCode: "",

    projectTitle: "",
    category: "",
    techStack: [],

    githubUrl: "",
    liveDemoUrl: "",
    aiTool: "",

    originalityConsent: false,
    technicalDefense: false,
    rulesConsent: false,
    privacyConsent: false,
    feeAcknowledgement: false,
    hiringOptIn: false,
  });

  const steps = useMemo(
    () => [
      {
        number: 1,
        title: "Student",
        icon: "user",
      },
      {
        number: 2,
        title: "Institute",
        icon: "building",
      },
      {
        number: 3,
        title: "Project",
        icon: "code",
      },
      {
        number: 4,
        title: "Verify",
        icon: "shield",
      },
    ],
    [],
  );

  /* =====================================================
     CHANGE
  ===================================================== */

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setErrorMessage("");

    setFormData((previous) => {
      const updated = {
        ...previous,

        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "city" && cityStateMap[value]) {
        updated.state = cityStateMap[value];
      }

      return updated;
    });
  };

  const allConsentsSelected =
    formData.originalityConsent &&
    formData.technicalDefense &&
    formData.rulesConsent &&
    formData.privacyConsent &&
    formData.feeAcknowledgement &&
    formData.hiringOptIn;

  const handleSelectAllConsents = (event) => {
    const checked = event.target.checked;

    setErrorMessage("");

    setFormData((previous) => ({
      ...previous,
      originalityConsent: checked,
      technicalDefense: checked,
      rulesConsent: checked,
      privacyConsent: checked,
      feeAcknowledgement: checked,
      hiringOptIn: checked,
    }));
  };

  /* =====================================================
     TECH STACK
  ===================================================== */

  const handleTechSelect = (event) => {
    const value = event.target.value;

    if (!value) return;

    const exists = formData.techStack.some(
      (item) => item.toLowerCase() === value.toLowerCase(),
    );

    if (!exists) {
      setFormData((previous) => ({
        ...previous,

        techStack: [...previous.techStack, value],
      }));
    }

    setTechDropdownValue("");
  };

  const removeTech = (tech) => {
    setFormData((previous) => ({
      ...previous,

      techStack: previous.techStack.filter((item) => item !== tech),
    }));
  };

  /* =====================================================
     SCROLL FORM
  ===================================================== */

  const scrollToForm = () => {
    requestAnimationFrame(() => {
      formCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  /* =====================================================
     VALIDATION
  ===================================================== */

  const fail = (message) => {
    setErrorMessage(message);

    scrollToForm();

    return false;
  };

  const validUrl = (value) => {
    try {
      const url = new URL(value);

      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const validateStep = () => {
    setErrorMessage("");

    if (step === 1) {
      if (
        !formData.firstName.trim() ||
        !formData.lastName.trim() ||
        !formData.age ||
        !formData.mobile.trim() ||
        !formData.email.trim() ||
        !formData.city.trim() ||
        !formData.state.trim()
      ) {
        return fail("Please complete all student information.");
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        return fail("Enter a valid email.");
      }
    }

    if (step === 2) {
      if (!formData.instituteName || !formData.instituteCode.trim()) {
        return fail("Please enter your institute details.");
      }
    }

    if (step === 3) {
      if (!formData.projectTitle.trim() || !formData.category) {
        return fail("Enter project title and category.");
      }

      if (formData.techStack.length === 0) {
        return fail("Select at least one technology.");
      }
    }

    if (step === 4) {
      if (
        !formData.githubUrl.trim() ||
        !validUrl(formData.githubUrl) ||
        !formData.githubUrl.toLowerCase().includes("github.com")
      ) {
        return fail("Enter a valid public GitHub repository URL.");
      }

      if (!formData.liveDemoUrl.trim() || !validUrl(formData.liveDemoUrl)) {
        return fail("Enter a valid live demo URL.");
      }

      if (!formData.aiTool) {
        return fail("Select AI tool usage.");
      }

      if (
        !formData.originalityConsent ||
        !formData.technicalDefense ||
        !formData.rulesConsent ||
        !formData.privacyConsent ||
        !formData.feeAcknowledgement
      ) {
        return fail("Please accept all required declarations.");
      }
    }

    return true;
  };

  /* =====================================================
     STEPS
  ===================================================== */

  const nextStep = () => {
    if (!validateStep()) return;

    if (step < 4) {
      setStep((current) => current + 1);

      scrollToForm();
    }
  };

  const previousStep = () => {
    if (step > 1) {
      setStep((current) => current - 1);

      scrollToForm();
    }
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateStep()) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/projects/submit`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(data.message || "Project submission failed.");
      }

      setSubmitted(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      setErrorMessage(error.message || "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/10";

  const progressPercent = ((step - 1) / (steps.length - 1)) * 100;

  /* =====================================================
     SUCCESS
  ===================================================== */

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[99999] flex min-h-screen items-center justify-center bg-slate-950/45 px-4 py-8 backdrop-blur-sm">
        <div className="w-full max-w-xl rounded-[30px] border border-slate-200 bg-white p-8 text-center shadow-2xl sm:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/25">
            <Icon name="check" className="h-9 w-9" />
          </div>

          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
            DEVNEX Submission
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
            Project submitted successfully!
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-600 sm:text-base">
            Thank you for participating in DEVNEX. We have received your project
            successfully. Our team will contact you within 24 hours.
          </p>

          <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700">
            Please keep your phone, WhatsApp and email available for our team.
          </div>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/";
            }}
            className="mt-7 w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fafafa] px-4 pb-20 pt-8">
      {/* BACKGROUND */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] opacity-30 [background-size:42px_42px]" />

        <div className="absolute -right-40 top-20 h-[460px] w-[460px] rounded-full bg-indigo-500/10 blur-[120px]" />

        <div className="absolute -left-40 bottom-20 h-[420px] w-[420px] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* =================================================
            HERO
        ================================================= */}

        <section className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-indigo-600">
            <Icon name="sparkles" className="h-3.5 w-3.5" />
            Season 01 Application
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Submit your project.{" "}
            <span className="text-indigo-600">Prove what you built.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Submit your student information, project, GitHub repository and live
            demo to DEVNEX.
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <Badge>₹999 Entry Fee</Badge>

            <Badge>Public GitHub</Badge>

            <Badge>Technical Verification</Badge>
          </div>
        </section>

        {/* =================================================
            BEFORE APPLY
        ================================================= */}

        <section className="mx-auto mt-10 max-w-5xl rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-sm">
          <div className="grid gap-7 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600">
                Before you apply
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-950">
                Know the submission basics.
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Make sure your project and repository are ready before
                submitting.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:col-span-8">
              {beforeApply.map((item) => (
                <BeforeApplyCard key={item.title} {...item} />
              ))}
            </div>
          </div>
        </section>

        {/* =================================================
            LIVE EVALUATION
        ================================================= */}

        <EvaluationSection />

        {/* =================================================
            FORM
        ================================================= */}

        <section className="mx-auto mt-12 max-w-3xl">
          <div
            ref={formCardRef}
            className="scroll-mt-28 rounded-[30px] border border-slate-200 bg-white/95 p-6 shadow-xl"
          >
            {/* PROGRESS */}

            <div className="mb-8">
              <div className="mb-4 flex justify-between text-[10px] font-black uppercase tracking-[0.14em]">
                <span className="text-indigo-600">
                  Step {step} of {steps.length}
                </span>

                <span className="text-slate-400">
                  {Math.round(progressPercent)}%
                </span>
              </div>

              <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                  style={{
                    width:
                      step === 1 ? "8%" : `${Math.max(progressPercent, 8)}%`,
                  }}
                />
              </div>

              <div className="flex items-center">
                {steps.map((item, index) => {
                  const active = step === item.number;

                  const completed = step > item.number;

                  return (
                    <div key={item.number} className="flex flex-1 items-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                            completed
                              ? "border-indigo-600 bg-indigo-600 text-white"
                              : active
                                ? "border-indigo-600 bg-indigo-50 text-indigo-600 ring-4 ring-indigo-600/10"
                                : "border-slate-200 bg-slate-50 text-slate-400"
                          }`}
                        >
                          <Icon
                            name={completed ? "check" : item.icon}
                            className="h-4 w-4"
                          />
                        </div>

                        <span
                          className={`mt-1.5 hidden text-[10px] font-bold sm:block ${
                            active || completed
                              ? "text-indigo-600"
                              : "text-slate-400"
                          }`}
                        >
                          {item.title}
                        </span>
                      </div>

                      {index < steps.length - 1 && (
                        <div
                          className={`mx-2 h-px flex-1 ${
                            completed ? "bg-indigo-600" : "bg-slate-200"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ERROR */}

            {errorMessage && (
              <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
                <Icon name="alert" className="mt-0.5 h-4 w-4" />

                <p className="text-xs font-semibold">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* STEP 1 */}

              {step === 1 && (
                <div className="space-y-4">
                  <StepHeading
                    eyebrow="Student information"
                    title="Student Profile"
                    text="Tell us who you are."
                  />

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="First Name *">
                      <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First name"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Last Name *">
                      <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last name"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Age *">
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="21"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Mobile / WhatsApp *">
                      <input
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="WhatsApp number"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <Field label="Email *">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </Field>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="City *">
                      <input
                        name="city"
                        list="devnex-cities"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Mumbai"
                        className={inputClass}
                      />

                      <datalist id="devnex-cities">
                        {Object.keys(cityStateMap).map((city) => (
                          <option key={city} value={city} />
                        ))}
                      </datalist>
                    </Field>

                    <Field label="State *">
                      <input
                        name="state"
                        list="devnex-states"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Maharashtra"
                        className={inputClass}
                      />

                      <datalist id="devnex-states">
                        {indianStates.map((state) => (
                          <option key={state} value={state} />
                        ))}
                      </datalist>
                    </Field>
                  </div>
                </div>
              )}

              {/* STEP 2 */}

              {step === 2 && (
                <div className="space-y-4">
                  <StepHeading
                    eyebrow="Institute information"
                    title="Institute Details"
                    text="Tell us where you study or learn."
                  />

                  <Field label="Institute Type *">
                    <select
                      name="instituteName"
                      value={formData.instituteName}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select type</option>

                      <option value="College / University">
                        College / University
                      </option>

                      <option value="Computer Institute">
                        Computer Institute
                      </option>

                      <option value="Self-Learning / Independent">
                        Self-Learning / Independent
                      </option>

                      <option value="Other">Other</option>
                    </select>
                  </Field>

                  <Field label="Institute / College Name *">
                    <input
                      name="instituteCode"
                      value={formData.instituteCode}
                      onChange={handleChange}
                      placeholder="College / institute name"
                      className={inputClass}
                    />
                  </Field>
                </div>
              )}

              {/* STEP 3 */}

              {step === 3 && (
                <div className="space-y-4">
                  <StepHeading
                    eyebrow="Project information"
                    title="Project Details"
                    text="Tell us what you built."
                  />

                  <Field label="Project Title *">
                    <input
                      name="projectTitle"
                      value={formData.projectTitle}
                      onChange={handleChange}
                      placeholder="Project name"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Category *">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select category</option>

                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Tech Stack *">
                    <select
                      value={techDropdownValue}
                      onChange={handleTechSelect}
                      className={inputClass}
                    >
                      <option value="">Add technology</option>

                      {technologies.map((technology) => (
                        <option key={technology} value={technology}>
                          {technology}
                        </option>
                      ))}
                    </select>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {formData.techStack.map((tech) => (
                        <button
                          key={tech}
                          type="button"
                          onClick={() => removeTech(tech)}
                          className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600"
                        >
                          {tech} ×
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
              )}

              {/* STEP 4 */}

              {step === 4 && (
                <div className="space-y-4">
                  <StepHeading
                    eyebrow="Repository & verification"
                    title="Final Verification"
                    text="Add your public project links."
                  />

                  <Field label="GitHub Public Repository *">
                    <input
                      type="url"
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleChange}
                      placeholder="https://github.com/username/project"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Live Demo URL *">
                    <input
                      type="url"
                      name="liveDemoUrl"
                      value={formData.liveDemoUrl}
                      onChange={handleChange}
                      placeholder="https://your-project.com"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="AI Tool Usage *">
                    <select
                      name="aiTool"
                      value={formData.aiTool}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="">Select option</option>

                      <option value="None">No AI tools</option>

                      <option value="ChatGPT">ChatGPT</option>

                      <option value="Gemini">Gemini</option>

                      <option value="Claude">Claude</option>

                      <option value="Cursor">Cursor</option>

                      <option value="GitHub Copilot">GitHub Copilot</option>

                      <option value="Multiple">Multiple AI Tools</option>

                      <option value="Other">Other</option>
                    </select>
                  </Field>

                  <label
                    className={`flex cursor-pointer gap-3 rounded-2xl border p-4 transition ${
                      allConsentsSelected
                        ? "border-indigo-300 bg-indigo-100"
                        : "border-indigo-200 bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={allConsentsSelected}
                      onChange={handleSelectAllConsents}
                      className="mt-1 accent-indigo-600"
                    />

                    <span>
                      <strong className="text-sm text-indigo-700">
                        Select All
                      </strong>

                      <span className="ml-2 rounded-full bg-indigo-600 px-2 py-0.5 text-[8px] font-bold uppercase text-white">
                        One Click
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-slate-500">
                        Select this to automatically accept all declarations
                        below.
                      </span>
                    </span>
                  </label>

                  <ConsentBox
                    name="originalityConsent"
                    checked={formData.originalityConsent}
                    onChange={handleChange}
                    title="Originality Declaration"
                    text="I confirm this work represents my own contribution."
                  />

                  <ConsentBox
                    name="technicalDefense"
                    checked={formData.technicalDefense}
                    onChange={handleChange}
                    title="Technical Verification"
                    text="I agree to explain the project if shortlisted."
                  />

                  <ConsentBox
                    name="rulesConsent"
                    checked={formData.rulesConsent}
                    onChange={handleChange}
                    title="Rules & Eligibility"
                    text="I agree to the DEVNEX submission rules."
                  />

                  <ConsentBox
                    name="privacyConsent"
                    checked={formData.privacyConsent}
                    onChange={handleChange}
                    title="Terms & Privacy"
                    text="I agree to DEVNEX processing this submission."
                  />

                  <ConsentBox
                    name="feeAcknowledgement"
                    checked={formData.feeAcknowledgement}
                    onChange={handleChange}
                    title="₹999 Entry Fee"
                    text="I understand the entry fee is ₹999 per participant."
                  />

                  <ConsentBox
                    name="hiringOptIn"
                    checked={formData.hiringOptIn}
                    onChange={handleChange}
                    title="Talent Discovery"
                    text="Allow my profile to be considered for opportunities."
                    optional
                  />
                </div>
              )}

              {/* BUTTONS */}

              <div className="mt-8 flex gap-3 border-t border-slate-100 pt-5">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={previousStep}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-bold"
                  >
                    <Icon name="arrowLeft" />
                    Back
                  </button>
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white"
                  >
                    Continue
                    <Icon name="arrowRight" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white disabled:opacity-50"
                  >
                    {loading ? "SUBMITTING..." : "Submit Project"}

                    {!loading && <Icon name="arrowRight" />}
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

/* =========================================================
   EVALUATION
========================================================= */

function EvaluationSection() {
  const ref = useRef(null);

  const [active, setActive] = useState(false);

  const [scores, setScores] = useState({
    purpose: 0,
    execution: 0,
    architecture: 0,
    originality: 0,
    experience: 0,
    documentation: 0,
    overall: 0,
    benchmark: 0,
  });

  const targets = {
    purpose: 86,
    execution: 91,
    architecture: 84,
    originality: 88,
    experience: 79,
    documentation: 82,
    overall: 84,
    benchmark: 12,
  };

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.25,
      },
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;

    const started = performance.now();

    let frame;

    const animate = (now) => {
      const progress = Math.min((now - started) / 1500, 1);

      const ease = 1 - Math.pow(1 - progress, 3);

      const next = {};

      Object.keys(targets).forEach((key) => {
        next[key] = Math.round(targets[key] * ease);
      });

      setScores(next);

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [active]);

  const metrics = [
    ["Problem & Purpose", "purpose"],
    ["Technical Execution", "execution"],
    ["Code & Architecture", "architecture"],
    ["Original Contribution", "originality"],
    ["Product Experience", "experience"],
    ["Documentation", "documentation"],
  ];

  return (
    <section ref={ref} className="mx-auto mt-10 max-w-6xl">
      <div className="mb-6 text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600">
          Evaluation Process
        </p>

        <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">
          How Projects Get <span className="text-indigo-600">Evaluated</span>
        </h2>
      </div>

      <div className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-white/90 p-4 shadow-xl sm:p-5">
        <div className="relative grid gap-4 lg:grid-cols-[1fr_1.08fr_1fr]">
          {/* LEFT */}

          <div className="space-y-3">
            <EvalCard
              active={active}
              icon="code"
              title="Technical & Soft Skills"
              text="Coding quality, system thinking and problem-solving."
            />

            <EvalCard
              active={active}
              icon="globe"
              title="Live Project Review"
              text="The real product is reviewed, not only screenshots."
            />

            <EvalCard
              active={active}
              icon="shield"
              title="Code Ownership Defense"
              text="Explain architecture, implementation and contribution."
            />

            <EvalCard
              active={active}
              icon="sparkles"
              title="AI Tool Disclosure"
              text="AI-assisted work is disclosed clearly and honestly."
            />
          </div>

          {/* CENTER */}

          <div className="rounded-[26px] border border-indigo-100 bg-white p-5 shadow-lg">
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-indigo-600">
              DEVNEX Review System
            </p>

            <h3 className="mt-1 text-2xl font-black text-slate-950">
              The Evaluation Layer
            </h3>

            <div className="my-4 h-px bg-slate-100" />

            <div className="space-y-3">
              {metrics.map(([label, key]) => (
                <div
                  key={key}
                  className="grid grid-cols-[minmax(0,1fr)_75px_32px] items-center gap-3"
                >
                  <span className="text-xs font-bold text-slate-700">
                    {label}
                  </span>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 transition-[width] duration-[1500ms]"
                      style={{
                        width: active ? `${targets[key]}%` : "0%",
                      }}
                    />
                  </div>

                  <strong className="text-right text-sm tabular-nums">
                    {scores[key]}
                  </strong>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between rounded-2xl bg-indigo-50 p-4">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-indigo-600">
                  Overall Score
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Multi-dimensional project evidence.
                </p>
              </div>

              <div
                className="flex h-20 w-20 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#4f46e5 ${
                    scores.overall * 3.6
                  }deg,#e2e8f0 0deg)`,
                }}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
                  <strong className="text-2xl">{scores.overall}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="space-y-3">
            <RightCard
              icon="award"
              title="Project Recognition"
              subtitle="Featured · Category · Hall of Fame"
            >
              {[86, 75, 64].map((width, index) => (
                <div key={index} className="mt-3 flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-[width] duration-[1500ms]"
                      style={{
                        width: active ? `${width}%` : "0%",
                      }}
                    />
                  </div>

                  <Icon name="check" className="h-4 w-4 text-emerald-500" />
                </div>
              ))}
            </RightCard>

            <RightCard
              icon="chart"
              title="Skill Benchmark"
              subtitle="Compare with similar projects"
            >
              <div className="mt-4 flex items-end gap-4">
                <div className="flex h-20 flex-1 items-end gap-2">
                  {[35, 52, 67, 95, 62, 48].map((height, index) => (
                    <div
                      key={index}
                      className={`flex-1 rounded-t-md transition-all duration-[1500ms] ${
                        index === 3 ? "bg-indigo-600" : "bg-indigo-200"
                      }`}
                      style={{
                        height: active ? `${height}%` : "3%",
                      }}
                    />
                  ))}
                </div>

                <div>
                  <strong className="text-xl">Top {scores.benchmark}%</strong>

                  <p className="text-[9px] uppercase text-slate-400">
                    Similar projects
                  </p>
                </div>
              </div>
            </RightCard>

            <RightCard
              icon="sparkles"
              title="Growth Feedback"
              subtitle="See what to improve next"
            >
              <div className="mt-4 grid grid-cols-3 gap-2">
                {["Architecture", "Documentation", "Product polish"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-xl bg-indigo-50 p-2 text-center text-[9px] font-bold text-indigo-700"
                    >
                      {item}
                    </div>
                  ),
                )}
              </div>
            </RightCard>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

function EvalCard({ active, icon, title, text }) {
  return (
    <article
      className={`rounded-[22px] border bg-white p-4 shadow-sm transition-all duration-700 ${
        active
          ? "translate-x-0 border-indigo-100 opacity-100"
          : "-translate-x-3 border-slate-200 opacity-40"
      }`}
    >
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon name={icon} />
        </div>

        <div>
          <h3 className="text-base font-black text-slate-950">{title}</h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
        </div>
      </div>
    </article>
  );
}

function RightCard({ icon, title, subtitle, children }) {
  return (
    <article className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon name={icon} />
        </div>

        <div>
          <h3 className="text-base font-black text-slate-950">{title}</h3>

          <p className="text-[8px] font-black uppercase tracking-[0.13em] text-slate-400">
            {subtitle}
          </p>
        </div>
      </div>

      {children}
    </article>
  );
}

function Badge({ children }) {
  return (
    <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.1em] text-slate-500">
      {children}
    </span>
  );
}

function BeforeApplyCard({ icon, title, text }) {
  return (
    <article className="rounded-2xl bg-slate-50 p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        <Icon name={icon} />
      </div>

      <h3 className="mt-3 text-sm font-black">{title}</h3>

      <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
    </article>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase text-slate-600">
        {label}
      </label>

      {children}
    </div>
  );
}

function StepHeading({ eyebrow, title, text }) {
  return (
    <div className="mb-5">
      <p className="text-[9px] font-black uppercase tracking-[0.18em] text-indigo-600">
        {eyebrow}
      </p>

      <h2 className="mt-1 text-xl font-black">{title}</h2>

      <p className="mt-1 text-xs text-slate-500">{text}</p>
    </div>
  );
}

function ConsentBox({
  name,
  checked,
  onChange,
  title,
  text,
  optional = false,
}) {
  return (
    <label
      className={`flex cursor-pointer gap-3 rounded-2xl border p-4 ${
        checked
          ? "border-indigo-200 bg-indigo-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="mt-1 accent-indigo-600"
      />

      <span>
        <strong className="text-sm">{title}</strong>

        <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-[8px] font-bold uppercase text-indigo-600">
          {optional ? "Optional" : "Required"}
        </span>

        <span className="mt-1 block text-xs leading-5 text-slate-500">
          {text}
        </span>
      </span>
    </label>
  );
}

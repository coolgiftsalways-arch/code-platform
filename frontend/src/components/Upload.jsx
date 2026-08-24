import { useEffect, useRef, useState } from "react";

const Icon = ({ name, className = "h-4 w-4" }) => {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const paths = {
    user: (
      <>
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
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
      <>
        <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.2 9.2 0 0 1-4-.9L3 21l1.9-4A8.2 8.2 0 0 1 3 11.5 8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z" />
      </>
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
    external: (
      <>
        <path d="M14 5h5v5" />
        <path d="M10 14 19 5" />
        <path d="M19 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4" />
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
  };

  return <svg {...common}>{paths[name]}</svg>;
};

// Dictionary to map major cities to their respective states for auto-filling
const cityStateMap = {
  Mumbai: "Maharashtra",
  Delhi: "Delhi",
  Bangalore: "Karnataka",
  Hyderabad: "Telangana",
  Ahmedabad: "Gujarat",
  Chennai: "Tamil Nadu",
  Kolkata: "West Bengal",
  Surat: "Gujarat",
  Pune: "Maharashtra",
  Jaipur: "Rajasthan",
  Lucknow: "Uttar Pradesh",
  Kanpur: "Uttar Pradesh",
  Nagpur: "Maharashtra",
  Indore: "Madhya Pradesh",
  Thane: "Maharashtra",
  Bhopal: "Madhya Pradesh",
  Visakhapatnam: "Andhra Pradesh",
  Patna: "Bihar",
  Vadodara: "Gujarat",
  Ludhiana: "Punjab",
  Agra: "Uttar Pradesh",
  Nashik: "Maharashtra",
  Faridabad: "Haryana",
  Meerut: "Uttar Pradesh",
  Rajkot: "Gujarat",
  Varanasi: "Uttar Pradesh",
  Srinagar: "Jammu and Kashmir",
  Aurangabad: "Maharashtra",
  Dhanbad: "Jharkhand",
  Amritsar: "Punjab",
  "Navi Mumbai": "Maharashtra",
  Allahabad: "Uttar Pradesh",
  Ranchi: "Jharkhand",
  Howrah: "West Bengal",
  Coimbatore: "Tamil Nadu",
  Jabalpur: "Madhya Pradesh",
  Gwalior: "Madhya Pradesh",
  Vijayawada: "Andhra Pradesh",
  Jodhpur: "Rajasthan",
  Madurai: "Tamil Nadu",
  Raipur: "Chhattisgarh",
  Kota: "Rajasthan",
  Guwahati: "Assam",
  Chandigarh: "Chandigarh",
  Thiruvananthapuram: "Kerala",
  Mysore: "Karnataka",
  Noida: "Uttar Pradesh",
  Gurgaon: "Haryana",
  Kochi: "Kerala",
  Bhubaneswar: "Odisha",
};

export default function Upload() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  const robotRef = useRef(null);

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
    technicalDefense: false,
    hiringOptIn: false,
  });

  const [techDropdownValue, setTechDropdownValue] = useState("");

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!robotRef.current) return;

      const rect = robotRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const distance = Math.min(
        2.5,
        Math.hypot(e.clientX - centerX, e.clientY - centerY) / 60,
      );

      setMousePosition({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => {
      const updatedData = {
        ...previous,
        [name]: type === "checkbox" ? checked : value,
      };

      // Auto-fill logic: if the field is 'city' and exists in our map, fill 'state' automatically
      if (name === "city" && cityStateMap[value]) {
        updatedData.state = cityStateMap[value];
      }

      return updatedData;
    });
  };

  const handleTechSelect = (e) => {
    const value = e.target.value;
    if (!value) return;

    const alreadyExists = formData.techStack.some(
      (tech) => tech.toLowerCase() === value.toLowerCase(),
    );

    if (!alreadyExists) {
      setFormData((previous) => ({
        ...previous,
        techStack: [...previous.techStack, value],
      }));
    }

    setTechDropdownValue("");
  };

  const removeTechStack = (techToRemove) => {
    setFormData((previous) => ({
      ...previous,
      techStack: previous.techStack.filter((tech) => tech !== techToRemove),
    }));
  };

  const validateStep = () => {
    if (step === 1) {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.age ||
        !formData.mobile ||
        !formData.email ||
        !formData.city ||
        !formData.state
      ) {
        alert("Please complete all required student profile fields.");
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        alert("Please enter a valid email address.");
        return false;
      }
      if (!/^[0-9+\-\s]{10,15}$/.test(formData.mobile)) {
        alert("Please enter a valid WhatsApp mobile number.");
        return false;
      }
    }

    if (step === 2) {
      if (!formData.instituteName || !formData.instituteCode) {
        alert("Please select your institute and enter the tracking code.");
        return false;
      }
    }

    if (step === 3) {
      if (!formData.projectTitle || !formData.category) {
        alert("Please enter your project title and select a category.");
        return false;
      }
      if (formData.techStack.length === 0) {
        alert("Please select at least one technology for your tech stack.");
        return false;
      }
    }

    if (step === 4) {
      if (!formData.githubUrl) {
        alert("GitHub Public Repo URL is required.");
        return false;
      }
      if (!formData.liveDemoUrl) {
        alert("Live Demo URL is required.");
        return false;
      }
      if (!formData.aiTool) {
        alert("Please select your AI tool usage.");
        return false;
      }
      if (!formData.technicalDefense) {
        alert("You must agree to the mandatory 5-minute technical defense.");
        return false;
      }
    }

    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    if (step < 4) {
      setStep((previous) => previous + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const previousStep = () => {
    if (step > 1) {
      setStep((previous) => previous - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/projects/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit project");
      }

      setSubmitted(true);
    } catch (error) {
      alert(`❌ ${error.message || "Unable to connect to server"}`);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: "Student", icon: "user" },
    { number: 2, title: "Institute", icon: "building" },
    { number: 3, title: "Project", icon: "code" },
    { number: 4, title: "Verify", icon: "shield" },
  ];

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-3 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-600/10";

  const labelClass =
    "mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600";

  if (submitted) {
    return (
      <div className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-[#fafafa] px-4 py-12">
        <div className="relative z-10 w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white">
              <Icon name="check" className="h-6 w-6" />
            </div>
          </div>
          <div className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-indigo-600">
            Application Received
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Project Submitted!
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
            Your project has been successfully submitted for evaluation. Our
            team will review your submission and contact you if you qualify for
            the next stage.
          </p>
          <button
            type="button"
            onClick={() => {
              window.location.href = "/";
            }}
            className="mt-7 w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
          >
            Back to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[85vh] overflow-hidden bg-[#fafafa] px-4 pb-12 pt-6">
      <div className="relative z-10 mx-auto w-full max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-indigo-600">
            <Icon name="sparkles" className="h-3.5 w-3.5" />
            Season 01
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Season 01 Open Application
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            No application fee required. Takes less than 3 minutes.
          </p>
        </div>

        <div className="relative z-30 mb-[-24px] flex flex-col items-center">
          <div className="relative mb-2 rounded-2xl border border-slate-200/80 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-sm">
            {step === 1 && "Hi. Let's get to know you."}
            {step === 2 && "Where do you study?"}
            {step === 3 && "Show us what you built."}
            {step === 4 && "Almost there. Let's verify it."}
            <div className="absolute bottom-[-6px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b border-r border-slate-200 bg-white" />
          </div>

          <div
            ref={robotRef}
            className="relative flex h-20 w-24 flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white shadow-md"
          >
            <div className="absolute left-[-6px] top-1/2 h-6 w-1.5 -translate-y-1/2 rounded-l-md bg-slate-800" />
            <div className="absolute right-[-6px] top-1/2 h-6 w-1.5 -translate-y-1/2 rounded-r-md bg-slate-800" />
            <div className="absolute -top-4 h-4 w-1 bg-slate-800" />
            <div className="absolute -top-5 h-2.5 w-2.5 rounded-full bg-indigo-600" />
            <div className="relative flex h-10 w-16 items-center justify-center gap-3 overflow-hidden rounded-xl bg-slate-900 shadow-inner">
              {[1, 2].map((eye) => (
                <div
                  key={eye}
                  className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white"
                >
                  <div
                    className="h-1.5 w-1.5 rounded-full bg-slate-900 transition-transform duration-75"
                    style={{
                      transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                    }}
                  />
                </div>
              ))}
              <div className="absolute bottom-1.5 h-1 w-2 rounded-full bg-white" />
            </div>
          </div>
        </div>

        <div className="relative z-10 rounded-3xl border border-slate-200/80 bg-white/95 p-5 pt-10 shadow-xl backdrop-blur-xl sm:p-7 sm:pt-10">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((item, index) => {
                const active = step === item.number;
                const completed = step > item.number;

                return (
                  <div key={item.number} className="flex flex-1 items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold transition-all ${
                          completed
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : active
                              ? "border-indigo-600 bg-indigo-50 text-indigo-600 ring-4 ring-indigo-600/10"
                              : "border-slate-200 bg-slate-50 text-slate-400"
                        }`}
                      >
                        {completed ? (
                          <Icon name="check" className="h-4 w-4" />
                        ) : (
                          <Icon name={item.icon} className="h-4 w-4" />
                        )}
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
                          step > item.number ? "bg-indigo-600" : "bg-slate-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-black text-slate-900">
                  Student Profile
                </h2>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>First Name *</label>
                    <div className="relative">
                      <Icon
                        name="user"
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Last Name *</label>
                    <div className="relative">
                      <Icon
                        name="user"
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Age *</label>
                    <input
                      type="number"
                      name="age"
                      min="10"
                      max="100"
                      placeholder="e.g. 21"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Mobile / WhatsApp *</label>
                    <div className="relative">
                      <Icon
                        name="message"
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="tel"
                        name="mobile"
                        placeholder="WhatsApp number"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <div className="relative">
                    <Icon
                      name="mail"
                      className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>City *</label>
                    <div className="relative">
                      <Icon
                        name="location"
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="text"
                        name="city"
                        list="indian-cities"
                        placeholder="Type or select city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className={`${inputClass} pl-10`}
                      />
                      <datalist id="indian-cities">
                        {Object.keys(cityStateMap).map((city) => (
                          <option key={city} value={city} />
                        ))}
                      </datalist>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>State *</label>
                    <div className="relative">
                      <Icon
                        name="location"
                        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="text"
                        name="state"
                        list="indian-states"
                        placeholder="Type or select state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className={`${inputClass} pl-10`}
                      />
                      <datalist id="indian-states">
                        <option value="Andhra Pradesh" />
                        <option value="Arunachal Pradesh" />
                        <option value="Assam" />
                        <option value="Bihar" />
                        <option value="Chhattisgarh" />
                        <option value="Goa" />
                        <option value="Gujarat" />
                        <option value="Haryana" />
                        <option value="Himachal Pradesh" />
                        <option value="Jharkhand" />
                        <option value="Karnataka" />
                        <option value="Kerala" />
                        <option value="Madhya Pradesh" />
                        <option value="Maharashtra" />
                        <option value="Manipur" />
                        <option value="Meghalaya" />
                        <option value="Mizoram" />
                        <option value="Nagaland" />
                        <option value="Odisha" />
                        <option value="Punjab" />
                        <option value="Rajasthan" />
                        <option value="Sikkim" />
                        <option value="Tamil Nadu" />
                        <option value="Telangana" />
                        <option value="Tripura" />
                        <option value="Uttar Pradesh" />
                        <option value="Uttarakhand" />
                        <option value="West Bengal" />
                        <option value="Andaman and Nicobar Islands" />
                        <option value="Chandigarh" />
                        <option value="Dadra and Nagar Haveli and Daman and Diu" />
                        <option value="Delhi" />
                        <option value="Jammu and Kashmir" />
                        <option value="Ladakh" />
                        <option value="Lakshadweep" />
                        <option value="Puducherry" />
                      </datalist>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-black text-slate-900">
                  Institute Details
                </h2>
                <div>
                  <label className={labelClass}>
                    Computer Class / College Name *
                  </label>
                  <select
                    name="instituteName"
                    value={formData.instituteName}
                    onChange={handleChange}
                    required
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="">Select your institute</option>
                    <option value="Computer Institute">
                      Computer Institute
                    </option>
                    <option value="College / University">
                      College / University
                    </option>
                    <option value="Other">Other / Not Listed</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>
                    Your Class Name / College Code Name *
                  </label>
                  <input
                    type="text"
                    name="instituteCode"
                    placeholder="e.g. INST-MUM01"
                    value={formData.instituteCode}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-xl font-black text-slate-900">
                  Project Metadata
                </h2>
                <div>
                  <label className={labelClass}>Project Title *</label>
                  <input
                    type="text"
                    name="projectTitle"
                    placeholder="e.g. Smart Campus Management System"
                    value={formData.projectTitle}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Competition Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="">Select competition category</option>
                    <option value="Web Dev">Web Dev</option>
                    <option value="Mobile Apps">Mobile Apps</option>
                    <option value="AI / ML">AI / ML</option>
                    <option value="SaaS">SaaS</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>
                    Tech Stack (Select Technologies) *
                  </label>
                  <select
                    value={techDropdownValue}
                    onChange={handleTechSelect}
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="">-- Select technology to add --</option>
                    <option value="React.js">React.js</option>
                    <option value="Node.js">Node.js</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Tailwind CSS">Tailwind CSS</option>
                    <option value="MongoDB">MongoDB</option>
                    <option value="PHP">PHP</option>
                    <option value="Python">Python</option>
                    <option value="Flutter">Flutter</option>
                  </select>
                  <div className="mt-3 flex min-h-[40px] flex-wrap gap-2">
                    {formData.techStack.length === 0 ? (
                      <span className="text-xs text-slate-400">
                        No tech selected yet. Choose from the dropdown above.
                      </span>
                    ) : (
                      formData.techStack.map((tech) => (
                        <button
                          type="button"
                          key={tech}
                          onClick={() => removeTechStack(tech)}
                          className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 transition hover:bg-red-50 hover:text-red-600"
                        >
                          {tech} ×
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-xl font-black text-slate-900">
                  Repository & AI Disclosure
                </h2>
                <div>
                  <label className={labelClass}>GitHub Public Repo URL *</label>
                  <input
                    type="url"
                    name="githubUrl"
                    placeholder="https://github.com/username/project"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Live Demo URL *</label>
                  <input
                    type="url"
                    name="liveDemoUrl"
                    placeholder="https://your-project.vercel.app"
                    value={formData.liveDemoUrl}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>AI Tool Usage *</label>
                  <select
                    name="aiTool"
                    value={formData.aiTool}
                    onChange={handleChange}
                    required
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="">Select AI tool usage</option>
                    <option value="Cursor">Cursor</option>
                    <option value="ChatGPT">ChatGPT</option>
                    <option value="Claude">Claude</option>
                    <option value="None">None</option>
                  </select>
                </div>
                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                  <input
                    type="checkbox"
                    name="technicalDefense"
                    checked={formData.technicalDefense}
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-indigo-600"
                  />
                  <span className="text-xs leading-5 text-slate-600">
                    <strong className="block text-sm text-slate-800">
                      Mandatory Technical Defense
                    </strong>
                    I agree to participate in a mandatory 5-minute virtual
                    technical defense if qualified.
                  </span>
                </label>
                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                  <input
                    type="checkbox"
                    name="hiringOptIn"
                    checked={formData.hiringOptIn}
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-indigo-600"
                  />
                  <span className="text-xs leading-5 text-slate-600">
                    <strong className="block text-sm text-slate-800">
                      Share Developer Portfolio
                    </strong>
                    Opt-in: Share my verified developer portfolio with hiring
                    partners.
                  </span>
                </label>
              </div>
            )}

            <div className="mt-8 flex gap-3 border-t border-slate-100 pt-5">
              {step > 1 && (
                <button
                  type="button"
                  onClick={previousStep}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  <Icon name="arrowLeft" className="h-4 w-4" />
                  Back
                </button>
              )}
              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
                >
                  Continue
                  <Icon name="arrowRight" className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:opacity-60"
                >
                  {loading
                    ? "SUBMITTING..."
                    : "Submit Project for Free Evaluation"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import Category from "../models/Category.js";

// The 8 DEVNEX tracks (from the original Categories page). Added to the
// database the first time the server starts with no categories. After that,
// edit them from the admin panel (Admin → Categories).
export const DEFAULT_CATEGORIES = [
  {
    name: "Web Dev",
    slug: "web-full-stack",
    title: "Web & Full-Stack Development",
    eyebrow: "WEB SYSTEMS",
    icon: "code",
    color: "indigo",
    stack: ["HTML", "CSS", "JavaScript", "React", "Next.js", "Node.js", "PHP", "MongoDB", "MySQL"],
    description:
      "Build complete digital experiences for the web — from responsive interfaces and e-commerce platforms to APIs, dashboards, portals, and production-style full-stack products.",
    examples: ["Full-stack applications", "E-commerce platforms", "Dashboards & portals", "REST / backend APIs"],
  },
  {
    name: "AI / ML",
    slug: "ai-machine-learning",
    title: "AI & Machine Learning",
    eyebrow: "INTELLIGENT SYSTEMS",
    icon: "brain",
    color: "violet",
    stack: ["Python", "TensorFlow", "PyTorch", "OpenAI", "NLP", "Computer Vision", "Scikit-learn"],
    description:
      "Create intelligent systems that predict, understand, generate, recommend, automate, or learn from data and real-world inputs.",
    examples: ["AI assistants", "Computer vision", "Recommendation systems", "Prediction engines"],
  },
  {
    name: "Mobile Apps",
    slug: "mobile-development",
    title: "Mobile Application Development",
    eyebrow: "MOBILE PRODUCTS",
    icon: "phone",
    color: "emerald",
    stack: ["Flutter", "React Native", "Kotlin", "Swift", "Firebase", "Android"],
    description:
      "Build Android, iOS, and cross-platform applications designed around real users, mobile workflows, and device-first experiences.",
    examples: ["Android applications", "Cross-platform apps", "Utility apps", "Mobile-first tools"],
  },
  {
    name: "SaaS",
    slug: "saas-automation",
    title: "SaaS & Utility Automation",
    eyebrow: "PRODUCT & AUTOMATION",
    icon: "layers",
    color: "amber",
    stack: ["React", "Node.js", "Stripe / Razorpay", "Webhooks", "Cron jobs", "APIs"],
    description:
      "Build software products and automations that save people time — subscription tools, internal utilities, workflow bots and business software.",
    examples: ["Subscription products", "Workflow automation", "Internal tools", "Bots & integrations"],
  },
  {
    name: "Data Science",
    slug: "data-science",
    title: "Data Science & Analytics",
    eyebrow: "DATA & INSIGHT",
    icon: "chart",
    color: "sky",
    stack: ["Python", "Pandas", "NumPy", "SQL", "Power BI", "Tableau", "Jupyter"],
    description:
      "Turn raw data into insight — analysis, dashboards, forecasting and visual stories that help people make better decisions.",
    examples: ["Analytics dashboards", "Forecasting models", "Data pipelines", "Visual reports"],
  },
  {
    name: "Cybersecurity",
    slug: "cybersecurity",
    title: "Cybersecurity",
    eyebrow: "SECURITY",
    icon: "shield",
    color: "slate",
    stack: ["Python", "Linux", "Networking", "OWASP", "Cryptography", "Burp Suite"],
    description:
      "Build tools and systems that protect people and data — scanners, secure apps, detection systems and security education.",
    examples: ["Vulnerability scanners", "Secure login systems", "Threat detection", "Security tooling"],
  },
  {
    name: "Cloud & DevOps",
    slug: "cloud-devops",
    title: "Cloud & DevOps",
    eyebrow: "INFRASTRUCTURE",
    icon: "cloud",
    color: "cyan",
    stack: ["Docker", "Kubernetes", "AWS", "GCP", "CI/CD", "Terraform", "Linux"],
    description:
      "Ship and scale software — deployment pipelines, infrastructure as code, monitoring and developer tooling.",
    examples: ["CI/CD pipelines", "Infrastructure as code", "Monitoring tools", "Developer platforms"],
  },
  {
    name: "UI/UX Design",
    slug: "ui-ux-design",
    title: "UI/UX & Product Design",
    eyebrow: "DESIGN",
    icon: "pen",
    color: "pink",
    stack: ["Figma", "Design systems", "Prototyping", "User research", "Accessibility"],
    description:
      "Design products people love to use — research, flows, interfaces and working prototypes that solve real problems.",
    examples: ["App & web designs", "Design systems", "Interactive prototypes", "UX case studies"],
  },
];

export default async function ensureCategories() {
  if (await Category.exists({})) return;

  await Category.insertMany(DEFAULT_CATEGORIES.map((c, index) => ({ ...c, order: index })));
  console.log(`📚 Added ${DEFAULT_CATEGORIES.length} default categories`);
}

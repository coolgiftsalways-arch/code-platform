import {
  BarChart3,
  Brain,
  Cloud,
  Code2,
  Cpu,
  Gamepad2,
  Globe,
  Layers,
  PenTool,
  Rocket,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

// Icon names an admin can pick for a category (must match the backend list).
export const CATEGORY_ICONS = {
  code: Code2,
  brain: Brain,
  phone: Smartphone,
  layers: Layers,
  chart: BarChart3,
  shield: ShieldCheck,
  cloud: Cloud,
  pen: PenTool,
  rocket: Rocket,
  cpu: Cpu,
  globe: Globe,
  gamepad: Gamepad2,
};

// Colour themes: gradient for tiles/thumbnails, soft background + text for chips.
export const CATEGORY_COLORS = {
  indigo: { gradient: "from-indigo-500 to-indigo-700", soft: "bg-indigo-50 text-indigo-700", ring: "ring-indigo-200" },
  violet: { gradient: "from-violet-500 to-fuchsia-600", soft: "bg-violet-50 text-violet-700", ring: "ring-violet-200" },
  emerald: { gradient: "from-emerald-500 to-teal-600", soft: "bg-emerald-50 text-emerald-700", ring: "ring-emerald-200" },
  amber: { gradient: "from-amber-500 to-orange-600", soft: "bg-amber-50 text-amber-800", ring: "ring-amber-200" },
  sky: { gradient: "from-sky-500 to-blue-600", soft: "bg-sky-50 text-sky-700", ring: "ring-sky-200" },
  slate: { gradient: "from-slate-700 to-slate-900", soft: "bg-slate-100 text-slate-700", ring: "ring-slate-200" },
  cyan: { gradient: "from-cyan-500 to-sky-600", soft: "bg-cyan-50 text-cyan-700", ring: "ring-cyan-200" },
  pink: { gradient: "from-pink-500 to-rose-600", soft: "bg-pink-50 text-pink-700", ring: "ring-pink-200" },
  rose: { gradient: "from-rose-500 to-red-600", soft: "bg-rose-50 text-rose-700", ring: "ring-rose-200" },
  orange: { gradient: "from-orange-500 to-amber-600", soft: "bg-orange-50 text-orange-700", ring: "ring-orange-200" },
};

export const categoryIcon = (name) => CATEGORY_ICONS[name] || Code2;
export const categoryColor = (name) => CATEGORY_COLORS[name] || CATEGORY_COLORS.indigo;

// Demo data — replace with Firestore / Gemini responses later.

export const NAV_ITEMS = [
  { icon: "◈", label: "Command Center", active: true },
  { icon: "◎", label: "Citizen Requests" },
  { icon: "⌖", label: "Priority Map" },
  { icon: "▣", label: "Projects" },
  { icon: "◌", label: "AI Insights" },
  { icon: "⚙", label: "Settings" },
];

export const METRICS = [
  { label: "Citizen requests", value: "12,486", note: "↑ 18.4% this month", tone: "green" },
  { label: "AI-identified hotspots", value: "38", note: "12 need urgent review", tone: "orange" },
  { label: "Requests resolved", value: "7,921", note: "63.4% resolution rate", tone: "green" },
  { label: "Data confidence", value: "91%", note: "Across active zones", tone: "blue" },
];

// position -> CSS class (.p1 ... .p6); level: "" = critical, "o" = high, "g" = normal
export const MAP_PINS = [
  { position: "p1", level: "" },
  { position: "p2", level: "o" },
  { position: "p3", level: "" },
  { position: "p4", level: "g" },
  { position: "p5", level: "o" },
  { position: "p6", level: "" },
];

export const MAP_LEGEND = [
  { label: "Critical", dot: "criticalDot" },
  { label: "High", dot: "highDot" },
  { label: "Normal", dot: "normalDot" },
];

export const PRIORITIES = [
  {
    title: "Drainage — Ward 14",
    score: 92,
    tone: "red",
    summary: "Repeated waterlogging reports detected after rainfall.",
    meta: "184 requests • 4,100 estimated residents affected",
  },
  {
    title: "Road repair — Ward 8",
    score: 86,
    tone: "orange",
    summary: "Multiple similar complaints clustered within 1.8 km.",
    meta: "129 requests • school + market access",
  },
  {
    title: "Streetlights — Ward 21",
    score: 74,
    tone: "blue",
    summary: "Low lighting reports concentrated along main route.",
    meta: "83 requests • 2.4 km affected corridor",
  },
];

export const CATEGORY_SHARE = [
  { name: "Roads", percent: 31 },
  { name: "Water & drainage", percent: 24 },
  { name: "Electricity", percent: 18 },
  { name: "Healthcare", percent: 14 },
];

export const CATEGORY_OPTIONS = [
  "Auto-detect category",
  "Road",
  "Water & drainage",
  "Electricity",
  "Healthcare",
];

// Fake AI output shown after "Analyze with AI". Swap for the Gemini response.
export const DEMO_ANALYSIS = {
  category: "Water & drainage",
  severity: "High",
  cluster: "Ward 14 / 23 similar reports",
  priority: 89,
};

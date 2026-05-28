export const REPORT_TYPES = [
  {
    value: "medical_emergency",
    label: "Medical Emergency",
    shortLabel: "Medical",
    description: "Injury, illness, ambulance needed",
    feedCategory: "safety",
    status: "ACTIVE",
    statusTone: "danger",
    footer: "AMBULANCE ASSIGNED",
    accent: "red",
  },
  {
    value: "fire_hazard",
    label: "Fire / Hazard",
    shortLabel: "Fire",
    description: "Fire, smoke, chemical, explosion",
    feedCategory: "safety",
    status: "ACTIVE",
    statusTone: "danger",
    footer: "RESPONSE: FIRE & RESCUE",
    accent: "orange",
  },
  {
    value: "crime_security",
    label: "Crime / Security",
    shortLabel: "Security",
    description: "Crime, violence, suspicious activity",
    feedCategory: "safety",
    status: "REPORTED",
    statusTone: "danger",
    footer: "RESPONSE: SECURITY TEAM",
    accent: "rose",
  },
  {
    value: "traffic_incident",
    label: "Traffic Incident",
    shortLabel: "Traffic",
    description: "Accident, stalled vehicle, road block",
    feedCategory: "utilities",
    status: "SLOW TRAFFIC",
    statusTone: "warning",
    footer: "TRIAGE: TRAFFIC MGMT",
    accent: "amber",
  },
  {
    value: "utilities",
    label: "Utilities Outage",
    shortLabel: "Utilities",
    description: "Power, water, telecom disruption",
    feedCategory: "utilities",
    status: "REPORTED",
    statusTone: "warning",
    footer: "TRIAGE: UTILITIES CREW",
    accent: "yellow",
  },
  {
    value: "disaster",
    label: "Natural Disaster",
    shortLabel: "Disaster",
    description: "Flood, landslide, earthquake impact",
    feedCategory: "safety",
    status: "ACTIVE",
    statusTone: "danger",
    footer: "DISASTER RESPONSE",
    accent: "violet",
  },
  {
    value: "other",
    label: "Other",
    shortLabel: "Other",
    description: "General incident not listed above",
    feedCategory: "recent",
    status: "LOGGED",
    statusTone: "info",
    footer: "COMMUNITY SIGNAL",
    accent: "cyan",
  },
];

const ACCENT_STYLES = {
  red: {
    badge: "border-red-400/40 bg-red-500/15 text-red-300",
    border: "border-red-500/35",
    glow: "shadow-[0_0_24px_rgba(248,113,113,0.15)]",
    dot: "bg-red-400",
    status: "text-red-400",
  },
  orange: {
    badge: "border-orange-400/40 bg-orange-500/15 text-orange-300",
    border: "border-orange-500/35",
    glow: "shadow-[0_0_24px_rgba(251,146,60,0.15)]",
    dot: "bg-orange-400",
    status: "text-orange-400",
  },
  rose: {
    badge: "border-rose-400/40 bg-rose-500/15 text-rose-300",
    border: "border-rose-500/35",
    glow: "shadow-[0_0_24px_rgba(251,113,133,0.15)]",
    dot: "bg-rose-400",
    status: "text-rose-400",
  },
  amber: {
    badge: "border-amber-400/40 bg-amber-500/15 text-amber-300",
    border: "border-amber-500/35",
    glow: "shadow-[0_0_24px_rgba(251,191,36,0.12)]",
    dot: "bg-amber-400",
    status: "text-amber-400",
  },
  yellow: {
    badge: "border-yellow-400/40 bg-yellow-500/15 text-yellow-200",
    border: "border-yellow-500/35",
    glow: "shadow-[0_0_24px_rgba(250,204,21,0.12)]",
    dot: "bg-yellow-400",
    status: "text-yellow-300",
  },
  violet: {
    badge: "border-violet-400/40 bg-violet-500/15 text-violet-300",
    border: "border-violet-500/35",
    glow: "shadow-[0_0_24px_rgba(167,139,250,0.15)]",
    dot: "bg-violet-400",
    status: "text-violet-400",
  },
  cyan: {
    badge: "border-cyan-400/40 bg-cyan-500/15 text-cyan-300",
    border: "border-cyan-500/35",
    glow: "shadow-[0_0_24px_rgba(34,211,238,0.15)]",
    dot: "bg-cyan-400",
    status: "text-cyan-400",
  },
};

export const DEFAULT_REPORT_TYPE = "other";

export const REPORT_TYPE_VALUES = REPORT_TYPES.map((t) => t.value);

export const getReportTypeMeta = (type) =>
  REPORT_TYPES.find((t) => t.value === type) ??
  REPORT_TYPES.find((t) => t.value === DEFAULT_REPORT_TYPE);

export const getReportTypeAccent = (type) => {
  const meta = getReportTypeMeta(type);
  return ACCENT_STYLES[meta.accent] ?? ACCENT_STYLES.cyan;
};

export const countReportsByCategory = (reports) => {
  const safety = reports.filter((r) => {
    const cat = getReportTypeMeta(r.report_type).feedCategory;
    return cat === "safety";
  }).length;
  const utilities = reports.filter((r) => {
    const cat = getReportTypeMeta(r.report_type).feedCategory;
    return cat === "utilities";
  }).length;
  return { safety, utilities, total: reports.length };
};

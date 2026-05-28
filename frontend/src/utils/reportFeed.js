const RULES = [
  {
    category: "safety",
    title: "Safety Alert",
    status: "ACTIVE",
    statusTone: "danger",
    footer: "RESPONSE: SAFETY TEAM",
    keywords: [
      "fire",
      "smoke",
      "crime",
      "fight",
      "weapon",
      "collapse",
      "explosion",
      "hazard",
    ],
  },
  {
    category: "utilities",
    title: "Utilities Issue",
    status: "REPORTED",
    statusTone: "warning",
    footer: "TRIAGE: UTILITIES CREW",
    keywords: [
      "power",
      "blackout",
      "water",
      "pipe",
      "leak",
      "electric",
      "outage",
      "flood",
    ],
  },
  {
    category: "safety",
    title: "Medical Emergency",
    status: "ACTIVE",
    statusTone: "danger",
    footer: "AMBULANCE ASSIGNED",
    keywords: [
      "medical",
      "injury",
      "ambulance",
      "hospital",
      "bleeding",
      "unconscious",
      "accident victim",
    ],
  },
  {
    category: "utilities",
    title: "Stalled Vehicle",
    status: "SLOW TRAFFIC",
    statusTone: "warning",
    footer: "TRIAGE: TRAFFIC MGMT",
    keywords: [
      "traffic",
      "vehicle",
      "stalled",
      "road",
      "blocked",
      "congestion",
      "car",
    ],
  },
];

const DEFAULT_META = {
  category: "recent",
  title: "Community Report",
  status: "ACTIVE",
  statusTone: "info",
  footer: "COMMUNITY SIGNAL",
};

export const enrichReportForFeed = (report) => {
  const text = (report.details ?? "").toLowerCase();
  const matched =
    RULES.find((rule) =>
      rule.keywords.some((keyword) => text.includes(keyword)),
    ) ?? DEFAULT_META;

  return {
    ...report,
    feedTitle: matched.title,
    feedStatus: matched.status,
    feedStatusTone: matched.statusTone,
    feedFooter: matched.footer,
    feedCategory: matched.category,
  };
};

export const matchesFeedFilter = (report, filter) => {
  if (filter === "recent" || filter === "near") return true;
  return report.feedCategory === filter;
};

import { DEFAULT_REPORT_TYPE, getReportTypeMeta } from "../../constants/reportTypes";
import { reportTypeIconMarkup } from "../../constants/reportTypeIcons";

const PIN_GRADIENTS = {
  medical_emergency: ["#fca5a5", "#ef4444", "#991b1b"],
  fire_hazard: ["#fdba74", "#f97316", "#c2410c"],
  crime_security: ["#fda4af", "#f43f5e", "#be123c"],
  traffic_incident: ["#fcd34d", "#f59e0b", "#b45309"],
  utilities: ["#fde047", "#eab308", "#a16207"],
  disaster: ["#c4b5fd", "#8b5cf6", "#6d28d9"],
  other: ["#67e8f9", "#22d3ee", "#2563eb"],
};

const PIN_SHAPES = {
  medical_emergency: "hex",
  fire_hazard: "triangle",
  crime_security: "shield",
  traffic_incident: "square",
  utilities: "diamond",
  disaster: "circle",
  other: "hex",
};

const shapeSvg = (shape, gradId) => {
  const fill = `url(#${gradId})`;
  const stroke = "rgba(255,255,255,0.88)";

  switch (shape) {
    case "triangle":
      return `<polygon points="16,4 28,26 4,26" fill="${fill}" stroke="${stroke}" stroke-width="0.85"/>`;
    case "shield":
      return `<path d="M16 4l10 4v7c0 6.5-4.5 10.5-10 12-5.5-1.5-10-5.5-10-12V8l10-4z" fill="${fill}" stroke="${stroke}" stroke-width="0.85"/>`;
    case "square":
      return `<rect x="6" y="6" width="20" height="20" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="0.85"/>`;
    case "diamond":
      return `<polygon points="16,4 28,16 16,28 4,16" fill="${fill}" stroke="${stroke}" stroke-width="0.85"/>`;
    case "circle":
      return `<circle cx="16" cy="16" r="12" fill="${fill}" stroke="${stroke}" stroke-width="0.85"/>`;
    case "hex":
    default:
      return `<polygon points="16,3 27.5,9.5 27.5,22.5 16,29 4.5,22.5 4.5,9.5" fill="${fill}" stroke="${stroke}" stroke-width="0.85"/>`;
  }
};

export const getPinTheme = (reportType) => {
  const type = reportType ?? DEFAULT_REPORT_TYPE;
  const meta = getReportTypeMeta(type);
  return {
    type,
    pinClass: `report-pin report-pin--${type}`,
    label: meta.shortLabel,
    colors: PIN_GRADIENTS[type] ?? PIN_GRADIENTS.other,
    shape: PIN_SHAPES[type] ?? PIN_SHAPES.other,
  };
};

export const buildReportPinHtml = (report, isActive) => {
  const theme = getPinTheme(report.report_type);
  const safeId = String(report.id).replace(/[^a-z0-9]/gi, "").slice(0, 12);
  const gradId = `pin-g-${safeId}`;
  const activeClass = isActive ? " report-pin--active" : "";
  const iconHtml = reportTypeIconMarkup(theme.type);

  const gradientDef = `
    <defs>
      <linearGradient id="${gradId}" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
        <stop stop-color="${theme.colors[0]}"/>
        <stop offset="0.5" stop-color="${theme.colors[1]}"/>
        <stop offset="1" stop-color="${theme.colors[2]}"/>
      </linearGradient>
    </defs>
  `;

  return `
    <div class="${theme.pinClass}${activeClass}" role="button" tabindex="0" aria-label="${theme.label} report">
      <span class="report-pin__pulse" aria-hidden="true"></span>
      <span class="report-pin__pulse report-pin__pulse--delayed" aria-hidden="true"></span>
      <span class="report-pin__ring" aria-hidden="true"></span>
      <span class="report-pin__core" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="26" height="26" fill="none" xmlns="http://www.w3.org/2000/svg">
          ${gradientDef}
          ${shapeSvg(theme.shape, gradId)}
        </svg>
        <span class="report-pin__icon">${iconHtml}</span>
      </span>
      <span class="report-pin__tag">${theme.label}</span>
    </div>
  `;
};

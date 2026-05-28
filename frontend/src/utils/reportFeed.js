import { DEFAULT_REPORT_TYPE, getReportTypeMeta } from "../constants/reportTypes";

export const enrichReportForFeed = (report) => {
  const meta = getReportTypeMeta(report.report_type ?? DEFAULT_REPORT_TYPE);

  return {
    ...report,
    feedTitle: meta.label,
    feedStatus: meta.status,
    feedStatusTone: meta.statusTone,
    feedFooter: meta.footer,
    feedCategory: meta.feedCategory,
  };
};

export const matchesFeedFilter = (report, filter) => {
  if (filter === "recent" || filter === "near") return true;
  return report.feedCategory === filter;
};

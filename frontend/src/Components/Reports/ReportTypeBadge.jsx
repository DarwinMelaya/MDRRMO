import { getReportTypeAccent, getReportTypeMeta } from "../../constants/reportTypes";
import { ReportTypeIcon } from "../../constants/reportTypeIcons";

const ReportTypeBadge = ({ reportType, compact = false }) => {
  const meta = getReportTypeMeta(reportType);
  const accent = getReportTypeAccent(reportType);

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border font-semibold uppercase tracking-wide",
        accent.badge,
        compact ? "px-2 py-0.5 text-[9px]" : "px-2.5 py-1 text-[10px]",
      ].join(" ")}
    >
      <ReportTypeIcon
        type={reportType}
        className={compact ? "h-3 w-3" : "h-3.5 w-3.5"}
      />
      {compact ? meta.shortLabel : meta.label}
    </span>
  );
};

export default ReportTypeBadge;

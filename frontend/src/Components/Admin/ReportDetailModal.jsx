import { format } from "date-fns";

const ReportDetailModal = ({ report, onClose }) => {
  if (!report) return null;

  const reporterName =
    report.hide_identity || !report.profiles?.name
      ? "Anonymous"
      : report.profiles.name;

  const submittedAt = report.created_at
    ? format(new Date(report.created_at), "PPpp")
    : "—";

  const mapsUrl = `https://www.google.com/maps?q=${report.latitude},${report.longitude}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-detail-title"
      onClick={onClose}
    >
      <div
        className="max-h-[min(90vh,720px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-cyan-300/25 bg-slate-900 shadow-[0_0_40px_rgba(34,211,238,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-start justify-between gap-3 border-b border-cyan-900/50 bg-slate-900/95 px-5 py-4 backdrop-blur">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200/80">
              Community Report
            </p>
            <h2
              id="report-detail-title"
              className="mt-1 text-base font-semibold text-white"
            >
              Report Details
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">{submittedAt}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-700 text-slate-300 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white"
            aria-label="Close report"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          {report.evidence_url ? (
            <div className="overflow-hidden rounded-xl border border-slate-700/80">
              <img
                src={report.evidence_url}
                alt="Report evidence"
                className="max-h-64 w-full object-cover"
              />
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800/40 px-4 py-8 text-center text-xs text-slate-500">
              No photo evidence attached
            </div>
          )}

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-200/70">
              Description
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
              {report.details}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-700/80 bg-slate-800/40 px-3 py-3">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">
                Reporter
              </p>
              <p className="mt-1 text-sm font-medium text-white">{reporterName}</p>
              {report.hide_identity ? (
                <p className="mt-0.5 text-[10px] text-amber-300/90">
                  Identity hidden
                </p>
              ) : null}
            </div>
            <div className="rounded-xl border border-slate-700/80 bg-slate-800/40 px-3 py-3">
              <p className="text-[10px] uppercase tracking-wide text-slate-500">
                Location
              </p>
              <p className="mt-1 font-mono text-xs text-cyan-200/90">
                {Number(report.latitude).toFixed(6)},{" "}
                {Number(report.longitude).toFixed(6)}
              </p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs font-semibold text-cyan-400 hover:text-cyan-300"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-cyan-900/50 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-cyan-400 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;

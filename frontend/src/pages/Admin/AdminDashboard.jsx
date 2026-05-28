import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fetchCommunityReports } from "../../Api/Reports";
import ReportDetailModal from "../../Components/Admin/ReportDetailModal";
import ReportWarningModal from "../../Components/Modals/Admin/ReportWarningModal";
import CommunityReportsMap from "../../Components/Map/CommunityReportsMap";
import ReportTypeBadge from "../../Components/Reports/ReportTypeBadge";
import {
  countReportsByCategory,
  getReportTypeAccent,
  getReportTypeMeta,
} from "../../constants/reportTypes";
import { ReportTypeIcon } from "../../constants/reportTypeIcons";
import {
  HiArrowPath,
  HiMap,
  HiSignal,
  HiPhoto,
} from "react-icons/hi2";

const TYPE_FILTERS = [
  { id: "all", label: "All" },
  { id: "safety", label: "Safety" },
  { id: "utilities", label: "Utilities" },
];

const getReportsSnapshot = (items) =>
  items
    .map(
      (report) =>
        [
          report.id,
          report.created_at,
          report.updated_at,
          report.report_type,
          report.details,
          report.status,
          report.evidence_url,
          report.latitude,
          report.longitude,
        ].join("|"),
    )
    .join("||");

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [showReportWarning, setShowReportWarning] = useState(false);
  const [newReportsCount, setNewReportsCount] = useState(0);
  const hasLoadedReportsRef = useRef(false);
  const knownReportIdsRef = useRef(new Set());
  const lastReportsSnapshotRef = useRef("");

  const loadReports = useCallback(async () => {
    const { data, error: fetchError } = await fetchCommunityReports();
    if (fetchError) {
      setError(fetchError.message || "Could not load community reports.");
      setReports([]);
      return;
    }

    const safeData = Array.isArray(data) ? data : [];
    const sortedData = [...safeData].sort((a, b) => {
      const timeA = a?.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b?.created_at ? new Date(b.created_at).getTime() : 0;
      if (timeA !== timeB) return timeB - timeA;
      return String(b?.id ?? "").localeCompare(String(a?.id ?? ""));
    });
    const currentIds = new Set(sortedData.map((report) => report.id));

    if (hasLoadedReportsRef.current) {
      let incomingCount = 0;
      for (const id of currentIds) {
        if (!knownReportIdsRef.current.has(id)) incomingCount += 1;
      }

      if (incomingCount > 0) {
        setNewReportsCount((prev) => prev + incomingCount);
        setShowReportWarning(true);
      }
    } else {
      hasLoadedReportsRef.current = true;
    }

    knownReportIdsRef.current = currentIds;

    setError("");
    const nextSnapshot = getReportsSnapshot(sortedData);
    if (nextSnapshot === lastReportsSnapshotRef.current) return;

    lastReportsSnapshotRef.current = nextSnapshot;
    setReports(sortedData);
    setViewingReport((current) => {
      if (!current) return current;
      const updated = sortedData.find((report) => report.id === current.id);
      return updated || current;
    });
  }, []);

  useEffect(() => {
    let active = true;

    const run = async () => {
      setLoading(true);
      await loadReports();
      if (active) setLoading(false);
    };

    run();
    const interval = setInterval(loadReports, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [loadReports]);

  const filteredReports = useMemo(() => {
    if (typeFilter === "all") return reports;
    return reports.filter((r) => {
      const cat = getReportTypeMeta(r.report_type).feedCategory;
      return cat === typeFilter;
    });
  }, [reports, typeFilter]);

  const stats = useMemo(() => {
    const counts = countReportsByCategory(reports);
    const withEvidence = reports.filter((r) => r.evidence_url).length;
    const priority = reports.filter((r) => {
      const tone = getReportTypeMeta(r.report_type).statusTone;
      return tone === "danger";
    }).length;
    return { ...counts, withEvidence, priority };
  }, [reports]);

  const handleViewReport = (report) => {
    setSelectedId(report.id);
    setViewingReport(report);
  };

  const handleCloseReport = () => {
    setViewingReport(null);
  };

  const handleCloseWarning = () => {
    setShowReportWarning(false);
    setNewReportsCount(0);
  };

  return (
    <section className="fixed inset-0 z-30 overflow-hidden bg-slate-950 text-slate-100 lg:left-72">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-slate-900/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200 backdrop-blur">
            <HiMap className="h-3.5 w-3.5" aria-hidden />
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
            </span>
            Live Situation Map
          </div>
          <h1 className="text-sm font-medium text-white/90 sm:text-base">
            MDRRMO Command View
          </h1>
          <p className="text-[11px] text-cyan-200/70">
            {loading
              ? "Syncing incident data…"
              : `${stats.total} active signal${stats.total === 1 ? "" : "s"} · ${stats.priority} priority`}
          </p>
        </div>
        <div className="pointer-events-auto rounded-xl border border-cyan-300/20 bg-slate-900/80 px-3 py-2 text-right backdrop-blur">
          <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200/85">
            Status
          </p>
          <p className="flex items-center justify-end gap-1 text-xs font-medium text-emerald-300">
            <HiSignal className="h-3.5 w-3.5" aria-hidden />
            Online
          </p>
          <button
            type="button"
            onClick={loadReports}
            disabled={loading}
            className="mt-1 inline-flex items-center justify-end gap-1 text-[10px] font-semibold text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
          >
            <HiArrowPath
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
              aria-hidden
            />
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      <div className="pointer-events-auto absolute inset-0 z-[5]">
        <CommunityReportsMap
          reports={filteredReports}
          selectedId={selectedId}
          onViewReport={handleViewReport}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_15%_15%,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.1),transparent_40%),linear-gradient(to_bottom,rgba(2,6,23,0.15),rgba(2,6,23,0.55))]" />

      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(rgba(34,211,238,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.04)_1px,transparent_1px)] bg-[size:42px_42px]" />

      {error ? (
        <div className="pointer-events-auto absolute left-1/2 top-20 z-30 max-w-md -translate-x-1/2 rounded-xl border border-red-500/40 bg-slate-900/95 px-4 py-2 text-center text-xs text-red-300 backdrop-blur">
          {error}
        </div>
      ) : null}

      <div className="pointer-events-none absolute bottom-4 left-4 z-20 w-[min(340px,calc(100%-2rem))] rounded-xl border border-cyan-300/20 bg-slate-900/90 p-3 backdrop-blur">
        <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-cyan-200/80">
          Incident Overview
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-2 py-2 text-center">
            <p className="text-lg font-bold text-cyan-200">{stats.total}</p>
            <p className="text-[9px] uppercase tracking-wide text-slate-400">
              Total
            </p>
          </div>
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-2 py-2 text-center">
            <p className="text-lg font-bold text-red-300">{stats.priority}</p>
            <p className="text-[9px] uppercase tracking-wide text-slate-400">
              Priority
            </p>
          </div>
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-2 py-2 text-center">
            <p className="text-lg font-bold text-amber-300">{stats.safety}</p>
            <p className="text-[9px] uppercase tracking-wide text-slate-400">
              Safety
            </p>
          </div>
          <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 px-2 py-2 text-center">
            <p className="text-lg font-bold text-yellow-200">
              {stats.utilities}
            </p>
            <p className="text-[9px] uppercase tracking-wide text-slate-400">
              Utilities
            </p>
          </div>
        </div>
      </div>

      <div className="pointer-events-auto absolute bottom-4 right-4 z-20 flex max-h-[min(360px,50vh)] w-[min(380px,calc(100%-2rem))] flex-col overflow-hidden rounded-xl border border-cyan-300/20 bg-slate-900/95 shadow-[0_0_40px_rgba(0,0,0,0.45)] backdrop-blur">
        <div className="border-b border-cyan-900/50 px-3 py-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200/85">
              Incident Feed
            </p>
            <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
              {filteredReports.length}
            </span>
          </div>
          <div className="mt-2 flex gap-1">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setTypeFilter(f.id)}
                className={[
                  "rounded-full px-2.5 py-1 text-[10px] font-semibold transition",
                  typeFilter === f.id
                    ? "bg-cyan-400 text-slate-950"
                    : "bg-slate-800 text-slate-400 hover:text-white",
                ].join(" ")}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <ul className="flex-1 overflow-y-auto p-2 [-ms-overflow-style:none] [scrollbar-width:thin]">
          {loading && reports.length === 0 ? (
            <li className="space-y-2 p-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-xl bg-slate-800/60"
                />
              ))}
            </li>
          ) : null}

          {!loading && filteredReports.length === 0 ? (
            <li className="px-3 py-8 text-center text-xs text-slate-500">
              No reports in this category.
            </li>
          ) : null}

          {filteredReports.map((report) => {
            const meta = getReportTypeMeta(report.report_type);
            const accent = getReportTypeAccent(report.report_type);
            const isSelected = selectedId === report.id;

            return (
              <li key={report.id} className="mb-2">
                <button
                  type="button"
                  onClick={() => handleViewReport(report)}
                  className={[
                    "flex w-full gap-3 rounded-xl border p-2.5 text-left transition",
                    isSelected
                      ? "border-cyan-400/50 bg-cyan-400/10 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                      : ["border-slate-800/80 bg-slate-800/30 hover:bg-slate-800/60", accent.border],
                  ].join(" ")}
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg ring-1 ring-slate-700/60">
                    {report.evidence_url ? (
                      <img
                        src={report.evidence_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-slate-900 text-slate-600">
                        <HiPhoto className="h-4 w-4" aria-hidden />
                        <span className="text-[9px]">No img</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <ReportTypeIcon
                        type={report.report_type}
                        className={`h-4 w-4 shrink-0 ${accent.status}`}
                      />
                      <ReportTypeBadge reportType={report.report_type} compact />
                    </div>
                    <p className="line-clamp-1 text-xs font-semibold text-white">
                      {meta.label}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-[10px] text-slate-400">
                      {report.details}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-bold ${accent.status}`}>
                        {meta.status}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {report.created_at
                          ? formatDistanceToNow(new Date(report.created_at), {
                              addSuffix: true,
                            })
                          : ""}
                      </span>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {viewingReport ? (
        <ReportDetailModal report={viewingReport} onClose={handleCloseReport} />
      ) : null}

      <ReportWarningModal
        isOpen={showReportWarning}
        newCount={newReportsCount}
        onClose={handleCloseWarning}
      />
    </section>
  );
};

export default AdminDashboard;

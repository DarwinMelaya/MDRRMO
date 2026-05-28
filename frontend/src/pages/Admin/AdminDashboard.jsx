import { useCallback, useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fetchCommunityReports } from "../../Api/Reports";
import ReportDetailModal from "../../Components/Admin/ReportDetailModal";
import CommunityReportsMap from "../../Components/Map/CommunityReportsMap";

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);

  const loadReports = useCallback(async () => {
    const { data, error: fetchError } = await fetchCommunityReports();
    if (fetchError) {
      setError(fetchError.message || "Could not load community reports.");
      setReports([]);
      return;
    }
    setError("");
    setReports(data);
  }, []);

  useEffect(() => {
    let active = true;

    const run = async () => {
      setLoading(true);
      await loadReports();
      if (active) setLoading(false);
    };

    run();
    const interval = setInterval(loadReports, 60000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [loadReports]);

  const stats = useMemo(() => {
    const total = reports.length;
    const withEvidence = reports.filter((r) => r.evidence_url).length;
    const anonymous = reports.filter((r) => r.hide_identity).length;
    return { total, withEvidence, anonymous };
  }, [reports]);

  const handleViewReport = (report) => {
    setSelectedId(report.id);
    setViewingReport(report);
  };

  const handleCloseReport = () => {
    setViewingReport(null);
  };

  return (
    <section className="fixed inset-0 z-30 overflow-hidden bg-slate-950 text-slate-100 lg:left-72">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="space-y-2">
          <div className="inline-flex items-center rounded-full border border-cyan-300/25 bg-slate-900/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200 backdrop-blur">
            Live Situation Map
          </div>
          <h1 className="text-sm font-medium text-white/90 sm:text-base">
            MDRRMO Command View
          </h1>
          <p className="text-[11px] text-cyan-200/70">
            {loading
              ? "Loading community reports…"
              : `${stats.total} report${stats.total === 1 ? "" : "s"} on map · tap marker to view`}
          </p>
        </div>
        <div className="pointer-events-auto rounded-xl border border-cyan-300/20 bg-slate-900/80 px-3 py-2 text-right backdrop-blur">
          <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200/85">
            Monitoring
          </p>
          <p className="text-xs font-medium text-white/85">Community Reports</p>
          <button
            type="button"
            onClick={loadReports}
            disabled={loading}
            className="mt-1 text-[10px] font-semibold text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="pointer-events-auto absolute inset-0 z-[5]">
        <CommunityReportsMap
          reports={reports}
          selectedId={selectedId}
          onViewReport={handleViewReport}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_15%_15%,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.1),transparent_40%),linear-gradient(to_bottom,rgba(2,6,23,0.15),rgba(2,6,23,0.55))]" />

      <div className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(rgba(34,211,238,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.04)_1px,transparent_1px)] bg-[size:42px_42px]" />

      {error ? (
        <div className="pointer-events-auto absolute left-1/2 top-20 z-30 max-w-md -translate-x-1/2 rounded-xl border border-red-500/40 bg-slate-900/95 px-4 py-2 text-center text-xs text-red-300 backdrop-blur">
          {error}
          <p className="mt-1 text-[10px] text-slate-400">
            Run community_reports.sql grants if the table is missing.
          </p>
        </div>
      ) : null}

      <div className="pointer-events-none absolute bottom-4 left-4 z-20 w-[min(320px,calc(100%-2rem))] rounded-xl border border-cyan-300/20 bg-slate-900/80 p-3 backdrop-blur">
        <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-cyan-200/80">
          Community Reports
        </p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-cyan-400/10 px-2 py-2">
            <p className="text-lg font-semibold text-cyan-200">{stats.total}</p>
            <p className="text-[10px] uppercase tracking-wide text-white/70">
              Total
            </p>
          </div>
          <div className="rounded-lg bg-amber-400/10 px-2 py-2">
            <p className="text-lg font-semibold text-amber-200">
              {stats.withEvidence}
            </p>
            <p className="text-[10px] uppercase tracking-wide text-white/70">
              With Photo
            </p>
          </div>
          <div className="rounded-lg bg-emerald-400/10 px-2 py-2">
            <p className="text-lg font-semibold text-emerald-200">
              {stats.anonymous}
            </p>
            <p className="text-[10px] uppercase tracking-wide text-white/70">
              Anonymous
            </p>
          </div>
        </div>
      </div>

      <div className="pointer-events-auto absolute bottom-4 right-4 z-20 flex max-h-[min(280px,40vh)] w-[min(340px,calc(100%-2rem))] flex-col overflow-hidden rounded-xl border border-cyan-300/20 bg-slate-900/90 backdrop-blur">
        <div className="border-b border-cyan-900/50 px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200/85">
            Recent Reports
          </p>
        </div>
        <ul className="flex-1 overflow-y-auto p-2">
          {loading && reports.length === 0 ? (
            <li className="px-2 py-3 text-center text-xs text-slate-500">
              Loading…
            </li>
          ) : null}
          {!loading && reports.length === 0 ? (
            <li className="px-2 py-3 text-center text-xs text-slate-500">
              No community reports yet.
            </li>
          ) : null}
          {reports.map((report) => (
            <li key={report.id}>
              <button
                type="button"
                onClick={() => handleViewReport(report)}
                className={[
                  "mb-1 w-full rounded-lg border px-3 py-2 text-left transition",
                  selectedId === report.id
                    ? "border-cyan-400/50 bg-cyan-400/10"
                    : "border-transparent bg-slate-800/40 hover:border-cyan-900/50 hover:bg-slate-800/70",
                ].join(" ")}
              >
                <p className="line-clamp-2 text-xs text-slate-200">
                  {report.details}
                </p>
                <p className="mt-1 text-[10px] text-slate-500">
                  {report.created_at
                    ? formatDistanceToNow(new Date(report.created_at), {
                        addSuffix: true,
                      })
                    : ""}
                  {" · "}
                  {report.latitude?.toFixed(4)}, {report.longitude?.toFixed(4)}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {viewingReport ? (
        <ReportDetailModal report={viewingReport} onClose={handleCloseReport} />
      ) : null}
    </section>
  );
};

export default AdminDashboard;

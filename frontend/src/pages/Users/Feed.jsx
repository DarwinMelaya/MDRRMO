import { useCallback, useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { deleteCommunityReport, fetchCommunityReports } from "../../Api/Reports";
import { getSession } from "../../Api/Profiles";
import DeleteReportModal from "../../Components/Modals/Community/DeleteReportModal";
import ReportTypeBadge from "../../Components/Reports/ReportTypeBadge";
import { getReportTypeAccent } from "../../constants/reportTypes";
import { haversineDistanceMeters, formatDistanceLabel } from "../../utils/geo";
import {
  enrichReportForFeed,
  matchesFeedFilter,
} from "../../utils/reportFeed";
import { requestDeviceLocation } from "../../utils/geolocation";
import { ReportTypeIcon } from "../../constants/reportTypeIcons";
import {
  HiBolt,
  HiClock,
  HiMapPin,
  HiPhoto,
  HiPlus,
  HiRss,
  HiShieldCheck,
  HiTrash,
  HiEyeSlash,
} from "react-icons/hi2";

const FILTERS = [
  { id: "recent", label: "Recent", Icon: HiClock },
  { id: "near", label: "Near Me", Icon: HiMapPin },
  { id: "mine", label: "My Reports", Icon: HiShieldCheck },
  { id: "safety", label: "Safety", Icon: HiShieldCheck },
  { id: "utilities", label: "Utilities", Icon: HiBolt },
];

const RADIUS_OPTIONS = [
  { id: 500, label: "500m" },
  { id: 1000, label: "1km" },
];

const ImagePlaceholder = () => (
  <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 ring-1 ring-slate-700/60">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.06)_1px,transparent_1px)] bg-[size:20px_20px]" />
    <HiPhoto className="relative h-10 w-10 text-slate-600" aria-hidden />
  </div>
);

const FeedReportCard = ({ report, showDistance, canDelete, onDelete, deleting }) => {
  const accent = getReportTypeAccent(report.report_type);

  return (
    <article
      className={[
        "group w-[min(300px,82vw)] shrink-0 snap-start overflow-hidden rounded-2xl border bg-[#0a0f1a]/95 backdrop-blur-sm transition hover:-translate-y-0.5",
        accent.border,
        accent.glow,
      ].join(" ")}
    >
      <div className="relative p-4 pb-3">
        <div className="mb-3 flex items-start justify-between gap-2">
          <ReportTypeBadge reportType={report.report_type} />
          <span className="text-[10px] text-slate-500">
            {report.created_at
              ? formatDistanceToNow(new Date(report.created_at), {
                  addSuffix: true,
                })
              : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ReportTypeIcon
            type={report.report_type}
            className="h-5 w-5 shrink-0 text-white/90"
          />
          <h3 className="text-base font-bold leading-snug text-white">
            {report.feedTitle}
          </h3>
        </div>
        <p className={`mt-1 text-[11px] font-bold tracking-wide ${accent.status}`}>
          {showDistance && report.distanceM != null
            ? `${formatDistanceLabel(report.distanceM)} • `
            : ""}
          {report.feedStatus}
        </p>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-400">
          {report.details}
        </p>
      </div>

      <div className="relative px-4">
        {report.evidence_url ? (
          <div className="relative overflow-hidden rounded-xl ring-1 ring-slate-700/50">
            <img
              src={report.evidence_url}
              alt=""
              className="h-40 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0f1a]/80 via-transparent to-transparent" />
          </div>
        ) : (
          <ImagePlaceholder />
        )}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-slate-800/80 px-4 py-3 mt-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          {report.feedFooter}
        </p>
        <div className="flex items-center gap-2">
          {report.hide_identity ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2 py-0.5 text-[9px] font-medium text-slate-400">
              <HiEyeSlash className="h-3 w-3" aria-hidden />
              Anonymous
            </span>
          ) : null}
          {canDelete ? (
            <button
              type="button"
              onClick={() => onDelete(report)}
              disabled={deleting}
              className="inline-flex items-center gap-1 rounded-md border border-red-500/40 bg-red-950/30 px-2 py-0.5 text-[10px] font-semibold text-red-300 hover:bg-red-950/45 disabled:opacity-60"
            >
              <HiTrash className="h-3 w-3" aria-hidden />
              {deleting ? "Deleting" : "Delete"}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
};

const Feed = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("recent");
  const [radiusM, setRadiusM] = useState(500);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [deletingReportId, setDeletingReportId] = useState(null);
  const [reportPendingDelete, setReportPendingDelete] = useState(null);
  const [session] = useState(() => getSession());
  const sessionUserId = session?.id ?? null;

  const loadFeed = useCallback(async () => {
    setError("");
    const { data, error: fetchError } = await fetchCommunityReports();
    if (fetchError) {
      setError(fetchError.message || "Could not load feed.");
      setReports([]);
      return;
    }
    setReports(data.map(enrichReportForFeed));
  }, []);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      await loadFeed();
      setLoading(false);
    };
    run();
  }, [loadFeed]);

  useEffect(() => {
    if (activeFilter !== "near") return;

    requestDeviceLocation()
      .then(setUserLocation)
      .catch((err) => {
        setUserLocation(null);
        setLocationError(err.message);
      });
  }, [activeFilter, radiusM]);

  const preparedReports = useMemo(() => {
    let list =
      activeFilter === "mine"
        ? reports.filter((r) => r.reporter_id && r.reporter_id === sessionUserId)
        : reports.filter((r) => matchesFeedFilter(r, activeFilter));

    if (activeFilter === "near" && userLocation) {
      list = list
        .map((report) => ({
          ...report,
          distanceM: haversineDistanceMeters(
            userLocation.latitude,
            userLocation.longitude,
            report.latitude,
            report.longitude,
          ),
        }))
        .filter((r) => r.distanceM <= radiusM)
        .sort((a, b) => a.distanceM - b.distanceM);
    } else if (activeFilter === "near" && !userLocation) {
      list = [];
    } else {
      list = [...list].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      );
    }

    return list;
  }, [reports, activeFilter, userLocation, radiusM, sessionUserId]);

  const feedStats = useMemo(() => {
    const visible = preparedReports;
    const emergency = visible.filter((r) => r.feedStatusTone === "danger").length;
    return { count: visible.length, emergency };
  }, [preparedReports]);

  const sectionTitle =
    activeFilter === "near"
      ? "REPORTS NEAR ME"
      : activeFilter === "mine"
        ? "MY REPORTS"
        : "COMMUNITY FEED";
  const sectionSubtitle =
    activeFilter === "near"
      ? "Real-time local intelligence"
      : activeFilter === "mine"
        ? "Incidents submitted by your account"
      : "Live incident updates from the community";

  const requestDeleteReport = (report) => {
    if (!sessionUserId || report.reporter_id !== sessionUserId) {
      setError("You can only delete reports created by your account.");
      return;
    }
    setReportPendingDelete(report);
  };

  const handleDeleteReport = async () => {
    if (!reportPendingDelete) return;

    setError("");
    setDeletingReportId(reportPendingDelete.id);
    const { error: deleteError } = await deleteCommunityReport({
      reportId: reportPendingDelete.id,
      reporterId: sessionUserId,
      evidenceUrl: reportPendingDelete.evidence_url,
    });
    setDeletingReportId(null);

    if (deleteError) {
      setError(deleteError.message || "Could not delete report.");
      return;
    }

    setReports((prev) => prev.filter((item) => item.id !== reportPendingDelete.id));
    setReportPendingDelete(null);
  };

  return (
    <section className="mx-auto w-full max-w-5xl space-y-5 pb-4">
      <div className="rounded-2xl border border-cyan-900/40 bg-gradient-to-r from-slate-900/90 to-[#0a1628]/90 p-4 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <HiRss className="h-3.5 w-3.5 text-cyan-400" aria-hidden />
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              <HiRss className="h-3.5 w-3.5 text-cyan-400" aria-hidden />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300/90">
                Live Feed
              </span>
            </div>
            <h1 className="mt-2 text-xl font-bold tracking-[0.08em] text-white">
              {sectionTitle}
            </h1>
            <p className="mt-1 text-xs text-slate-400">{sectionSubtitle}</p>
          </div>
          <Link
            to="/reports"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-cyan-400 px-4 py-2 text-xs font-bold text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition hover:bg-cyan-300"
          >
            <HiPlus className="h-4 w-4" aria-hidden />
            Report
          </Link>
        </div>

        {!loading ? (
          <div className="mt-4 flex gap-2">
            <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5">
              <span className="text-lg font-bold text-cyan-200">
                {feedStats.count}
              </span>
              <span className="ml-1.5 text-[10px] uppercase text-slate-400">
                Showing
              </span>
            </div>
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5">
              <span className="text-lg font-bold text-red-300">
                {feedStats.emergency}
              </span>
              <span className="ml-1.5 text-[10px] uppercase text-slate-400">
                Priority
              </span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => {
              setActiveFilter(filter.id);
              setLocationError("");
            }}
            className={[
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-5 py-2 text-sm font-semibold transition",
              activeFilter === filter.id
                ? "bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.35)]"
                : "border border-slate-700/80 bg-slate-900/60 text-slate-300 hover:border-slate-600 hover:text-white",
            ].join(" ")}
          >
            <filter.Icon className="h-4 w-4" aria-hidden />
            {filter.label}
          </button>
        ))}
      </div>

      {activeFilter === "near" ? (
        <div className="flex justify-end">
          <div className="flex rounded-full border border-slate-700/80 bg-slate-900/80 p-0.5">
            {RADIUS_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setRadiusM(opt.id)}
                className={[
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                  radiusM === opt.id
                    ? "bg-cyan-400 text-slate-950"
                    : "text-slate-400 hover:text-white",
                ].join(" ")}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-500/40 bg-red-950/30 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      {activeFilter === "near" && locationError ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 px-4 py-3 text-sm text-amber-200">
          {locationError}
        </div>
      ) : null}

      {loading ? (
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-72 w-[min(300px,82vw)] shrink-0 animate-pulse rounded-2xl border border-slate-800 bg-slate-900/60"
            />
          ))}
        </div>
      ) : null}

      {!loading && preparedReports.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-cyan-900/50 bg-slate-900/40 px-6 py-14 text-center">
          <p className="text-sm font-semibold text-slate-200">No reports found</p>
          <p className="mt-2 text-xs text-slate-500">
            {activeFilter === "near"
              ? `No incidents within ${radiusM === 500 ? "500m" : "1km"} of your location.`
              : "Be the first to submit an incident report."}
          </p>
          <Link
            to="/reports"
            className="mt-4 inline-block rounded-xl border border-cyan-500/40 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/10"
          >
            Submit a report
          </Link>
        </div>
      ) : null}

      {!loading && preparedReports.length > 0 ? (
        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-3 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {preparedReports.map((report) => (
            <FeedReportCard
              key={report.id}
              report={report}
              showDistance={activeFilter === "near"}
              canDelete={Boolean(sessionUserId && report.reporter_id === sessionUserId)}
              onDelete={requestDeleteReport}
              deleting={deletingReportId === report.id}
            />
          ))}
        </div>
      ) : null}
      <DeleteReportModal
        isOpen={Boolean(reportPendingDelete)}
        report={reportPendingDelete}
        isDeleting={Boolean(
          reportPendingDelete && deletingReportId === reportPendingDelete.id,
        )}
        onCancel={() => {
          if (deletingReportId) return;
          setReportPendingDelete(null);
        }}
        onConfirm={handleDeleteReport}
      />
    </section>
  );
};

export default Feed;

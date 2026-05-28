import { useCallback, useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fetchCommunityReports } from "../../Api/Reports";
import { haversineDistanceMeters, formatDistanceLabel } from "../../utils/geo";
import {
  enrichReportForFeed,
  matchesFeedFilter,
} from "../../utils/reportFeed";
import { requestDeviceLocation } from "../../utils/geolocation";

const FILTERS = [
  { id: "recent", label: "Recent" },
  { id: "near", label: "Near Me" },
  { id: "safety", label: "Safety" },
  { id: "utilities", label: "Utilities" },
];

const RADIUS_OPTIONS = [
  { id: 500, label: "500m" },
  { id: 1000, label: "1km" },
];

const statusToneClass = {
  danger: "text-red-400",
  warning: "text-amber-400",
  info: "text-cyan-400",
};

const WarningIcon = () => (
  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-amber-400 ring-1 ring-amber-400/30">
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M12 3 2 21h20L12 3zm0 6.5a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0v-4a1 1 0 0 1 1-1zm0 9.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z" />
    </svg>
  </span>
);

const ImagePlaceholder = () => (
  <div className="flex h-36 w-full items-center justify-center rounded-xl bg-slate-800/80 ring-1 ring-slate-700/60">
    <svg
      viewBox="0 0 24 24"
      className="h-10 w-10 text-slate-600"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="10" r="1.5" fill="currentColor" stroke="none" />
      <path strokeLinecap="round" d="M3 16l5-5 4 4 3-3 6 6" />
    </svg>
  </div>
);

const FeedReportCard = ({ report, showDistance }) => (
  <article className="w-[min(280px,78vw)] shrink-0 snap-start overflow-hidden rounded-2xl border border-slate-700/60 bg-[#0c1220]/95 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
    <div className="p-4 pb-3">
      <div className="flex items-start gap-2">
        {report.feedStatusTone === "warning" ? <WarningIcon /> : null}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-white">
            {report.feedTitle}
          </h3>
          <p
            className={`mt-0.5 text-[11px] font-semibold tracking-wide ${statusToneClass[report.feedStatusTone] ?? statusToneClass.info}`}
          >
            {showDistance && report.distanceM != null
              ? `${formatDistanceLabel(report.distanceM)} • `
              : ""}
            {report.feedStatus}
          </p>
        </div>
      </div>
    </div>

    <div className="px-4">
      {report.evidence_url ? (
        <img
          src={report.evidence_url}
          alt=""
          className="h-36 w-full rounded-xl object-cover ring-1 ring-slate-700/50"
        />
      ) : (
        <ImagePlaceholder />
      )}
    </div>

    <div className="flex items-center justify-between gap-2 px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {report.feedFooter}
      </p>
      <p className="text-[10px] text-slate-600">
        {report.created_at
          ? formatDistanceToNow(new Date(report.created_at), { addSuffix: true })
          : ""}
      </p>
    </div>
  </article>
);

const Feed = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("recent");
  const [radiusM, setRadiusM] = useState(500);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");

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
    let list = reports.filter((r) => matchesFeedFilter(r, activeFilter));

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
  }, [reports, activeFilter, userLocation, radiusM]);

  const sectionTitle =
    activeFilter === "near" ? "REPORTS NEAR ME" : "COMMUNITY FEED";
  const sectionSubtitle =
    activeFilter === "near"
      ? "Real-time local intelligence"
      : "Live updates from your area";

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
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
              "shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition",
              activeFilter === filter.id
                ? "bg-cyan-400 text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.35)]"
                : "border border-slate-700/80 bg-slate-900/60 text-slate-300 hover:border-slate-600 hover:text-white",
            ].join(" ")}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-[0.1em] text-white">
            {sectionTitle}
          </h1>
          <p className="mt-1 text-xs text-slate-500">{sectionSubtitle}</p>
        </div>

        {activeFilter === "near" ? (
          <div className="flex shrink-0 rounded-full border border-slate-700/80 bg-slate-900/80 p-0.5">
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
        ) : null}
      </div>

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
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-64 w-[min(280px,78vw)] shrink-0 animate-pulse rounded-2xl bg-slate-800/50"
            />
          ))}
        </div>
      ) : null}

      {!loading && preparedReports.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700/80 bg-slate-900/40 px-6 py-12 text-center">
          <p className="text-sm font-medium text-slate-300">No reports yet</p>
          <p className="mt-1 text-xs text-slate-500">
            {activeFilter === "near"
              ? `No incidents within ${radiusM === 500 ? "500m" : "1km"} of you.`
              : "Community reports will appear here when submitted."}
          </p>
        </div>
      ) : null}

      {!loading && preparedReports.length > 0 ? (
        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {preparedReports.map((report) => (
            <FeedReportCard
              key={report.id}
              report={report}
              showDistance={activeFilter === "near"}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default Feed;

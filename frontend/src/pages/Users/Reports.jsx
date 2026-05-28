import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitCommunityReport } from "../../Api/Reports";
import { getSession } from "../../Api/Profiles";
import {
  parseManualCoordinates,
  requestDeviceLocation,
} from "../../utils/geolocation";
import {
  compressImageFile,
  formatFileSize,
} from "../../utils/compressImage";

const BackIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
  </svg>
);

const CameraIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5 text-cyan-400"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"
    />
    <circle cx="12" cy="13" r="3.25" />
  </svg>
);

const LocationIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-4 w-4 shrink-0 text-cyan-400"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z"
    />
    <circle cx="12" cy="11" r="2.25" />
  </svg>
);

const MIN_DETAILS_LENGTH = 5;

const Reports = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [details, setDetails] = useState("");
  const [hideIdentity, setHideIdentity] = useState(false);
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [evidencePreview, setEvidencePreview] = useState(null);
  const [compressingEvidence, setCompressingEvidence] = useState(false);
  const [evidenceSizeLabel, setEvidenceSizeLabel] = useState("");

  const [location, setLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle");
  const [locationError, setLocationError] = useState("");
  const [manualLat, setManualLat] = useState("");
  const [manualLng, setManualLng] = useState("");
  const [useManualLocation, setUseManualLocation] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const refreshGpsLocation = async () => {
    setLocationStatus("loading");
    setLocationError("");
    setUseManualLocation(false);

    try {
      const coords = await requestDeviceLocation();
      setLocation(coords);
      setLocationStatus("ready");
      setManualLat(String(coords.latitude));
      setManualLng(String(coords.longitude));
    } catch (err) {
      setLocation(null);
      setLocationStatus("error");
      setLocationError(err.message);
    }
  };

  useEffect(() => {
    refreshGpsLocation();
  }, []);

  useEffect(() => {
    if (!evidenceFile) {
      setEvidencePreview(null);
      return undefined;
    }

    const url = URL.createObjectURL(evidenceFile);
    setEvidencePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [evidenceFile]);

  const resolveLocationForSubmit = async () => {
    if (useManualLocation) {
      const { location: manualLocation, error: manualError } =
        parseManualCoordinates(manualLat, manualLng);
      if (manualError) {
        throw new Error(manualError);
      }
      return manualLocation;
    }

    if (location) {
      return location;
    }

    const coords = await requestDeviceLocation();
    setLocation(coords);
    setLocationStatus("ready");
    setManualLat(String(coords.latitude));
    setManualLng(String(coords.longitude));
    return coords;
  };

  const onEvidenceChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      e.target.value = "";
      return;
    }

    setCompressingEvidence(true);
    setError("");
    setEvidenceSizeLabel("");

    try {
      const { file: compressed, originalSize, compressedSize, skipped } =
        await compressImageFile(file);

      setEvidenceFile(compressed);
      if (skipped || originalSize === compressedSize) {
        setEvidenceSizeLabel(formatFileSize(compressedSize));
      } else {
        setEvidenceSizeLabel(
          `${formatFileSize(originalSize)} → ${formatFileSize(compressedSize)}`,
        );
      }
    } catch (compressErr) {
      setError(compressErr.message || "Could not compress image.");
      setEvidenceFile(null);
      setEvidenceSizeLabel("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setCompressingEvidence(false);
    }
  };

  const clearEvidence = () => {
    setEvidenceFile(null);
    setEvidenceSizeLabel("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const trimmed = details.trim();
    if (trimmed.length < MIN_DETAILS_LENGTH) {
      setError(
        `Please describe the incident (at least ${MIN_DETAILS_LENGTH} characters).`,
      );
      return;
    }

    const session = getSession();

    setLoading(true);
    try {
      let coords;
      try {
        coords = await resolveLocationForSubmit();
      } catch (locErr) {
        setError(locErr.message);
        setLocationStatus("error");
        return;
      }

      const { error: submitError, evidenceWarning } = await submitCommunityReport(
        {
          details: trimmed,
          hideIdentity,
          latitude: coords.latitude,
          longitude: coords.longitude,
          reporterId: session?.id,
          evidenceFile,
        },
      );

      if (submitError) {
        const msg =
          submitError.code === "42P01"
            ? "Reports table not found. Run frontend/supabase/community_reports.sql in Supabase."
            : submitError.message || "Failed to submit report.";
        setError(msg);
        return;
      }

      const warningNote = evidenceWarning ? ` ${evidenceWarning}` : "";
      setSuccess(`Report submitted successfully.${warningNote}`);
      setDetails("");
      setHideIdentity(false);
      clearEvidence();
      setTimeout(() => navigate("/feed"), 800);
    } finally {
      setLoading(false);
    }
  };

  const detailsReady = details.trim().length >= MIN_DETAILS_LENGTH;
  const canSubmit = !loading && !compressingEvidence && detailsReady;

  return (
    <section className="mx-auto w-full max-w-lg">
      <header className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/feed")}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-900/80 text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
          aria-label="Back to feed"
        >
          <BackIcon />
        </button>
        <h1 className="text-lg font-bold tracking-[0.12em] text-white">
          NEW REPORT
        </h1>
      </header>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="rounded-2xl border border-slate-700/70 bg-slate-900/50 p-4 shadow-inner">
          <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-500">
            REPORT DETAILS
          </p>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Describe what you see..."
            rows={6}
            disabled={loading}
            className="mt-3 w-full resize-none rounded-xl border border-slate-800 bg-[#0a0f1a] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 disabled:opacity-60"
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onEvidenceChange}
            disabled={loading || compressingEvidence}
          />

          {compressingEvidence ? (
            <p className="mt-3 text-center text-xs text-cyan-300/90">
              Compressing image…
            </p>
          ) : null}

          {evidencePreview ? (
            <div className="relative mt-4 overflow-hidden rounded-xl border border-slate-700/80">
              <img
                src={evidencePreview}
                alt="Selected evidence"
                className="max-h-48 w-full object-cover"
              />
              {evidenceSizeLabel ? (
                <span className="absolute bottom-2 left-2 rounded-lg bg-slate-950/85 px-2 py-1 text-[10px] font-medium text-cyan-200">
                  {evidenceSizeLabel}
                </span>
              ) : null}
              <button
                type="button"
                onClick={clearEvidence}
                disabled={loading || compressingEvidence}
                className="absolute right-2 top-2 rounded-lg bg-slate-950/80 px-2 py-1 text-xs font-medium text-slate-200 hover:bg-slate-900"
              >
                Remove
              </button>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading || compressingEvidence}
            className="mt-4 flex w-full items-center justify-center gap-2 py-2 text-sm font-semibold text-white transition hover:text-cyan-300 disabled:opacity-60"
          >
            <CameraIcon />
            {compressingEvidence ? "Compressing…" : "Add Evidence"}
          </button>
        </div>

        <div className="rounded-2xl border border-slate-700/70 bg-slate-900/50 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-white">Hide Identity</p>
              <p className="text-xs text-slate-500">
                Your name will not be stored with this report
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={hideIdentity}
              onClick={() => setHideIdentity((v) => !v)}
              disabled={loading}
              className={[
                "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200",
                hideIdentity ? "bg-cyan-400" : "bg-slate-700",
                loading ? "opacity-60" : "",
              ].join(" ")}
            >
              <span
                className={[
                  "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-200",
                  hideIdentity ? "translate-x-5" : "translate-x-0.5",
                ].join(" ")}
              />
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-700/70 bg-slate-900/50 px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-2">
              <LocationIcon />
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">Location</p>
                {locationStatus === "loading" ? (
                  <p className="text-xs text-slate-500">
                    Getting GPS coordinates…
                  </p>
                ) : null}
                {locationStatus === "ready" && location && !useManualLocation ? (
                  <p className="truncate text-xs text-cyan-200/90">
                    {location.latitude.toFixed(6)},{" "}
                    {location.longitude.toFixed(6)}
                    {location.accuracy != null
                      ? ` · ±${Math.round(location.accuracy)}m`
                      : ""}
                  </p>
                ) : null}
                {locationStatus === "error" ? (
                  <p className="text-xs text-red-400">{locationError}</p>
                ) : null}
                {locationStatus === "idle" ? (
                  <p className="text-xs text-slate-500">
                    Location is captured when you submit.
                  </p>
                ) : null}
              </div>
            </div>
            <button
              type="button"
              onClick={refreshGpsLocation}
              disabled={loading || locationStatus === "loading"}
              className="shrink-0 text-xs font-semibold text-cyan-400 hover:text-cyan-300 disabled:opacity-60"
            >
              {locationStatus === "loading" ? "…" : "Refresh GPS"}
            </button>
          </div>

          {(locationStatus === "error" || useManualLocation) && (
            <div className="mt-3 space-y-2 border-t border-slate-800 pt-3">
              <button
                type="button"
                onClick={() => setUseManualLocation((v) => !v)}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
              >
                {useManualLocation
                  ? "Use GPS instead"
                  : "Enter coordinates manually"}
              </button>
              {useManualLocation ? (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Latitude"
                    value={manualLat}
                    onChange={(e) => setManualLat(e.target.value)}
                    disabled={loading}
                    className="rounded-lg border border-slate-800 bg-[#0a0f1a] px-3 py-2 text-xs text-slate-100 outline-none focus:border-cyan-500/50"
                  />
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Longitude"
                    value={manualLng}
                    onChange={(e) => setManualLng(e.target.value)}
                    disabled={loading}
                    className="rounded-lg border border-slate-800 bg-[#0a0f1a] px-3 py-2 text-xs text-slate-100 outline-none focus:border-cyan-500/50"
                  />
                </div>
              ) : null}
            </div>
          )}
        </div>

        {error ? (
          <div className="rounded-xl border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-300">
            {success}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-xl bg-cyan-400 py-3 text-sm font-bold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.35)] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Submitting…" : "Submit Report"}
        </button>

        {locationStatus === "error" && !useManualLocation ? (
          <p className="text-center text-xs text-slate-500">
            GPS unavailable — allow location or tap &quot;Enter coordinates
            manually&quot; before submitting.
          </p>
        ) : null}
      </form>
    </section>
  );
};

export default Reports;

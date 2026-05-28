import { useEffect, useState } from "react";
import { REPORT_TYPES } from "../../../constants/reportTypes";

const MIN_DETAILS_LENGTH = 5;

const EditReportModal = ({
  isOpen,
  report,
  isSaving = false,
  onCancel,
  onConfirm,
}) => {
  const [reportType, setReportType] = useState("");
  const [details, setDetails] = useState("");
  const [hideIdentity, setHideIdentity] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!isOpen || !report) return;
    setReportType(report.report_type || "other");
    setDetails(report.details || "");
    setHideIdentity(Boolean(report.hide_identity));
    setFormError("");
  }, [isOpen, report]);

  if (!isOpen || !report) return null;

  const submitEdit = () => {
    const trimmed = details.trim();
    if (trimmed.length < MIN_DETAILS_LENGTH) {
      setFormError(
        `Please describe the incident (at least ${MIN_DETAILS_LENGTH} characters).`,
      );
      return;
    }
    onConfirm({
      reportType,
      details: trimmed,
      hideIdentity,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-report-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-cyan-400/30 bg-slate-900 shadow-[0_0_40px_rgba(34,211,238,0.18)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-slate-800 px-5 py-4">
          <h2 id="edit-report-title" className="text-base font-semibold text-white">
            Edit report
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Update your report details and status visibility.
          </p>
        </div>

        <div className="space-y-3 px-5 py-4">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.14em] text-slate-500">
              REPORT TYPE
            </p>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              disabled={isSaving}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-[#0a0f1a] px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-500/50"
            >
              {REPORT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-[10px] font-semibold tracking-[0.14em] text-slate-500">
              DETAILS
            </p>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={5}
              disabled={isSaving}
              className="mt-2 w-full resize-none rounded-xl border border-slate-700 bg-[#0a0f1a] px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-500/50"
            />
          </div>

          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2.5">
            <span className="text-sm text-slate-200">Hide identity</span>
            <input
              type="checkbox"
              checked={hideIdentity}
              onChange={(e) => setHideIdentity(e.target.checked)}
              disabled={isSaving}
              className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-cyan-400"
            />
          </label>

          {formError ? (
            <p className="rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-xs text-red-300">
              {formError}
            </p>
          ) : null}
        </div>

        <div className="flex gap-2 border-t border-slate-800 px-5 py-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="w-full rounded-xl border border-slate-700 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submitEdit}
            disabled={isSaving}
            className="w-full rounded-xl bg-cyan-400 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditReportModal;

const DeleteReportModal = ({
  isOpen,
  report,
  isDeleting = false,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen || !report) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-report-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-red-400/30 bg-slate-900 shadow-[0_0_40px_rgba(248,113,113,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-slate-800 px-5 py-4">
          <h2 id="delete-report-title" className="text-base font-semibold text-white">
            Delete report?
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            This action cannot be undone. The report and attached evidence will be
            permanently removed.
          </p>
        </div>

        <div className="px-5 py-4">
          <p className="line-clamp-3 text-sm text-slate-300">{report.details}</p>
        </div>

        <div className="flex gap-2 border-t border-slate-800 px-5 py-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="w-full rounded-xl border border-slate-700 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-800 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400 disabled:opacity-60"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteReportModal;

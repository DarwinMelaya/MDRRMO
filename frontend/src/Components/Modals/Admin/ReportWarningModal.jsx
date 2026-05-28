import { useEffect, useRef } from "react";

const ReportWarningModal = ({ isOpen, newCount = 0, onClose }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      return;
    }

    const audio = new Audio("/Audio/Warning.mp3");
    audio.loop = true;
    audioRef.current = audio;

    audio.play().catch(() => {
      // Playback can fail when browser autoplay policy blocks unmuted sounds.
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-warning-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-red-400/40 bg-slate-900 shadow-[0_0_45px_rgba(248,113,113,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-slate-700/70 px-5 py-4">
          <h2 id="report-warning-title" className="text-lg font-bold text-red-300">
            New incident report alert
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            {newCount > 1
              ? `${newCount} new reports just came in.`
              : "A new report just came in."}
          </p>
        </div>

        <div className="px-5 py-4 text-sm text-slate-400">
          Warning tone will continue until this alert is closed.
        </div>

        <div className="border-t border-slate-700/70 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400"
          >
            Close alert
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportWarningModal;

import { HiSignal } from "react-icons/hi2";

const AuthShell = ({ badge, title, subtitle, children, footer }) => {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(34,211,238,0.18),transparent_38%),radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.14),transparent_42%),linear-gradient(to_bottom,rgba(2,6,23,0.2),rgba(2,6,23,0.92))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:42px_42px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-slate-900/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200 backdrop-blur">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-cyan-400 to-blue-500 text-slate-950 shadow-[0_0_18px_rgba(34,211,238,0.4)]">
              <HiSignal className="h-3.5 w-3.5" aria-hidden />
            </span>
            {badge}
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-white">
            {title}
          </h1>
          <p className="mt-2 text-sm text-cyan-200/70">{subtitle}</p>
        </div>

        <div className="rounded-2xl border border-cyan-300/20 bg-slate-900/80 p-6 shadow-[0_0_40px_rgba(34,211,238,0.12)] backdrop-blur-md sm:p-8">
          {children}
        </div>

        {footer ? (
          <div className="mt-6 text-center text-sm text-slate-400">{footer}</div>
        ) : null}
      </div>
    </div>
  );
};

export const authFieldClass =
  "mt-1.5 w-full rounded-xl border border-slate-700/80 bg-[#0a0f1a] px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 disabled:opacity-60";

export const authLabelClass =
  "block text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-200/70";

export const authButtonClass =
  "w-full rounded-xl bg-cyan-400 py-3 text-sm font-bold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.35)] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50";

export const authLinkClass =
  "font-semibold text-cyan-400 transition hover:text-cyan-300";

export default AuthShell;

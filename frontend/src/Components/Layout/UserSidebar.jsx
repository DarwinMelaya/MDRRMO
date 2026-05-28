import { NavLink } from "react-router-dom";
import {
  HiHome,
  HiPlus,
  HiUser,
  HiDocumentPlus,
  HiSignal,
} from "react-icons/hi2";

const mobileLinkClass = ({ isActive }) =>
  [
    "flex flex-1 flex-col items-center justify-end gap-1.5 pb-3 pt-2 transition-colors duration-200 outline-none",
    isActive ? "text-cyan-400" : "text-slate-500 hover:text-slate-400",
  ].join(" ");

const desktopLinkClass =
  "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

const desktopNavItems = [
  { to: "/feed", label: "Feed", Icon: HiHome },
  { to: "/reports", label: "Reports", Icon: HiDocumentPlus },
  { to: "/user-profile", label: "Account", Icon: HiUser },
];

const UserSidebar = () => {
  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-800/60 bg-[#070b14] pb-[env(safe-area-inset-bottom)] lg:hidden">
        <div className="relative mx-auto flex h-[72px] max-w-lg items-end px-6">
          <NavLink to="/feed" className={mobileLinkClass}>
            {({ isActive }) => (
              <>
                <HiHome className="h-6 w-6" aria-hidden />
                <span className="text-[10px] font-semibold tracking-[0.22em]">
                  FEED
                </span>
              </>
            )}
          </NavLink>

          <div className="w-16 shrink-0" aria-hidden />

          <NavLink
            to="/reports"
            aria-label="Create report"
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[42%]"
          >
            <span className="absolute inset-0 -z-10 scale-150 rounded-full bg-cyan-400/35 blur-xl" />
            <span className="relative flex h-[58px] w-[58px] items-center justify-center rounded-full border-[5px] border-[#070b14] bg-cyan-400 shadow-[0_0_28px_rgba(34,211,238,0.55)] transition-transform duration-200 hover:scale-105 active:scale-95">
              <HiPlus className="h-7 w-7 text-slate-950" aria-hidden />
            </span>
          </NavLink>

          <NavLink to="/user-profile" className={mobileLinkClass}>
            {({ isActive }) => (
              <>
                <HiUser className="h-6 w-6" aria-hidden />
                <span className="text-[10px] font-semibold tracking-[0.22em]">
                  ACCOUNT
                </span>
              </>
            )}
          </NavLink>
        </div>
      </nav>

      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-cyan-900/40 bg-gradient-to-b from-slate-950 via-[#071428] to-[#001a3d] text-slate-200 shadow-[0_0_35px_rgba(34,211,238,0.12)] lg:flex">
        <div className="border-b border-cyan-900/40 px-5 py-5">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 text-sm font-bold text-slate-950 shadow-[0_0_18px_rgba(34,211,238,0.4)]">
            <HiSignal className="h-5 w-5" aria-hidden />
          </div>
          <div className="mt-3 text-sm font-semibold tracking-wide text-white">
            Community Portal
          </div>
          <div className="text-xs text-cyan-200/75">Reports and updates</div>
        </div>

        <nav className="flex-1 px-4 py-5">
          <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200/55">
            Navigation
          </div>

          <div className="space-y-1">
            {desktopNavItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  [
                    desktopLinkClass,
                    isActive
                      ? "bg-cyan-500/20 text-white ring-1 ring-cyan-300/35 shadow-[0_0_20px_rgba(34,211,238,0.25)]"
                      : "text-slate-300 hover:bg-cyan-500/10 hover:text-white",
                  ].join(" ")
                }
              >
                <Icon className="h-5 w-5 shrink-0 opacity-80" aria-hidden />
                {label}
              </NavLink>
            ))}
          </div>

          <NavLink
            to="/reports"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.35)] transition hover:bg-cyan-300"
          >
            <HiDocumentPlus className="h-5 w-5" aria-hidden />
            New Report
          </NavLink>
        </nav>

        <div className="border-t border-cyan-900/40 p-4">
          <div className="rounded-xl border border-cyan-900/50 bg-cyan-950/40 px-3 py-3 text-xs text-cyan-100/75 backdrop-blur-sm">
            Signed in as{" "}
            <span className="font-semibold text-white">Community</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default UserSidebar;

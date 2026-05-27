import { NavLink } from "react-router-dom";

const mobileLinkClass = ({ isActive }) =>
  [
    "flex flex-1 flex-col items-center justify-end gap-1.5 pb-3 pt-2 transition-colors duration-200 outline-none",
    isActive ? "text-cyan-400" : "text-slate-500 hover:text-slate-400",
  ].join(" ");

const desktopLinkClass =
  "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

const desktopNavItems = [
  { to: "/feed", label: "Feed" },
  { to: "/reports", label: "Reports" },
  { to: "/user-profile", label: "Account" },
];

const HomeIcon = ({ active }) => (
  <svg
    viewBox="0 0 24 24"
    className="h-6 w-6"
    fill={active ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth={active ? 0 : 1.75}
    aria-hidden
  >
    {active ? (
      <path d="M12 3.2 3 10.5v10.3h6.2v-6.5h5.6v6.5H21V10.5L12 3.2z" />
    ) : (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 10.2 12 4.5l7.5 5.7V20a1 1 0 0 1-1 1h-4.5v-5.5h-4V21H5.5a1 1 0 0 1-1-1v-9.8z"
      />
    )}
  </svg>
);

const UserIcon = ({ active }) => (
  <svg
    viewBox="0 0 24 24"
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth={active ? 2 : 1.75}
    aria-hidden
  >
    <circle cx="12" cy="8" r="3.25" fill={active ? "currentColor" : "none"} />
    <path
      strokeLinecap="round"
      d="M5.5 19.5c1.6-2.8 4.2-4.2 6.5-4.2s4.9 1.4 6.5 4.2"
    />
  </svg>
);

const ReportIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 5v14m-7-7h14"
    />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" className="h-7 w-7 text-white" aria-hidden>
    <path
      fill="currentColor"
      d="M11 5.5a1 1 0 0 1 2 0V11h5.5a1 1 0 0 1 0 2H13v5.5a1 1 0 0 1-2 0V13H5.5a1 1 0 0 1 0-2H11V5.5z"
    />
  </svg>
);

const UserSidebar = () => {
  return (
    <>
      {/* Phone / tablet — bottom nav (unchanged) */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-800/60 bg-[#070b14] pb-[env(safe-area-inset-bottom)] lg:hidden">
        <div className="relative mx-auto flex h-[72px] max-w-lg items-end px-6">
          <NavLink to="/feed" className={mobileLinkClass}>
            {({ isActive }) => (
              <>
                <HomeIcon active={isActive} />
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
              <PlusIcon />
            </span>
          </NavLink>

          <NavLink to="/user-profile" className={mobileLinkClass}>
            {({ isActive }) => (
              <>
                <UserIcon active={isActive} />
                <span className="text-[10px] font-semibold tracking-[0.22em]">
                  ACCOUNT
                </span>
              </>
            )}
          </NavLink>
        </div>
      </nav>

      {/* Laptop / PC — left sidebar */}
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-cyan-900/40 bg-gradient-to-b from-slate-950 via-[#071428] to-[#001a3d] text-slate-200 shadow-[0_0_35px_rgba(34,211,238,0.12)] lg:flex">
        <div className="border-b border-cyan-900/40 px-5 py-5">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 text-sm font-bold text-slate-950 shadow-[0_0_18px_rgba(34,211,238,0.4)]">
            CM
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
            {desktopNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    desktopLinkClass,
                    isActive
                      ? "bg-cyan-500/20 text-white ring-1 ring-cyan-300/35 shadow-[0_0_20px_rgba(34,211,238,0.25)]"
                      : "text-slate-300 hover:bg-cyan-500/10 hover:text-white",
                  ].join(" ")
                }
              >
                <span className="h-2 w-2 rounded-full bg-current opacity-70 transition-opacity group-hover:opacity-100" />
                {item.label}
              </NavLink>
            ))}
          </div>

          <NavLink
            to="/reports"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.35)] transition hover:bg-cyan-300"
          >
            <ReportIcon />
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

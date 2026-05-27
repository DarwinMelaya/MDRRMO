import { NavLink } from "react-router-dom";

const linkBase =
  "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/report", label: "Reports" },
];

const AdminSidebar = () => {
  return (
    <aside className="sticky top-0 flex h-screen w-72 flex-col border-r border-blue-900/60 bg-gradient-to-b from-slate-950 via-blue-950 to-[#001e5a] text-slate-200 shadow-[0_0_35px_rgba(37,99,235,0.2)]">
      <div className="border-b border-blue-900/50 px-5 py-5">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-sm font-bold text-white shadow-[0_0_18px_rgba(59,130,246,0.45)]">
          AD
        </div>
        <div className="mt-3 text-sm font-semibold tracking-wide text-white">
          Admin Console
        </div>
        <div className="text-xs text-blue-200/80">Operations and Monitoring</div>
      </div>

      <nav className="flex-1 px-4 py-5">
        <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-blue-200/60">
          Navigation
        </div>

        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  linkBase,
                  isActive
                    ? "bg-blue-500/25 text-white ring-1 ring-blue-300/40 shadow-[0_0_20px_rgba(59,130,246,0.35)]"
                    : "text-slate-300 hover:bg-blue-500/10 hover:text-white",
                ].join(" ")
              }
            >
              <span className="h-2 w-2 rounded-full bg-current opacity-70 transition-opacity group-hover:opacity-100" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="border-t border-blue-900/50 p-4">
        <div className="rounded-xl border border-blue-900/60 bg-blue-950/60 px-3 py-3 text-xs text-blue-100/75 backdrop-blur-sm">
          Signed in as <span className="font-semibold text-white">Admin</span>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;

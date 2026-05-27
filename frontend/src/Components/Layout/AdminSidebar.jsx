import { NavLink } from "react-router-dom";

const linkBase =
  "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/report", label: "Reports" },
];

const AdminSidebar = () => {
  return (
    <aside className="sticky top-0 flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-950 text-slate-200 shadow-2xl shadow-slate-900/30">
      <div className="border-b border-slate-800 px-5 py-5">
        <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 text-sm font-bold text-white">
          AD
        </div>
        <div className="mt-3 text-sm font-semibold tracking-wide text-white">
          Admin Console
        </div>
        <div className="text-xs text-slate-400">Operations and Monitoring</div>
      </div>

      <nav className="flex-1 px-4 py-5">
        <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
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
                    ? "bg-white/10 text-white ring-1 ring-white/15"
                    : "text-slate-300 hover:bg-white/5 hover:text-white",
                ].join(" ")
              }
            >
              <span className="h-2 w-2 rounded-full bg-current opacity-70 transition-opacity group-hover:opacity-100" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-3 text-xs text-slate-400">
          Signed in as <span className="font-semibold text-slate-100">Admin</span>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;

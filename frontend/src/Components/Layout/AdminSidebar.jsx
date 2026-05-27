import { NavLink } from "react-router-dom";

const linkBase =
  "group flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-slate-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const AdminSidebar = () => {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-4">
        <div className="text-sm font-semibold text-slate-900">Admin</div>
        <div className="text-xs text-slate-500">Management</div>
      </div>

      <nav className="flex-1 p-3">
        <div className="mb-2 px-3 text-xs font-medium uppercase tracking-wide text-slate-500">
          Navigation
        </div>

        <div className="space-y-1">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              [
                linkBase,
                isActive
                  ? "bg-slate-900 text-white hover:bg-slate-900"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
              ].join(" ")
            }
          >
            <span className="h-2 w-2 rounded-full bg-current opacity-70 group-hover:opacity-100" />
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/report"
            className={({ isActive }) =>
              [
                linkBase,
                isActive
                  ? "bg-slate-900 text-white hover:bg-slate-900"
                  : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
              ].join(" ")
            }
          >
            <span className="h-2 w-2 rounded-full bg-current opacity-70 group-hover:opacity-100" />
            Reports
          </NavLink>
        </div>
      </nav>

      <div className="border-t border-slate-200 p-3">
        <div className="rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600">
          Signed in as <span className="font-medium text-slate-900">Admin</span>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;

import AdminSidebar from "./AdminSidebar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50">
      <div className="flex min-h-screen w-full">
        <AdminSidebar />

        <main className="min-w-0 flex-1 px-6 py-8 lg:px-10">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Admin Panel
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage reports, monitor activity, and handle operations.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-300/40 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

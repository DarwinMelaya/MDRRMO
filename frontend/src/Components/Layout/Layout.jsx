import AdminSidebar from "./AdminSidebar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl">
        <AdminSidebar />

        <main className="flex-1 p-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

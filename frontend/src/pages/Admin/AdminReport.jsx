const AdminReport = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-blue-900/60 bg-gradient-to-b from-slate-950 via-blue-950 to-[#002464] p-6 text-slate-100 shadow-[0_0_35px_rgba(37,99,235,0.25)] sm:p-8">
      <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-blue-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative space-y-5">
        <div className="inline-flex items-center rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-100">
          AdminReport
        </div>

        <div className="rounded-2xl border border-blue-800/50 bg-blue-950/45 p-5 backdrop-blur-sm">
          <div className="h-2 w-20 rounded-full bg-blue-300/40" />
          <div className="mt-5 grid gap-3">
            <div className="h-10 rounded-xl bg-blue-200/15" />
            <div className="h-10 rounded-xl bg-blue-200/15" />
            <div className="h-10 rounded-xl bg-blue-200/15" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminReport;

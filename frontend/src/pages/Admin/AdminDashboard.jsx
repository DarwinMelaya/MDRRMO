const hotspots = [
  { name: "Lipa City", top: "38%", left: "52%", risk: "High" },
  { name: "Nasugbu", top: "62%", left: "30%", risk: "Medium" },
  { name: "Lemery", top: "56%", left: "38%", risk: "Low" },
];

const AdminDashboard = () => {
  return (
    <section className="fixed inset-0 z-30 overflow-hidden bg-slate-950 text-slate-100 lg:left-72">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="space-y-2">
          <div className="inline-flex items-center rounded-full border border-cyan-300/25 bg-slate-900/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-200 backdrop-blur">
            Live Situation Map
          </div>
          <h1 className="text-sm font-medium text-white/90 sm:text-base">
            MDRRMO Command View
          </h1>
        </div>
        <div className="rounded-xl border border-cyan-300/20 bg-slate-900/80 px-3 py-2 text-right backdrop-blur">
          <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200/85">
            Monitoring
          </p>
          <p className="text-xs font-medium text-white/85">Batangas Cluster</p>
        </div>
      </div>

      <iframe
        title="Coral reef map"
        className="h-screen w-full [filter:grayscale(0.45)_invert(0.92)_hue-rotate(170deg)_saturate(0.8)_brightness(0.64)_contrast(1.1)]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src="https://www.openstreetmap.org/export/embed.html?bbox=121.74%2C13.13%2C122.24%2C13.62&layer=mapnik&marker=13.40%2C121.95"
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(34,211,238,0.2),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.18),transparent_40%),linear-gradient(to_bottom,rgba(2,6,23,0.2),rgba(2,6,23,0.7))]" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.06)_1px,transparent_1px)] bg-[size:42px_42px]" />

      {hotspots.map((hotspot) => (
        <div
          key={hotspot.name}
          className="pointer-events-none absolute z-10"
          style={{ top: hotspot.top, left: hotspot.left }}
        >
          <span className="absolute -inset-3 animate-ping rounded-full bg-cyan-300/20" />
          <span className="absolute -inset-1 rounded-full border border-cyan-300/35" />
          <span className="relative block h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.85)]" />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-cyan-300/25 bg-slate-900/85 px-2 py-1 text-[10px] font-medium text-cyan-100/90 backdrop-blur">
            {hotspot.name} - {hotspot.risk}
          </span>
        </div>
      ))}

      <div className="pointer-events-none absolute bottom-4 left-4 z-20 w-[min(320px,calc(100%-2rem))] rounded-xl border border-cyan-300/20 bg-slate-900/80 p-3 backdrop-blur">
        <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-cyan-200/80">
          Incident Summary
        </p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-cyan-400/10 px-2 py-2">
            <p className="text-lg font-semibold text-cyan-200">07</p>
            <p className="text-[10px] uppercase tracking-wide text-white/70">Active</p>
          </div>
          <div className="rounded-lg bg-amber-400/10 px-2 py-2">
            <p className="text-lg font-semibold text-amber-200">15</p>
            <p className="text-[10px] uppercase tracking-wide text-white/70">Queued</p>
          </div>
          <div className="rounded-lg bg-emerald-400/10 px-2 py-2">
            <p className="text-lg font-semibold text-emerald-200">21</p>
            <p className="text-[10px] uppercase tracking-wide text-white/70">Resolved</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;

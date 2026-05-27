const AdminDashboard = () => {
  return (
    <section className="relative -m-6 overflow-hidden rounded-2xl bg-slate-950 text-slate-100 lg:-m-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4 sm:p-5">
        <div className="rounded-lg border border-white/10 bg-slate-900/75 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur">
          Map view
        </div>
        <div className="rounded-lg border border-white/10 bg-slate-900/75 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur">
          AdminDashboard
        </div>
      </div>

      <iframe
        title="Coral reef map"
        className="h-[calc(100vh-9rem)] min-h-[560px] w-full [filter:grayscale(0.35)_invert(0.9)_hue-rotate(165deg)_saturate(0.75)_brightness(0.72)_contrast(1.08)]"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src="https://www.openstreetmap.org/export/embed.html?bbox=121.74%2C13.13%2C122.24%2C13.62&layer=mapnik&marker=13.40%2C121.95"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/20 via-transparent to-blue-950/40" />
    </section>
  );
};

export default AdminDashboard;

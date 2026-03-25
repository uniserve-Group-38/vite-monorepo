export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#bef264_0,_transparent_60%),linear-gradient(135deg,#ecfeff,#f5f5f4)] px-3 sm:px-4 py-4 sm:py-6 md:px-10 md:py-10 min-w-0">
      <section className="mx-auto flex max-w-5xl flex-col gap-4 sm:gap-6">
        <header className="relative overflow-hidden rounded-xl sm:rounded-2xl border-4 border-black bg-lime-100 px-4 py-4 sm:px-6 sm:py-5 shadow-[6px_6px_0_0_#000] md:px-8 md:py-6 animate-pulse">
          <div className="h-6 w-32 rounded bg-black/10" />
          <div className="mt-3 h-10 w-64 rounded bg-black/10" />
          <div className="mt-2 h-4 w-full max-w-xl rounded bg-black/5" />
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-48 rounded-2xl border-4 border-black bg-white/80 shadow-[6px_6px_0_0_#000] animate-pulse"
            />
          ))}
        </div>
      </section>
    </main>
  );
}

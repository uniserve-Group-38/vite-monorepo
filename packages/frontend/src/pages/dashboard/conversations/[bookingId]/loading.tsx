export default function ConversationLoading() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f97316_0,_ transparent_60%),linear-gradient(135deg,#f5f5f4,#e0f2fe)] px-4 py-6 md:px-10 md:py-10">
      <section className="mx-auto flex max-w-4xl flex-col gap-4">
        <header className="rounded-2xl border-4 border-black bg-white px-5 py-4 shadow-[8px_8px_0_0_#000] animate-pulse">
          <div className="h-4 w-24 rounded bg-black/10" />
          <div className="mt-2 h-8 w-48 rounded bg-black/10" />
          <div className="mt-2 h-3 w-32 rounded bg-black/5" />
        </header>
        <div className="min-h-[420px] rounded-2xl border-4 border-black bg-white/90 p-4 shadow-[8px_8px_0_0_#000] animate-pulse">
          <div className="flex h-full items-center justify-center text-sm text-foreground/50">
            Loading conversation…
          </div>
        </div>
      </section>
    </main>
  );
}

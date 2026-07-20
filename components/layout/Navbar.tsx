export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 h-16 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-8">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-sm font-semibold text-white">
            E
          </div>

          <div>
            <h1 className="text-sm font-semibold text-zinc-900">
              ESG Platform
            </h1>
            <p className="text-xs text-zinc-500">Reporting Dashboard</p>
          </div>
        </div>

        {/* Center */}
        <div className="hidden md:block">
          <input
            type="text"
            placeholder="Search organizations..."
            className="w-80 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm outline-none transition focus:border-zinc-400 focus:bg-white"
          />
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <button className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100">
            New Assessment
          </button>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
            NK
          </div>
        </div>
      </div>
    </header>
  );
}

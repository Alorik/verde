import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 h-16 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-8">
        {/* Left */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-sm font-semibold text-white ring-4 ring-emerald-50">
            E
          </div>

          <div>
            <h1 className="text-sm font-semibold leading-tight text-zinc-900">
              ESG Platform
            </h1>
            <p className="text-xs leading-tight text-zinc-500">
              Reporting dashboard
            </p>
          </div>
        </Link>

        {/* Center */}
        <div className="hidden md:block">
          <div className="relative w-80">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>

            <input
              type="text"
              placeholder="Search organizations…"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-50"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 active:scale-[0.98]">
            New assessment
          </button>

          <button className="group flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white ring-2 ring-transparent transition hover:ring-emerald-200">
            NK
          </button>
        </div>
      </div>
    </header>
  );
}

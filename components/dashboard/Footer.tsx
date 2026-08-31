
export default function FooterSection() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-8 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="max-w-sm">
            <p className="text-lg font-medium tracking-tight text-zinc-900">
              ESG Reporting Platform
            </p>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Turn your sustainability data into clear ESG insights and
              actionable recommendations.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex gap-16">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Platform
              </p>

              <div className="mt-4 flex flex-col gap-3 text-sm text-zinc-600">
                <a href="/dashboard" className="hover:text-zinc-900 transition">
                  Overview
                </a>
                <a
                  href="/assessments"
                  className="hover:text-zinc-900 transition"
                >
                  Assessments
                </a>
                <a href="/documents" className="hover:text-zinc-900 transition">
                  Documents
                </a>
                <a href="/metrics" className="hover:text-zinc-900 transition">
                  ESG Metrics
                </a>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Insights
              </p>

              <div className="mt-4 flex flex-col gap-3 text-sm text-zinc-600">
                <a href="/reports" className="hover:text-zinc-900 transition">
                  Reports
                </a>
                <a
                  href="/recommendations"
                  className="hover:text-zinc-900 transition"
                >
                  Recommendations
                </a>
                <a href="/settings" className="hover:text-zinc-900 transition">
                  Settings
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-3 border-t border-zinc-100 pt-6 text-xs text-zinc-400 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} ESG Reporting Platform</p>

          <p>Measure. Understand. Improve.</p>
        </div>
      </div>
    </footer>
  );
}

"use client"
import {ChevronRight } from "lucide-react"
import Link from "next/link";

export default function FooterSection() {
  return (
    <footer className="bg-emerald-950 text-white">
      <div className="mx-auto max-w-[1720px] px-12 pt-16">
        {/* Top */}
        <div className="flex flex-col justify-between gap-16 md:flex-row">
          {/* CTA */}
          <div>
            <h2 className="max-w-xl text-5xl font-medium leading-[1.05] tracking-tight">
              Make your ESG data
              <br />
              <span className="text-lime-500">work for you.</span>
            </h2>

            <button className="mt-10 bg-emerald-800 px-7 py-4 flex text-sm transition-colors duration-200 hover:bg-emerald-700">
              Know the metrics <ChevronRight />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex gap-24 pr-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300/60">
                Explore
              </p>

              <div className="mt-7 flex flex-col gap-5 text-sm text-white/70">
                <Link
                  href="/dashboard"
                  className="transition-colors hover:text-white"
                >
                  Overview
                </Link>

                <Link
                  href="/assessments"
                  className="transition-colors hover:text-white"
                >
                  Assessments
                </Link>

                <Link
                  href="/documents"
                  className="transition-colors hover:text-white"
                >
                  Documents
                </Link>

                <Link
                  href="/metrics"
                  className="transition-colors hover:text-white"
                >
                  ESG Metrics
                </Link>
              </div>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300/60">
                Platform
              </p>

              <div className="mt-7 flex flex-col gap-5 text-sm text-white/70">
                <Link
                  href="/reports"
                  className="transition-colors hover:text-white"
                >
                  Reports
                </Link>

                <Link
                  href="/recommendations"
                  className="transition-colors hover:text-white"
                >
                  Recommendations
                </Link>

                <Link
                  href="/settings"
                  className="transition-colors hover:text-white"
                >
                  Settings
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Large brand */}
        <div className="mt-28 overflow-hidden">
          <p className="text-[24vw] font-medium text-center leading-[0.75] tracking-[-0.07em] text-emerald-900 md:text-[21vw]">
            Verde
          </p>
        </div>

        {/* Bottom */}
        <div className="flex flex-col justify-between gap-4 border-t border-emerald-800/70 py-6 text-[11px] uppercase tracking-[0.18em] text-emerald-300/60 md:flex-row">
          <p>© {new Date().getFullYear()} VERDE</p>

          <p>ESG REPORTING, BY DESIGN</p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function FooterSection() {
  return (
    <footer className="bg-emerald-950 text-white">
      <div className="mx-auto max-w-[1720px] px-4 pt-12 sm:px-6 sm:pt-14 md:px-8 md:pt-16 lg:px-12">
        {/* Top */}
        <div className="flex flex-col justify-between gap-12 sm:gap-16 md:flex-row">
          {/* CTA */}
          <div className="max-w-xl">
            <h2 className="text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl">
              Make your ESG data
              <br />
              <span className="text-lime-500">work for you.</span>
            </h2>

            <button className="mt-8 flex items-center gap-1 bg-emerald-800 px-6 py-3.5 text-sm transition-colors duration-200 hover:bg-emerald-700 sm:mt-10 sm:px-7 sm:py-4">
              Know the metrics
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-10 sm:gap-16 md:gap-20 lg:gap-24 md:pr-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-300/60">
                Explore
              </p>

              <div className="mt-6 flex flex-col gap-4 text-sm text-white/70 sm:mt-7 sm:gap-5">
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

              <div className="mt-6 flex flex-col gap-4 text-sm text-white/70 sm:mt-7 sm:gap-5">
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
        <div className="mt-20 overflow-hidden sm:mt-24 md:mt-28">
          <p className="text-center text-[27vw] font-medium leading-[0.75] tracking-[-0.07em] text-emerald-900 sm:text-[24vw] md:text-[21vw]">
            Verde
          </p>
        </div>

        {/* Bottom */}
        <div className="flex flex-col justify-between gap-3 border-t border-emerald-800/70 py-5 text-[10px] uppercase tracking-[0.16em] text-emerald-300/60 sm:gap-4 sm:py-6 sm:text-[11px] sm:tracking-[0.18em] md:flex-row">
          <p>© {new Date().getFullYear()} VERDE</p>

          <p>ESG REPORTING, BY DESIGN</p>
        </div>
      </div>
    </footer>
  );
}

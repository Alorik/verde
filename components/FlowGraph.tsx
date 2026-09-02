"use client";

import { motion } from "framer-motion";
import {
  FileUp,
  FileSearch,
  Database,
  Leaf,
  Users,
  ShieldCheck,
  BarChart3,
  FileText,
  Lightbulb,
  ArrowDown,
} from "lucide-react";

const steps = [
  {
    title: "Data Sources",
    description: "CSV, PDF & Excel files",
    icon: FileUp,
  },
  {
    title: "Document Upload",
    description: "ESG documents are uploaded",
    icon: FileText,
  },
  {
    title: "Data Extraction",
    description: "Extract structured information",
    icon: FileSearch,
  },
  {
    title: "Structured ESG Data",
    description: "Validated & normalized data",
    icon: Database,
  },
];

const pillars = [
  {
    title: "Environment",
    short: "E",
    description: "Energy, water & resource consumption",
    score: "E Score",
    icon: Leaf,
    color: "emerald",
  },
  {
    title: "Social",
    short: "S",
    description: "Employees, training & CSR",
    score: "S Score",
    icon: Users,
    color: "blue",
  },
  {
    title: "Governance",
    short: "G",
    description: "Policies, ethics & compliance",
    score: "G Score",
    icon: ShieldCheck,
    color: "violet",
  },
];

export default function Flowgraph() {
  return (
    <section className="border border-emerald-700/30 bg-white">
      {/* Header */}
      <div className="border-b border-emerald-700/30 px-6 py-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
          System flow
        </p>

        <h2 className="mt-2 text-2xl font-medium tracking-tight text-zinc-950">
          ESG data pipeline
        </h2>

        <p className="mt-1 max-w-xl text-sm font-medium text-zinc-600">
          From uploaded documents to a structured ESG assessment.
        </p>
      </div>

      <div className="p-6 sm:p-8">
        {/* ─────────────── DATA PIPELINE ─────────────── */}

        <div className="grid gap-3 sm:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.title} className="relative">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.08,
                  }}
                  className="h-full border border-zinc-300 bg-zinc-50 p-5 transition-colors hover:border-emerald-600 hover:bg-emerald-50/40"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-9 w-9 items-center justify-center border border-emerald-700/40 bg-white text-emerald-800">
                      <Icon size={17} strokeWidth={2} />
                    </span>

                    <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-6 text-sm font-medium text-zinc-950">
                    {step.title}
                  </h3>

                  <p className="mt-1.5 text-xs font-medium leading-5 text-zinc-600">
                    {step.description}
                  </p>
                </motion.div>

                {/* Arrow */}
                {index < steps.length - 1 && (
                  <div className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 sm:block">
                    <span className="flex h-6 w-6 items-center justify-center border border-zinc-300 bg-white text-zinc-500">
                      →
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Connector */}
        <FlowArrow />

        {/* ─────────────── ESG PILLARS ─────────────── */}

        <div className="relative">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                ESG framework
              </p>

              <p className="mt-1 text-sm font-medium text-zinc-800">
                Metrics are evaluated across three pillars
              </p>
            </div>

            <span className="hidden border border-zinc-300 bg-zinc-50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-zinc-600 sm:block">
              3 dimensions
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;

              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.35 + index * 0.1,
                  }}
                  className="border border-zinc-300 bg-white"
                >
                  {/* Pillar header */}
                  <div className="flex items-center justify-between border-b border-zinc-300 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 items-center justify-center border ${
                          pillar.color === "emerald"
                            ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                            : pillar.color === "blue"
                              ? "border-blue-500 bg-blue-50 text-blue-800"
                              : "border-violet-500 bg-violet-50 text-violet-800"
                        }`}
                      >
                        <Icon size={17} strokeWidth={2} />
                      </span>

                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                          {pillar.short}
                        </p>

                        <h3 className="text-sm font-medium text-zinc-950">
                          {pillar.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="px-5 py-5">
                    <p className="text-xs font-medium leading-5 text-zinc-600">
                      {pillar.description}
                    </p>

                    <div className="mt-5 border border-zinc-300 bg-zinc-50 p-3">
                      <p className="text-[9px] font-medium uppercase tracking-widest text-zinc-500">
                        Metrics
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="h-1.5 w-1.5 bg-zinc-400" />
                        <span className="text-xs font-medium text-zinc-800">
                          Collected & evaluated
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div
                    className={`border-t px-5 py-4 ${
                      pillar.color === "emerald"
                        ? "border-emerald-700/30 bg-emerald-50/50"
                        : pillar.color === "blue"
                          ? "border-blue-500/30 bg-blue-50/50"
                          : "border-violet-500/30 bg-violet-50/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">
                        Result
                      </span>

                      <span
                        className={`text-sm font-medium ${
                          pillar.color === "emerald"
                            ? "text-emerald-800"
                            : pillar.color === "blue"
                              ? "text-blue-800"
                              : "text-violet-800"
                        }`}
                      >
                        {pillar.score}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ─────────────── MERGE ─────────────── */}

        <div className="relative flex justify-center py-7">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-zinc-300" />

          <div className="relative z-10 flex h-8 w-8 items-center justify-center border border-zinc-400 bg-white text-zinc-600">
            <ArrowDown size={14} />
          </div>
        </div>

        {/* ─────────────── AGGREGATION ─────────────── */}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.7 }}
          className="border border-zinc-300 bg-zinc-950 p-5 text-white"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400">
                Aggregation
              </p>

              <h3 className="mt-1 text-lg font-medium">
                Combine E + S + G scores
              </h3>

              <p className="mt-1 text-xs font-medium text-zinc-400">
                Weighted scoring produces the organization&apos;s overall ESG
                performance.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <ScoreBox label="E" />
              <span className="text-zinc-500">+</span>
              <ScoreBox label="S" />
              <span className="text-zinc-500">+</span>
              <ScoreBox label="G" />
            </div>
          </div>
        </motion.div>

        {/* Arrow */}
        <FlowArrow />

        {/* ─────────────── FINAL SCORE ─────────────── */}

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.85 }}
          className="border border-emerald-700 bg-emerald-50 p-6"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-800">
                Final result
              </p>

              <h3 className="mt-2 text-2xl font-medium tracking-tight text-zinc-950">
                Overall ESG Score
              </h3>

              <p className="mt-1 text-sm font-medium text-zinc-600">
                Comprehensive sustainability performance.
              </p>
            </div>

            <div className="flex h-20 w-20 items-center justify-center border border-emerald-700 bg-white">
              <span className="text-2xl font-medium text-emerald-800">82</span>
            </div>
          </div>
        </motion.div>

        {/* ─────────────── OUTPUTS ─────────────── */}

        <div className="relative flex justify-center py-7">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-zinc-300" />

          <div className="relative z-10 flex h-8 w-8 items-center justify-center border border-zinc-400 bg-white text-zinc-600">
            <ArrowDown size={14} />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <OutputCard
            icon={BarChart3}
            title="ESG Report"
            description="Generate a structured assessment of sustainability performance."
          />

          <OutputCard
            icon={Lightbulb}
            title="Recommendations"
            description="Identify gaps and provide actionable improvement opportunities."
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- Small components ---------- */

function FlowArrow() {
  return (
    <div className="flex justify-center py-6">
      <div className="flex flex-col items-center">
        <div className="h-8 w-px bg-zinc-300" />

        <div className="flex h-7 w-7 items-center justify-center border border-zinc-300 bg-white text-zinc-500">
          <ArrowDown size={13} />
        </div>
      </div>
    </div>
  );
}

function ScoreBox({ label }: { label: string }) {
  return (
    <span className="flex h-8 w-8 items-center justify-center border border-zinc-600 bg-zinc-900 text-xs font-medium text-white">
      {label}
    </span>
  );
}

function OutputCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof FileText;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 1 }}
      className="border border-zinc-300 bg-zinc-50 p-5 transition-colors hover:border-emerald-600 hover:bg-emerald-50/40"
    >
      <div className="flex items-start gap-4">
        <span className="flex h-9 w-9 flex-none items-center justify-center border border-emerald-700/40 bg-white text-emerald-800">
          <Icon size={17} strokeWidth={2} />
        </span>

        <div>
          <h3 className="text-sm font-medium text-zinc-950">{title}</h3>

          <p className="mt-1 text-xs font-medium leading-5 text-zinc-600">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";

const metrics = [
  {
    category: "Environment",
    description:
      "Measures the organization's environmental impact through energy and water consumption.",
    areas: [
      {
        name: "Electricity",
        metrics: [
          "Electricity cost",
          "Units consumed",
          "Consumption unit",
          "Electricity consumption in MWh",
        ],
      },
      {
        name: "Water",
        metrics: [
          "Water cost",
          "Units consumed",
          "Consumption unit",
          "Water consumption in cubic meters",
        ],
      },
    ],
  },
  {
    category: "Social",
    description:
      "Measures workforce-related indicators including employee composition, retention, and development.",
    areas: [
      {
        name: "Employee Data",
        metrics: [
          "Total employees",
          "Male employees",
          "Female employees",
          "Employee turnover",
          "Employee training hours",
        ],
      },
      {
        name: "CSR",
        metrics: [
          "Corporate social responsibility activities",
          "Community initiatives",
          "Social impact information",
        ],
      },
    ],
  },
  {
    category: "Governance",
    description:
      "Measures organizational governance practices, policies, and responsible business practices.",
    areas: [
      {
        name: "Governance",
        metrics: [
          "Governance policies",
          "Business ethics",
          "Compliance practices",
          "Risk management",
          "Corporate governance information",
        ],
      },
    ],
  },
];

export default function MetricsPage() {
  return (
    <main className="min-h-screen border-x border-zinc-200 mx-24 bg-white">
      <div className="mx-auto max-w-5xl px-8 py-20">
        {/* Header */}
        <div className="border-b border-zinc-200 pb-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">
            ESG framework
          </p>

          <h1 className="mt-3 text-4xl tracking-tight text-zinc-900">
            Metrics
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            The metrics used to evaluate an organization&apos;s environmental,
            social, and governance performance.
          </p>
        </div>

        {/* ESG Categories */}
        <div className="mt-12 space-y-10">
          {metrics.map((category, categoryIndex) => (
            <motion.section
              key={category.category}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: categoryIndex * 0.1,
              }}
              className="border-b border-zinc-200 pb-10 last:border-b-0"
            >
              {/* Category header */}
              <div className="flex items-start justify-between gap-8">
                <div>
                  <h2 className="text-2xl font-semibold text-zinc-900">
                    {category.category}
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                    {category.description}
                  </p>
                </div>

                <div className="shrink-0 rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-500">
                  {category.areas.length}{" "}
                  {category.areas.length === 1 ? "area" : "areas"}
                </div>
              </div>

              {/* Areas */}
              <div className="mt-8 space-y-5">
                {category.areas.map((area) => (
                  <div
                    key={area.name}
                    className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-medium text-zinc-900">
                        {area.name}
                      </h3>

                      <span className="text-xs text-zinc-400">
                        {area.metrics.length} metrics
                      </span>
                    </div>

                    <div className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                      {area.metrics.map((metric) => (
                        <div
                          key={metric}
                          className="flex items-start gap-3 text-sm text-zinc-600"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />

                          <span>{metric}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Score overview */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-6"
        >
          <h2 className="text-lg font-semibold text-zinc-900">ESG Score</h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500">
            The collected metrics are used to calculate individual
            Environmental, Social, and Governance scores, which are combined
            into an overall ESG score.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            {["Environmental", "Social", "Governance", "Overall ESG"].map(
              (score) => (
                <div
                  key={score}
                  className="rounded-lg border border-zinc-200 bg-white p-4"
                >
                  <p className="text-xs text-zinc-400">{score}</p>

                  <p className="mt-2 text-lg font-medium text-zinc-900">
                    Score
                  </p>
                </div>
              ),
            )}
          </div>
        </motion.section>
      </div>
    </main>
  );
}

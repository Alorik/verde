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
    <main className="bg-zinc-100 px-12">
      <div className="mx-12 border-x border-zinc-300 bg-white py-10 sm:px-10">
        {/* Header */}
        <div className="border-b-4 border-zinc-950 pb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600">
            ESG framework
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950">
            Metrics
          </h1>

          <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-zinc-700">
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
              className="relative border-b border-zinc-300 pb-10 last:border-b-0"
            >
              {/* Category */}
              <h2 className="sticky top-16 z-10 border-b border-emerald-700/30 bg-white py-3 text-xs font-medium uppercase tracking-[0.2em] text-zinc-900">
                {category.category}
              </h2>

              {/* EVERYTHING BELOW BELONGS TO THIS CATEGORY */}
              <div className="pt-4">
                {/* Description + count */}
                <div className="flex items-start justify-between gap-8">
                  <p className="max-w-2xl text-sm font-medium leading-6 text-zinc-700">
                    {category.description}
                  </p>

                  <div className="shrink-0 border border-zinc-400 bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-700">
                    {category.areas.length}{" "}
                    {category.areas.length === 1 ? "area" : "areas"}
                  </div>
                </div>

                {/* Areas */}
                <div className="mt-8 space-y-5">
                  {category.areas.map((area) => (
                    <div
                      key={area.name}
                      className="border border-zinc-300 bg-zinc-50 p-6 transition-colors hover:border-emerald-500 hover:bg-emerald-50/40"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-zinc-950">
                          {area.name}
                        </h3>

                        <span className="text-xs font-semibold text-zinc-600">
                          {area.metrics.length} metrics
                        </span>
                      </div>

                      <div className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                        {area.metrics.map((metric) => (
                          <div
                            key={metric}
                            className="flex items-start gap-3 text-sm font-medium text-zinc-800"
                          >
                            <span className="mt-1.5 h-2 w-2 shrink-0 bg-emerald-600" />
                            <span>{metric}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          ))}
        </div>

        {/* Score overview */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="mt-4 border border-zinc-300 bg-zinc-950 p-6 text-white"
        >
          <h2 className="text-lg font-bold text-white">ESG Score</h2>

          <p className="mt-2 text-sm font-medium leading-6 text-zinc-300">
            The collected metrics are used to calculate individual
            Environmental, Social, and Governance scores, which are combined
            into an overall ESG score.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            {["Environmental", "Social", "Governance", "Overall ESG"].map(
              (score) => (
                <div
                  key={score}
                  className="border border-zinc-500 bg-white p-4 text-zinc-950"
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-zinc-600">
                    {score}
                  </p>

                  <p className="mt-2 text-lg font-bold text-zinc-950">Score</p>
                </div>
              ),
            )}
          </div>
        </motion.section>
      </div>
    </main>
  );
}

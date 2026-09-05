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
    <main className="bg-white px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="min-h-screen border-x border-emerald-800/30 bg-white px-4 py-18 sm:px-6 sm:py-10 md:px-8 lg:px-10">
        {/* Header */}
        <div className="-mx-4 border-b border-emerald-800/30 bg-white px-4 pb-6 shadow-[0_3px_6px_rgba(6,95,70,0.18)] sm:-mx-6 sm:px-6 sm:pb-8 md:-mx-8 md:px-8 lg:-mx-10 lg:px-10">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-600">
              ESG framework
            </p>

            <h1 className="mt-3 text-3xl font-medium tracking-tight text-zinc-950 sm:text-4xl">
              Metrics
            </h1>

            <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-zinc-700">
              The metrics used to evaluate an organization&apos;s environmental,
              social, and governance performance.
            </p>
          </div>
        </div>

        {/* ESG Categories */}
        <div className="mt-8 space-y-8 sm:mt-10 sm:space-y-10">
          {metrics.map((category, categoryIndex) => (
            <motion.section
              key={category.category}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: categoryIndex * 0.1,
              }}
              className="pb-6 sm:pb-10"
            >
              {/* Category */}
              <h2 className="-mx-4 sticky top-16 z-10 border-b border-emerald-800/30 bg-white px-4 py-3 text-xs font-medium uppercase tracking-[0.2em] text-zinc-900 shadow-[0_3px_6px_rgba(6,95,70,0.18)] sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 lg:-mx-10 lg:px-10">
                {category.category}
              </h2>

              {/* Everything below belongs to this category */}
              <div className="pt-4">
                {/* Description + count */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
                  <p className="max-w-2xl text-sm font-medium leading-6 text-zinc-700">
                    {category.description}
                  </p>

                  <div className="w-fit shrink-0 border border-zinc-400 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700">
                    {category.areas.length}{" "}
                    {category.areas.length === 1 ? "area" : "areas"}
                  </div>
                </div>

                {/* Areas */}
                <div className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
                  {category.areas.map((area) => (
                    <div
                      key={area.name}
                      className="border border-emerald-700/30 bg-white p-4 transition-colors hover:border-emerald-500 hover:bg-emerald-50/40 sm:p-6"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="text-base font-medium text-zinc-950">
                          {area.name}
                        </h3>

                        <span className="text-xs font-medium text-zinc-600">
                          {area.metrics.length} metrics
                        </span>
                      </div>

                      <div className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                        {area.metrics.map((metric) => (
                          <div
                            key={metric}
                            className="flex min-w-0 items-start gap-3 text-sm font-medium text-zinc-800"
                          >
                            <span className="mt-1.5 h-2 w-2 shrink-0 bg-emerald-600" />

                            <span className="min-w-0 break-words">
                              {metric}
                            </span>
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
          className="mt-2 border border-emerald-700/30 bg-zinc-950 p-4 text-white sm:mt-4 sm:p-6"
        >
          <h2 className="text-lg font-medium text-white">ESG Score</h2>

          <p className="mt-2 max-w-3xl text-sm font-medium leading-6 text-zinc-300">
            The collected metrics are used to calculate individual
            Environmental, Social, and Governance scores, which are combined
            into an overall ESG score.
          </p>

          <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 lg:grid-cols-4">
            {["Environmental", "Social", "Governance", "Overall ESG"].map(
              (score) => (
                <div
                  key={score}
                  className="border border-zinc-500 bg-white p-4 text-zinc-950"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-zinc-600">
                    {score}
                  </p>

                  <p className="mt-2 text-lg font-medium text-zinc-950">
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

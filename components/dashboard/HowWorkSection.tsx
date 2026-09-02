"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function HowWeWorkSection() {
  const prefersReducedMotion = useReducedMotion();

  const steps = [
    {
      number: "01",
      title: "Upload your data",
      shortTitle: "Upload",
      flowDescription: "ESG documents",
      description:
        "Add your ESG documents to an assessment. Electricity bills, water reports, employee data, CSR documents, and more.",
    },
    {
      number: "02",
      title: "We extract the metrics",
      shortTitle: "Extract",
      flowDescription: "Structured metrics",
      description:
        "Relevant sustainability data is extracted from your documents and organized into structured ESG metrics.",
    },
    {
      number: "03",
      title: "Calculate your ESG score",
      shortTitle: "Calculate",
      flowDescription: "ESG performance",
      description:
        "Your environmental, social, and governance performance is evaluated to produce an overall ESG score.",
    },
    {
      number: "04",
      title: "Get your report",
      shortTitle: "Report",
      flowDescription: "Insights & actions",
      description:
        "Review your ESG performance through a structured report with clear insights and actionable recommendations.",
    },
  ];

  return (
    <section className="min-h-screen border-x border-emerald-700/30 bg-white">
      {/* Sticky label */}
      <p className="sticky top-16 z-10 border-b border-emerald-700/30 bg-white px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-zinc-900">
        How we work
      </p>

      <div className="mx-auto px-8 py-16">
        {/* ========================================================= */}
        {/* INTRO + FLOW GRAPH */}
        {/* ========================================================= */}

        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          {/* LEFT — ESG text */}
          <div className="max-w-2xl">
            <motion.h2
              initial={{
                opacity: 0,
                y: prefersReducedMotion ? 0 : 12,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-5xl font-medium tracking-tight text-zinc-900"
            >
              From raw data
              <br />
              to ESG insight.
            </motion.h2>

            <motion.p
              initial={{
                opacity: 0,
                y: prefersReducedMotion ? 0 : 10,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: 0.1,
              }}
              className="mt-6 max-w-xl text-sm leading-6 text-zinc-500"
            >
              Turn your sustainability documents into structured ESG data,
              measurable performance, and recommendations for improvement.
            </motion.p>
          </div>

          {/* RIGHT — FLOW GRAPH */}
          <div className="border border-emerald-700 bg-zinc-50 p-6 sm:p-8">
            <p className="mb-8 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
              ESG data flow
            </p>

            <div className="flex items-center">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className="flex min-w-0 flex-1 items-center"
                >
                  {/* Node */}
                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: prefersReducedMotion ? 1 : 0.9,
                    }}
                    whileInView={{
                      opacity: 1,
                      scale: 1,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.5,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.12,
                    }}
                    className="flex min-w-0 flex-col items-center text-center"
                  >
                    <div className="flex h-12 w-12 items-center justify-center border border-emerald-700 bg-white text-xs font-medium text-emerald-800">
                      {step.number}
                    </div>

                    <p className="mt-3 text-xs font-medium text-zinc-900">
                      {step.shortTitle}
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-zinc-500">
                      {step.flowDescription}
                    </p>
                  </motion.div>

                  {/* Arrow */}
                  {index < steps.length - 1 && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        scaleX: prefersReducedMotion ? 1 : 0,
                      }}
                      whileInView={{
                        opacity: 1,
                        scaleX: 1,
                      }}
                      viewport={{
                        once: true,
                        amount: 0.5,
                      }}
                      transition={{
                        duration: 0.35,
                        delay: index * 0.12 + 0.15,
                      }}
                      style={{
                        transformOrigin: "left",
                      }}
                      className="mx-2 flex flex-1 items-center sm:mx-4"
                    >
                      <div className="h-px flex-1 bg-emerald-700/30" />

                      <span className="ml-1 text-sm text-emerald-700">→</span>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* STEP BOXES */}
        {/* ========================================================= */}

        <div className="mt-16 grid border-t border-emerald-700/20 md:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{
                opacity: 0,
                y: prefersReducedMotion ? 0 : 10,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.2,
              }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
              }}
              className="border-b border-emerald-700/20 py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"
            >
              <p className="text-xs text-zinc-400">{step.number}</p>

              <h3 className="mt-8 text-lg font-medium tracking-tight text-zinc-900">
                {step.title}
              </h3>

              <p className="mt-4 text-sm leading-6 text-zinc-500">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

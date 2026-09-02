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

          <div className="relative border border-emerald-700/40 bg-zinc-50 p-6 sm:p-8">
            {/* subtle background grid */}
            <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(6,78,59,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,78,59,0.06)_1px,transparent_1px)] [background-size:32px_32px]" />

            <div className="relative">
              <div className="mb-10 flex items-center justify-between">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                  ESG data flow
                </p>

                <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-widest text-emerald-700">
                  <motion.span
                    animate={
                      prefersReducedMotion
                        ? undefined
                        : { opacity: [0.3, 1, 0.3] }
                    }
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="h-1.5 w-1.5 bg-emerald-600"
                  />
                  Process
                </span>
              </div>

              <div className="flex items-start">
                {steps.map((step, index) => (
                  <div
                    key={step.number}
                    className="flex min-w-0 flex-1 items-start"
                  >
                    {/* 3D Node */}
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: prefersReducedMotion ? 0 : 20,
                        rotateX: prefersReducedMotion ? 0 : -12,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                        rotateX: 0,
                      }}
                      viewport={{
                        once: true,
                        amount: 0.5,
                      }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.15,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="flex min-w-0 flex-col items-center text-center"
                    >
                      {/* 3D block */}
                      <div className="relative">
                        {/* bottom extrusion */}
                        <div className="absolute left-1.5 top-1.5 h-14 w-14 border border-emerald-900/40 bg-emerald-900" />

                        {/* side extrusion */}
                        <div className="absolute left-1 top-1 h-14 w-14 border border-emerald-800/30 bg-emerald-700/20" />

                        {/* main face */}
                        <motion.div
                          initial={{
                            scale: prefersReducedMotion ? 1 : 0.9,
                          }}
                          whileInView={{
                            scale: 1,
                          }}
                          viewport={{
                            once: true,
                          }}
                          transition={{
                            duration: 0.45,
                            delay: index * 0.15 + 0.1,
                            ease: [0.34, 1.56, 0.64, 1],
                          }}
                          className="relative flex h-14 w-14 items-center justify-center border border-emerald-800 bg-white text-xs font-medium text-emerald-800 shadow-[0_4px_8px_rgba(6,78,59,0.12)]"
                        >
                          {step.number}
                        </motion.div>
                      </div>

                      <p className="mt-6 text-xs font-medium text-zinc-900">
                        {step.shortTitle}
                      </p>

                      <p className="mt-1 max-w-[110px] text-[10px] leading-4 text-zinc-500">
                        {step.flowDescription}
                      </p>
                    </motion.div>

                    {/* Animated connector */}
                    {index < steps.length - 1 && (
                      <div className="relative mx-2 mt-7 flex flex-1 items-center sm:mx-5">
                        {/* base line */}
                        <div className="h-px w-full bg-emerald-800/20" />

                        {/* animated line */}
                        <motion.div
                          initial={{
                            scaleX: prefersReducedMotion ? 1 : 0,
                          }}
                          whileInView={{
                            scaleX: 1,
                          }}
                          viewport={{
                            once: true,
                            amount: 0.5,
                          }}
                          transition={{
                            duration: 0.7,
                            delay: index * 0.15 + 0.35,
                            ease: [0.65, 0, 0.35, 1],
                          }}
                          style={{
                            transformOrigin: "left",
                          }}
                          className="absolute inset-y-0 left-0 h-px w-full bg-emerald-700"
                        />

                        {/* moving signal */}
                        {/* moving signal */}
                        {!prefersReducedMotion && (
                          <motion.span
                            animate={{
                              left: ["0%", "100%"],
                              opacity: [0, 1, 1, 0],
                            }}
                            transition={{
                              duration: 1.6,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: index * 0.25,
                            }}
                            className="absolute top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.6)]"
                          />
                        )}

                        {/* arrow */}
                        <motion.span
                          animate={
                            prefersReducedMotion
                              ? undefined
                              : {
                                  opacity: [0.5, 1, 0.5],
                                }
                          }
                          transition={{
                            duration: 1.6,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.25,
                          }}
                          className="ml-1.5 bg-zinc-50 pl-1 text-base font-medium text-emerald-700"
                        >
                          →
                        </motion.span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
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

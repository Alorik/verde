"use client";

import { motion, useReducedMotion } from "framer-motion";
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
  ArrowRight,
  ArrowDown,
  GitMerge,
} from "lucide-react";

const pipeline = [
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
  },
  {
    title: "Social",
    short: "S",
    description: "Employees, training & CSR",
    score: "S Score",
    icon: Users,
  },
  {
    title: "Governance",
    short: "G",
    description: "Policies, ethics & compliance",
    score: "G Score",
    icon: ShieldCheck,
  },
];

export default function Flowgraph() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative  bg-white shadow-[0_20px_60px_rgba(6,78,59,0.10)]">
      {/* Ambient grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #065f46 1px, transparent 1px), linear-gradient(to bottom, #065f46 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative p-6 sm:p-10">
        {/* =========================================================
            01 — INPUT PIPELINE
        ========================================================= */}

        <div className="relative">
          <FlowLabel number="01" label="Data ingestion" />

          <div className="grid gap-3 sm:grid-cols-4">
            {pipeline.map((step, index) => {
              const Icon = step.icon;

              return (
                <div key={step.title} className="relative">
                  <FlowNode
                    number={`0${index + 1}`}
                    title={step.title}
                    description={step.description}
                    icon={Icon}
                    delay={index * 0.1}
                    prefersReducedMotion={prefersReducedMotion}
                  />

                  {index < pipeline.length - 1 && (
                    <DesktopFlowArrow
                      delay={index * 0.3}
                      prefersReducedMotion={prefersReducedMotion}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================
            02 — CONNECTOR INTO ESG
        ========================================================= */}

        <VerticalFlowArrow
          delay={0}
          prefersReducedMotion={prefersReducedMotion}
        />

        {/* =========================================================
            03 — ESG PILLARS
        ========================================================= */}

        <div className="relative">
          <FlowLabel number="02" label="ESG evaluation" />

          <div className="grid gap-4 md:grid-cols-3">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;

              return (
                <motion.div
                  key={pillar.title}
                  initial={{
                    opacity: 0,
                    y: prefersReducedMotion ? 0 : 14,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.3,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.25 + index * 0.12,
                  }}
                  className="group relative"
                >
                  {/* 3D depth layer */}
                  <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 border border-emerald-700/20 bg-emerald-50" />

                  {/* Main node */}
                  <div className="relative border border-zinc-300 bg-white shadow-[0_8px_20px_rgba(6,78,59,0.08)]">
                    <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center border border-emerald-700/40 bg-emerald-50 text-emerald-800">
                          <Icon size={18} strokeWidth={2} />
                        </div>

                        <div>
                          <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-400">
                            Pillar {pillar.short}
                          </p>

                          <h3 className="text-sm font-medium text-zinc-950">
                            {pillar.title}
                          </h3>
                        </div>
                      </div>

                      <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">
                        ESG
                      </span>
                    </div>

                    <div className="px-5 py-5">
                      <p className="text-xs font-medium leading-5 text-zinc-600">
                        {pillar.description}
                      </p>

                      <div className="mt-5 flex items-center justify-between border border-zinc-200 bg-zinc-50 px-3 py-2.5">
                        <span className="text-[9px] font-medium uppercase tracking-widest text-zinc-400">
                          Result
                        </span>

                        <span className="text-xs font-medium text-emerald-800">
                          {pillar.score}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Pillar → aggregation connectors */}
          <div className="mt-5 hidden h-10 md:block">
            <div className="relative mx-auto h-full max-w-[75%]">
              <div className="absolute left-[16.66%] top-0 h-5 w-px bg-emerald-700/30" />
              <div className="absolute left-1/2 top-0 h-5 w-px -translate-x-1/2 bg-emerald-700/30" />
              <div className="absolute right-[16.66%] top-0 h-5 w-px bg-emerald-700/30" />

              <div className="absolute left-[16.66%] right-[16.66%] top-5 h-px bg-emerald-700/30" />

              <div className="absolute left-1/2 top-5 h-15 w-px -translate-x-1/2 bg-emerald-700/30" />

              {!prefersReducedMotion && (
                <>
                  <FlowParticle
                    delay={0}
                    duration={2.5}
                    className="left-[16.66%] top-[18px]"
                  />

                  <FlowParticleDown
                    delay={1}
                    duration={2.5}
                    className="left-[49.8%] top-[18px]"
                  />

                  <FlowParticleLeft
                    delay={0}
                    duration={2.5}
                    className="right-[16.55%] top-[18px]"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile connector */}
        <div className="flex justify-center py-5 md:hidden">
          <VerticalFlowArrow
            delay={0}
            prefersReducedMotion={prefersReducedMotion}
          />
        </div>

        {/* =========================================================
            04 — AGGREGATION
        ========================================================= */}

        <div className="relative">
          <FlowLabel number="03" label="Score aggregation" />

          <motion.div
            initial={{
              opacity: 0,
              y: prefersReducedMotion ? 0 : 12,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.4,
            }}
            transition={{
              duration: 0.5,
              delay: 0.3,
            }}
            className="relative mx-auto max-w-2xl"
          >
            {/* 3D depth */}
            <div className="absolute inset-0 translate-x-2 translate-y-2 border border-zinc-800 bg-zinc-800" />

            <div className="relative border border-zinc-800 bg-zinc-950 p-6 text-white shadow-[0_15px_35px_rgba(0,0,0,0.18)] sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-emerald-400">
                    Aggregation engine
                  </p>

                  <h3 className="mt-2 text-xl font-medium tracking-tight">
                    Combine E + S + G scores
                  </h3>

                  <p className="mt-2 max-w-md text-xs font-medium leading-5 text-zinc-400">
                    Weighted scoring combines environmental, social, and
                    governance performance into one overall assessment.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <ScoreBox label="E" />
                  <span className="text-zinc-600">+</span>
                  <ScoreBox label="S" />
                  <span className="text-zinc-600">+</span>
                  <ScoreBox label="G" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* =========================================================
            05 — FINAL SCORE
        ========================================================= */}

        <VerticalFlowArrow
          delay={0.2}
          prefersReducedMotion={prefersReducedMotion}
        />

        <div className="relative">
          <FlowLabel number="04" label="Final assessment" />

          <motion.div
            initial={{
              opacity: 0,
              scale: prefersReducedMotion ? 1 : 0.82,
              y: prefersReducedMotion ? 0 : 20,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.4,
            }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 14,
              delay: 0.2,
            }}
            className="relative mx-auto max-w-2xl"
          >
            {/* Pop / depth layers */}
            <motion.div
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      scale: [1, 1.015, 1],
                    }
              }
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 translate-x-2 translate-y-2 border border-emerald-700/30 bg-emerald-100"
            />

            <div className="relative border-2 border-emerald-700 bg-emerald-50 p-6 shadow-[0_18px_45px_rgba(6,78,59,0.16)] sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-emerald-800">
                    Final result
                  </p>

                  <h3 className="mt-2 text-3xl font-medium tracking-tight text-zinc-950">
                    Overall ESG Score
                  </h3>

                  <p className="mt-2 text-sm font-medium text-zinc-600">
                    Comprehensive sustainability performance.
                  </p>
                </div>

                {/* Score pops */}
                <motion.div
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : {
                          y: [0, -4, 0],
                        }
                  }
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex h-24 w-24 flex-none items-center justify-center border border-emerald-700 bg-white shadow-[0_8px_20px_rgba(6,78,59,0.12)]"
                >
                  <div className="text-center">
                    <span className="text-3xl font-medium text-emerald-800">
                      82
                    </span>

                    <p className="text-[8px] font-medium uppercase tracking-widest text-zinc-400">
                      / 100
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* =========================================================
            06 — OUTPUTS
        ========================================================= */}

        <VerticalFlowArrow
          delay={0.4}
          prefersReducedMotion={prefersReducedMotion}
        />

        <div className="relative">
          <FlowLabel number="05" label="Actionable outputs" />

          <div className="grid gap-4 md:grid-cols-2">
            <OutputCard
              icon={BarChart3}
              title="ESG Report"
              description="Generate a structured assessment of sustainability performance."
              delay={0.2}
              prefersReducedMotion={prefersReducedMotion}
            />

            <OutputCard
              icon={Lightbulb}
              title="Recommendations"
              description="Identify gaps and provide actionable improvement opportunities."
              delay={0.35}
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   FLOW NODE
========================================================= */

function FlowNode({
  number,
  title,
  description,
  icon: Icon,
  delay,
  prefersReducedMotion,
}: {
  number: string;
  title: string;
  description: string;
  icon: typeof FileText;
  delay: number;
  prefersReducedMotion: boolean | null;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: prefersReducedMotion ? 0 : 12,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.3,
      }}
      transition={{
        duration: 0.5,
        delay,
      }}
      className="relative h-full"
    >
      {/* 3D bottom layer */}
      <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 border border-emerald-700/20 bg-emerald-50" />

      {/* Main card */}
      <div className="relative h-full border border-zinc-300 bg-zinc-50 p-5 shadow-[0_8px_18px_rgba(6,78,59,0.07)]">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center border border-emerald-700/40 bg-white text-emerald-800">
            <Icon size={18} strokeWidth={2} />
          </div>

          <span className="text-[9px] font-medium uppercase tracking-widest text-zinc-400">
            {number}
          </span>
        </div>

        <h3 className="mt-6 text-sm font-medium text-zinc-950">{title}</h3>

        <p className="mt-2 text-xs font-medium leading-5 text-zinc-600">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

/* =========================================================
   HORIZONTAL ARROW
========================================================= */

function DesktopFlowArrow({
  delay,
  prefersReducedMotion,
}: {
  delay: number;
  prefersReducedMotion: boolean | null;
}) {
  return (
    <div className="absolute -right-4 top-1/2 z-20 hidden -translate-y-1/2 sm:block">
      <div className="relative flex w-5 items-center">
        <div className="h-px w-full bg-emerald-700/30" />

        {!prefersReducedMotion && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "350%" }}
            transition={{
              duration: 1.5,
              delay,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute left-0 h-1.5 w-1.5 bg-emerald-600"
          />
        )}

        <ArrowRight
          size={13}
          className="absolute -right-1 text-emerald-700"
          strokeWidth={1.8}
        />
      </div>
    </div>
  );
}

/* =========================================================
   VERTICAL ARROW
========================================================= */

function VerticalFlowArrow({
  delay,
  prefersReducedMotion,
}: {
  delay: number;
  prefersReducedMotion: boolean | null;
}) {
  return (
    <div className="flex justify-center py-7">
      <div className="relative flex h-10 flex-col items-center">
        <div className="h-full w-px bg-emerald-700/25" />

        {!prefersReducedMotion && (
          <motion.div
            animate={{
              y: [0, 25],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.4,
              delay,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-0 h-2 w-2 bg-emerald-600"
          />
        )}

        <div className="absolute bottom-0 flex h-6 w-6 items-center justify-center border border-emerald-700/40 bg-white text-emerald-700">
          <ArrowDown size={12} />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   FLOW PARTICLE
========================================================= */

function FlowParticle({
  delay,
  duration,
  className,
}: {
  delay: number;
  duration: number;
  className: string;
}) {
  return (
    <motion.span
      animate={{
        x: [0, 100, 200],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
      className={`absolute h-1.5 w-1.5 rounded-full bg-emerald-600 ${className}`}
    />
  );
}


function FlowParticleDown({
  delay,
  duration,
  className,
}: {
  delay: number;
  duration: number;
  className: string;
}) {
  return (
    <motion.span
      animate={{
        y: [0, 100, 200],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
      className={`absolute h-1.5 w-1.5 rounded-full bg-emerald-600 ${className}`}
    />
  );
}




function FlowParticleLeft({
  delay,
  duration,
  className,
}: {
  delay: number;
  duration: number;
  className: string;
}) {
  return (
    <motion.span
      animate={{
        x: [0, -100, -200],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
      className={`absolute h-1.5 w-1.5 rounded-full bg-emerald-600 ${className}`}
    />
  );
}


/* =========================================================
   LABEL
========================================================= */

function FlowLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="flex h-6 w-6 items-center justify-center border border-emerald-700/40 bg-emerald-50 text-[9px] font-medium text-emerald-800">
        {number}
      </span>

      <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </span>

      <div className="h-px flex-1 bg-emerald-700/15" />
    </div>
  );
}

/* =========================================================
   SCORE BOX
========================================================= */

function ScoreBox({ label }: { label: string }) {
  return (
    <motion.span
      animate={{
        y: [0, -2, 0],
      }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="flex h-9 w-9 items-center justify-center border border-zinc-600 bg-zinc-900 text-xs font-medium text-white shadow-[0_3px_8px_rgba(0,0,0,0.25)]"
    >
      {label}
    </motion.span>
  );
}

/* =========================================================
   OUTPUT
========================================================= */

function OutputCard({
  icon: Icon,
  title,
  description,
  delay,
  prefersReducedMotion,
}: {
  icon: typeof FileText;
  title: string;
  description: string;
  delay: number;
  prefersReducedMotion: boolean | null;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: prefersReducedMotion ? 0 : 12,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.3,
      }}
      transition={{
        duration: 0.5,
        delay,
      }}
      className="relative"
    >
      {/* 3D depth */}
      <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 border border-emerald-700/20 bg-emerald-50" />

      <div className="relative border border-zinc-300 bg-zinc-50 p-5 shadow-[0_8px_20px_rgba(6,78,59,0.07)]">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-none items-center justify-center border border-emerald-700/40 bg-white text-emerald-800">
            <Icon size={18} strokeWidth={2} />
          </div>

          <div>
            <h3 className="text-sm font-medium text-zinc-950">{title}</h3>

            <p className="mt-2 text-xs font-medium leading-5 text-zinc-600">
              {description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}



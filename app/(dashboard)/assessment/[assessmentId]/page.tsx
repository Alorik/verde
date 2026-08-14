"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Assessment = {
  id: string;
  name: string;
  reportingYear: number;
  status: string;
  description: string | null;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
};

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-zinc-100 text-zinc-600 border-zinc-200",
  in_review: "bg-amber-50 text-amber-700 border-amber-200",
  submitted: "bg-blue-50 text-blue-700 border-blue-200",
  complete: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function statusLabel(status: string) {
  return status.replace(/_/g, " ");
}

function statusStyle(status: string) {
  return STATUS_STYLES[status.toLowerCase()] ?? STATUS_STYLES.draft;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AssessmentDetail({
  params,
}: {
  params: Promise<{ assessmentId: string }>;
}) {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    async function loadAssessments() {
  const { assessmentId } = await params;

  const response = await fetch(`/api/assessments/${assessmentId}`);
      if (!response.ok) {
        console.error("failed to load assessment");
        return;
      }

      const data = await response.json();

      setAssessment(data.assessment);
    }
    loadAssessments();
  }, [params]);

  if (!assessment) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <motion.div
          animate={
            prefersReducedMotion ? undefined : { opacity: [0.3, 0.7, 0.3] }
          }
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-3 font-mono text-xs tracking-wide text-zinc-400"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          retrieving record…
        </motion.div>
      </div>
    );
  }

  const referenceNumber = `AST-${assessment.id.slice(-6).toUpperCase().padStart(6, "0")}`;

  const fields: { label: string; value: string }[] = [
    { label: "Reporting year", value: assessment.reportingYear.toString() },
  ];

  const listVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.09,
        delayChildren: 0.55,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-8 py-20">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href={`/organizations/${assessment.organizationId}`}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-zinc-400 transition hover:text-emerald-600"
          >
            <svg
              className="h-3 w-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Organization record
          </Link>
        </motion.div>

        {/* Eyebrow + stamp row */}
        <div className="mt-5 flex items-start justify-between">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400"
          >
            Assessment record
          </motion.p>

          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 1.5, rotate: -8 }
            }
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            transition={{
              duration: 0.5,
              delay: 0.15,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="rounded-sm border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-mono text-[11px] font-medium tracking-wide text-emerald-700"
          >
            {referenceNumber}
          </motion.div>
        </div>

        {/* Title + status */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-serif text-4xl tracking-tight text-zinc-900"
            style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
          >
            {assessment.name}
          </motion.h1>

          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[11px] font-medium capitalize tracking-wide ${statusStyle(
              assessment.status,
            )}`}
          >
            {statusLabel(assessment.status)}
          </motion.span>
        </div>

        {/* Drawn rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
          style={{ transformOrigin: "left" }}
          className="mt-8 h-px w-full bg-zinc-200"
        />

        {/* Field list */}
        <motion.dl
          variants={listVariants}
          initial="hidden"
          animate="show"
          className="mt-2"
        >
          {fields.map((field) => (
            <motion.div
              key={field.label}
              variants={rowVariants}
              className="flex items-baseline justify-between border-b border-zinc-100 py-4"
            >
              <dt className="font-mono text-[11px] uppercase tracking-widest text-zinc-400">
                {field.label}
              </dt>
              <dd className="text-right text-base text-zinc-900">
                {field.value}
              </dd>
            </motion.div>
          ))}
        </motion.dl>

        {/* Description — prose, not a field row */}
        {assessment.description && (
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8"
          >
            <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-400">
              Description
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">
              {assessment.description}
            </p>
          </motion.div>
        )}

        {/* Filed footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[11px] text-zinc-400"
        >
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            on file · {assessment.id}
          </span>
          <span>filed {formatDate(assessment.createdAt)}</span>
          <span>updated {formatDate(assessment.updatedAt)}</span>
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

type Organization = {
  id: string;
  name: string;
  industry: string;
  employeeCount: number;
  country: string;
  city: string | null;
  assessments: Assessment[];
};

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

export default function OrganizationDetail({
  params,
}: {
  params: Promise<{ organizationId: string }>;
}) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    async function loadOrganization() {
      const { organizationId } = await params;

      const response = await fetch(`/api/organizations/${organizationId}`);

      if (!response.ok) {
        console.error("failed to load organization");
        return;
      }

      const data = await response.json();

      setOrganization(data.organization);
    }

    loadOrganization();
  }, [params]);

  if (!organization) {
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

  const referenceNumber = `ORG-${organization.id.slice(-6).toUpperCase().padStart(6, "0")}`;

  const fields: { label: string; value: string }[] = [
    { label: "Industry", value: organization.industry },
    {
      label: "Employees",
      value: organization.employeeCount.toLocaleString(),
    },
    { label: "Country", value: organization.country },
    { label: "City", value: organization.city ?? "Not on file" },
    {
      label: "Assessments",
      value: organization.assessments.length.toString(),
    },
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
        {/* Eyebrow + stamp row */}
        <div className="flex items-start justify-between">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400"
          >
            Organization record
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

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 font-serif text-4xl tracking-tight text-zinc-900"
          style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
        >
          {organization.name}
        </motion.h1>

        {/* Drawn rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
          style={{ transformOrigin: "left" }}
          className="mt-8 h-px w-full bg-zinc-200"
        />

        {/* Field list — filled in row by row */}
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

        {/* Assessments */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-16"
        >
          <div className="flex items-end justify-between border-b border-zinc-200 pb-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                Assessments
              </p>

              <h2 className="mt-2 font-serif text-2xl tracking-tight text-zinc-900">
                ESG Assessments
              </h2>
            </div>

            <span className="font-mono text-xs text-zinc-400">
              {organization.assessments.length} total
            </span>
          </div>

          <div className="divide-y divide-zinc-100">
            {organization.assessments.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-zinc-400">
                  No assessments created yet.
                </p>
              </div>
            ) : (
              organization.assessments.map((assessment) => (
                <Link
                  key={assessment.id}
                  href={`/assessment/${assessment.id}`}
                  className="group flex items-center justify-between py-6 transition-colors hover:bg-zinc-50"
                >
                  <div>
                    <h3 className="text-lg font-medium text-zinc-900">
                      {assessment.name}
                    </h3>

                    {assessment.description && (
                      <p className="mt-1 text-sm text-zinc-500">
                        {assessment.description}
                      </p>
                    )}

                    <div className="mt-3 flex items-center gap-4 font-mono text-[11px] uppercase tracking-wider text-zinc-400">
                      <span>Reporting year: {assessment.reportingYear}</span>

                      <span>·</span>

                      <span>
                        Created{" "}
                        {new Date(assessment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <span
                      className={`rounded-full px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-wider ${
                        assessment.status === "DRAFT"
                          ? "bg-amber-50 text-amber-700"
                          : assessment.status === "COMPLETED"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {assessment.status}
                    </span>

                    <span className="text-zinc-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-zinc-600">
                      →
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </motion.section>

        {/* Filed footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="mt-10 flex items-center gap-2 font-mono text-[11px] text-zinc-400"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          on file · {organization.id}
        </motion.div>
      </div>
    </div>
  );
}

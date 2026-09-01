"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";

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

type Organization = {
  id: string;
  name: string;
  industry: string;
  employeeCount: number;
  country: string;
  city: string | null;
  assessments: Assessment[];
};

const STATUS_OPTIONS = ["DRAFT", "IN_PROGRESS", "UNDER_REVIEW", "COMPLETED"]; // verify against your Prisma enum

export default function OrganizationDashboard() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  const [organization, setOrganization] = useState<Organization | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newYear, setNewYear] = useState(new Date().getFullYear().toString());
  const [newStatus, setNewStatus] = useState("DRAFT");
  const [newDescription, setNewDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadOrganization() {
      try {
        const response = await fetch("/api/organizations");

        if (!response.ok) {
          console.error("Failed to load organization");
          return;
        }

        const data = await response.json();

        if (!cancelled) {
          setOrganization(data.organization);
        }
      } catch (error) {
        console.error("Failed to load organization:", error);
      }
    }

    loadOrganization();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreateAssessment() {
    if (!organization) return;
    setCreating(true);
    setCreateError(null);

    const response = await fetch("/api/assessments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        reportingYear: Number(newYear),
        status: newStatus,
        description: newDescription.trim() || undefined,
        organizationId: organization.id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setCreateError(data.message ?? "Failed to create assessment");
      setCreating(false);
      return;
    }

    router.push(`/assessment/${data.assessment.id}`);
  }

  if (!organization) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100">
        <motion.div
          animate={
            prefersReducedMotion ? undefined : { opacity: [0.3, 0.7, 0.3] }
          }
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-3 text-xs font-semibold tracking-wide text-zinc-600"
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

  const listVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.09,
        delayChildren: 0.55,
      },
    },
  };

  const rowVariants: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div className=" bg-zinc-100 px-12">
      <div className="mx-12 border-x border-zinc-300 bg-white py-10 sm:px-10 ">
        {/* Eyebrow + stamp row */}
        <div className="flex items-start justify-between">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600"
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
            className="border border-emerald-700 bg-emerald-50 px-3 py-1.5 text-[11px] font-bold tracking-wide text-emerald-800"
          >
            {referenceNumber}
          </motion.div>
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 text-4xl font-bold tracking-tight text-zinc-950"
        >
          {organization.name}
        </motion.h1>

        {/* Drawn rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
          style={{ transformOrigin: "left" }}
          className="mt-8 h-1 w-full bg-zinc-900"
        />

        {/* Field list */}
        <motion.dl
          variants={listVariants}
          initial="hidden"
          animate="show"
          className="mt-8 grid border-l border-t border-zinc-300 sm:grid-cols-2"
        >
          {fields.map((field) => (
            <motion.div
              key={field.label}
              variants={rowVariants}
              className="flex min-h-28 flex-col justify-between border-b border-r border-zinc-300 bg-zinc-50 p-5 sm:min-h-32"
            >
              <dt className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">
                {field.label}
              </dt>
              <dd className="mt-4 text-lg font-semibold text-zinc-950">
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
          className="mt-14"
        >
          <div className="flex flex-col gap-5 border border-zinc-300 bg-zinc-950 p-5 text-white sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                Assessments
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
                ESG Assessments
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-zinc-300">
                {organization.assessments.length} total
              </span>

              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-1.5 border border-white bg-white px-4 py-2.5 text-xs font-bold text-zinc-950 transition hover:bg-zinc-200"
              >
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                New assessment
              </button>
            </div>
          </div>

          <div className="border-x border-b border-zinc-300 bg-white">
            {organization.assessments.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm font-medium text-zinc-600">
                  No assessments created yet.
                </p>
              </div>
            ) : (
              organization.assessments.map((assessment) => (
                <Link
                  key={assessment.id}
                  href={`/assessment/${assessment.id}`}
                  className="group flex items-center justify-between gap-5 border-b border-zinc-300 p-5 transition-colors last:border-b-0 hover:bg-emerald-50"
                >
                  <div>
                    <h3 className="text-lg font-bold text-zinc-950">
                      {assessment.name}
                    </h3>

                    {assessment.description && (
                      <p className="mt-1 text-sm font-medium text-zinc-700">
                        {assessment.description}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
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
                      className={`border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        assessment.status === "DRAFT"
                          ? "border-amber-500 bg-amber-50 text-amber-800"
                          : assessment.status === "COMPLETED"
                            ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                            : "border-zinc-400 bg-zinc-100 text-zinc-800"
                      }`}
                    >
                      {assessment.status}
                    </span>

                    <span className="text-xl font-bold text-zinc-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-zinc-950">
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
          className="mt-8 flex items-center gap-2 text-[11px] font-semibold text-zinc-600"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          on file · {organization.id}
        </motion.div>

        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-lg border border-zinc-400 bg-white p-6 shadow-2xl"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                      New record
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-zinc-950">
                      Create assessment
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="text-xl font-bold leading-none text-zinc-600 transition hover:text-zinc-950"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-8">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={`e.g. ${organization.name} FY2026 Assessment`}
                    className="mt-2 w-full border border-zinc-400 bg-white px-3 py-2.5 text-sm font-medium text-zinc-950 outline-none transition focus:border-zinc-950"
                  />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                      Reporting year
                    </label>
                    <input
                      type="number"
                      value={newYear}
                      onChange={(e) => setNewYear(e.target.value)}
                      min={2000}
                      max={2100}
                      className="mt-2 w-full border border-zinc-400 bg-white px-3 py-2.5 text-sm font-medium text-zinc-950 outline-none transition focus:border-zinc-950"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                      Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="mt-2 w-full border border-zinc-400 bg-white px-3 py-2.5 text-sm font-medium text-zinc-950 outline-none transition focus:border-zinc-950"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                    Description{" "}
                    <span className="normal-case font-medium text-zinc-500">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={3}
                    className="mt-2 w-full resize-none border border-zinc-400 bg-white px-3 py-2.5 text-sm font-medium text-zinc-950 outline-none transition focus:border-zinc-950"
                  />
                </div>

                {createError && (
                  <p className="mt-4  text-[11px] text-red-600">
                    {createError}
                  </p>
                )}

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setNewName("");
                      setNewDescription("");
                      setCreateError(null);
                    }}
                    className="border border-zinc-500 bg-white px-5 py-2.5 text-sm font-bold text-zinc-950 transition hover:bg-zinc-100"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={!newName.trim() || !newYear || creating}
                    onClick={handleCreateAssessment}
                    className="inline-flex items-center gap-1.5 border border-emerald-950 bg-emerald-800 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-950 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {creating ? "Creating…" : "Create"}
                    {!creating && <span aria-hidden="true">→</span>}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

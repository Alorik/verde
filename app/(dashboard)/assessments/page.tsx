"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

type AssessmentStatus = "DRAFT" | "IN_PROGRESS" | "UNDER_REVIEW" | "COMPLETED";

type Assessment = {
  id: string;
  name: string;
  reportingYear: number;
  status: AssessmentStatus;
  description: string | null;
  createdAt: string;
  esgScore: {
    overallScore: number | string | null;
    environmentalScore: number | string | null;
    socialScore: number | string | null;
    governanceScore: number | string | null;
  } | null;
  _count: {
    documents: number;
  };
};

type Organization = {
  id: string;
  name: string;
  assessments: Assessment[];
};

const STATUS_STYLES: Record<AssessmentStatus, string> = {
  DRAFT: "bg-amber-50 text-amber-800 border-amber-500",
  IN_PROGRESS: "bg-blue-50 text-blue-800 border-blue-500",
  UNDER_REVIEW: "bg-violet-50 text-violet-800 border-violet-500",
  COMPLETED: "bg-emerald-50 text-emerald-800 border-emerald-600",
};

const STATUS_LABELS: Record<AssessmentStatus, string> = {
  DRAFT: "Draft",
  IN_PROGRESS: "In progress",
  UNDER_REVIEW: "Under review",
  COMPLETED: "Completed",
};

export default function AssessmentsPage() {
  const prefersReducedMotion = useReducedMotion();

  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [newName, setNewName] = useState("");
  const [newYear, setNewYear] = useState(new Date().getFullYear().toString());
  const [newDescription, setNewDescription] = useState("");

  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAssessments() {
      try {
        const response = await fetch("/api/organizations");

        if (!response.ok) {
          throw new Error("Failed to load organization");
        }

        const data = await response.json();

        if (!cancelled) {
          setOrganization(data.organization);
        }
      } catch (error) {
        console.error("Failed to load assessments:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAssessments();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreateAssessment() {
    if (!organization || !newName.trim()) return;

    setCreating(true);
    setCreateError(null);

    try {
      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName.trim(),
          reportingYear: Number(newYear),
          status: "DRAFT",
          description: newDescription.trim() || undefined,
          organizationId: organization.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setCreateError(data.message ?? "Failed to create assessment");
        return;
      }

      window.location.href = `/assessments/${data.assessment.id}`;
    } catch (error) {
      console.error(error);
      setCreateError("Something went wrong. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  function closeCreateModal() {
    if (creating) return;

    setShowCreateModal(false);
    setNewName("");
    setNewYear(new Date().getFullYear().toString());
    setNewDescription("");
    setCreateError(null);
  }

  if (loading) {
    return (
      <main className="bg-white px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="min-h-screen border-x border-emerald-700/30 bg-white px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:px-10">
          <motion.div
            animate={
              prefersReducedMotion ? undefined : { opacity: [0.3, 0.7, 0.3] }
            }
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex items-center gap-3 text-xs font-medium tracking-wide text-zinc-600"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            retrieving assessments…
          </motion.div>
        </div>
      </main>
    );
  }

  if (!organization) {
    return (
      <main className="bg-white px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="min-h-screen border-x border-emerald-700/30 bg-white px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:px-10">
          <p className="text-xs font-medium text-red-700">
            Failed to load assessments.
          </p>
        </div>
      </main>
    );
  }

  const assessments = organization.assessments;

  const completedCount = assessments.filter(
    (assessment) => assessment.status === "COMPLETED",
  ).length;

  const inProgressCount = assessments.filter(
    (assessment) => assessment.status === "IN_PROGRESS",
  ).length;

  return (
    <main className="bg-white px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="min-h-screen border-x border-emerald-800/30 bg-white px-4 pt-8 sm:px-6 sm:pt-10 md:px-8 lg:px-10">
        {/* Header */}
        <div className="-mx-4 sticky top-16 z-20 border-b border-emerald-800/30 bg-white px-4 pb-6 shadow-[0_3px_6px_rgba(6,95,70,0.18)] sm:-mx-6 sm:px-6 sm:pb-8 md:-mx-8 md:px-8 lg:-mx-10 lg:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <p className="px-1 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600 sm:text-[11px]">
                ESG reporting
              </p>

              <h1 className="mt-3 text-3xl font-medium tracking-tight text-zinc-950 sm:text-4xl">
                Assessments
              </h1>

              <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-zinc-700">
                Manage your organization&apos;s ESG reporting periods and track
                assessment progress.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="inline-flex w-full items-center justify-center gap-2 border border-emerald-700/30 bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-900 md:w-auto"
            >
              <span className="text-base leading-none">+</span>
              New assessment
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 grid grid-cols-1 border-l border-t border-emerald-700/30 sm:grid-cols-3">
          <div className="border-b border-r border-emerald-700/30 bg-white px-4 py-5 sm:px-5">
            <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">
              Total
            </p>

            <p className="mt-2 text-3xl font-medium text-zinc-950">
              {assessments.length}
            </p>
          </div>

          <div className="border-b border-r border-emerald-700/30 bg-white px-4 py-5 sm:px-5">
            <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">
              In progress
            </p>

            <p className="mt-2 text-3xl font-medium text-zinc-950">
              {inProgressCount}
            </p>
          </div>

          <div className="border-b border-r border-emerald-700/30 bg-white px-4 py-5 sm:px-5">
            <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">
              Completed
            </p>

            <p className="mt-2 text-3xl font-medium text-zinc-950">
              {completedCount}
            </p>
          </div>
        </div>

        {/* Assessment list */}
        <section className="mt-10 sm:mt-14">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600 sm:text-[11px]">
              Organization assessments
            </p>

            <span className="text-[10px] font-medium text-zinc-600 sm:text-[11px]">
              {assessments.length}{" "}
              {assessments.length === 1 ? "record" : "records"}
            </span>
          </div>

          {assessments.length === 0 ? (
            <div className="border border-dashed border-zinc-400 bg-white px-4 py-16 text-center sm:py-20">
              <p className="text-xl font-medium text-zinc-950">
                No assessments yet
              </p>

              <p className="mx-auto mt-2 max-w-sm text-sm font-medium leading-6 text-zinc-700">
                Create your first ESG assessment to begin collecting
                sustainability data.
              </p>

              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="mt-6 border border-emerald-700/30 bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-900"
              >
                Create assessment →
              </button>
            </div>
          ) : (
            <div className="border border-emerald-700/30 bg-white">
              {assessments.map((assessment) => (
                <Link
                  key={assessment.id}
                  href={`/assessments/${assessment.id}`}
                  className="group block border-b border-emerald-700/30 px-4 py-5 transition-colors last:border-b-0 hover:bg-emerald-50 sm:px-5 sm:py-6"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    {/* Assessment info */}
                    <div className="min-w-0">
                      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
                        <h2 className="max-w-full break-words text-base font-medium text-zinc-950 sm:text-lg">
                          {assessment.name}
                        </h2>

                        <span
                          className={`shrink-0 border px-2.5 py-1 text-[9px] font-medium uppercase tracking-wider sm:text-[10px] ${
                            STATUS_STYLES[assessment.status]
                          }`}
                        >
                          {STATUS_LABELS[assessment.status]}
                        </span>
                      </div>

                      {assessment.description && (
                        <p className="mt-2 max-w-2xl break-words text-sm font-medium leading-6 text-zinc-700">
                          {assessment.description}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-medium uppercase tracking-wider text-zinc-600 sm:gap-x-4 sm:text-[11px]">
                        <span>Reporting year {assessment.reportingYear}</span>

                        <span className="hidden sm:inline">·</span>

                        <span>
                          {assessment._count.documents}{" "}
                          {assessment._count.documents === 1
                            ? "document"
                            : "documents"}
                        </span>

                        <span className="hidden sm:inline">·</span>

                        <span>
                          Created{" "}
                          {new Date(assessment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Score + arrow */}
                    <div className="flex shrink-0 items-center justify-between border-t border-zinc-200 pt-4 md:border-0 md:pt-0 md:justify-end md:gap-5">
                      {assessment.esgScore?.overallScore != null ? (
                        <div className="text-left md:text-right">
                          <p className="text-[9px] font-medium uppercase tracking-widest text-zinc-600">
                            ESG score
                          </p>

                          <p className="mt-1 text-xl font-medium text-zinc-950">
                            {Number(assessment.esgScore.overallScore).toFixed(
                              1,
                            )}
                          </p>
                        </div>
                      ) : (
                        <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                          No score
                        </span>
                      )}

                      <span className="text-xl font-medium text-zinc-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-zinc-950">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Create modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/20 p-4 sm:p-6"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  closeCreateModal();
                }
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{
                  duration: 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="my-auto w-full max-w-lg border border-zinc-400 bg-white p-4 shadow-2xl sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">
                      New record
                    </p>

                    <h2 className="mt-2 text-xl font-medium tracking-tight text-zinc-950 sm:text-2xl">
                      Create assessment
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={closeCreateModal}
                    className="shrink-0 text-xl font-medium leading-none text-zinc-600 transition hover:text-zinc-950"
                  >
                    ×
                  </button>
                </div>

                {/* Name */}
                <div className="mt-6 sm:mt-8">
                  <label
                    htmlFor="assessment-name"
                    className="text-[10px] font-medium uppercase tracking-widest text-zinc-600"
                  >
                    Name
                  </label>

                  <input
                    id="assessment-name"
                    type="text"
                    value={newName}
                    onChange={(event) => setNewName(event.target.value)}
                    placeholder={`e.g. ${organization.name} FY2026 Assessment`}
                    className="mt-2 w-full border border-zinc-400 bg-white px-3 py-2.5 text-sm font-medium text-zinc-950 outline-none transition focus:border-emerald-700/30"
                  />
                </div>

                {/* Year */}
                <div className="mt-5">
                  <label
                    htmlFor="assessment-year"
                    className="text-[10px] font-medium uppercase tracking-widest text-zinc-600"
                  >
                    Reporting year
                  </label>

                  <input
                    id="assessment-year"
                    type="number"
                    value={newYear}
                    onChange={(event) => setNewYear(event.target.value)}
                    min={2000}
                    max={2100}
                    className="mt-2 w-full border border-zinc-400 bg-white px-3 py-2.5 text-sm font-medium text-zinc-950 outline-none transition focus:border-emerald-700/30"
                  />
                </div>

                {/* Description */}
                <div className="mt-5">
                  <label
                    htmlFor="assessment-description"
                    className="text-[10px] font-medium uppercase tracking-widest text-zinc-600"
                  >
                    Description{" "}
                    <span className="normal-case font-medium text-zinc-500">
                      (optional)
                    </span>
                  </label>

                  <textarea
                    id="assessment-description"
                    value={newDescription}
                    onChange={(event) => setNewDescription(event.target.value)}
                    rows={3}
                    placeholder="Briefly describe this reporting period..."
                    className="mt-2 w-full resize-none border border-zinc-400 bg-white px-3 py-2.5 text-sm font-medium text-zinc-950 outline-none transition focus:border-emerald-700/30"
                  />
                </div>

                {createError && (
                  <p className="mt-4 text-[11px] text-red-600">{createError}</p>
                )}

                <div className="mt-6 flex flex-col-reverse gap-3 sm:mt-8 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeCreateModal}
                    disabled={creating}
                    className="border border-zinc-500 bg-white px-5 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-white disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={
                      !newName.trim() ||
                      !newYear ||
                      Number(newYear) < 2000 ||
                      Number(newYear) > 2100 ||
                      creating
                    }
                    onClick={handleCreateAssessment}
                    className="inline-flex items-center justify-center gap-1.5 border border-emerald-950 bg-emerald-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-950 disabled:cursor-not-allowed disabled:opacity-40"
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
    </main>
  );
}

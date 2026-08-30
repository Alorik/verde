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
  DRAFT: "bg-amber-50 text-amber-700 border-amber-100",
  IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-100",
  UNDER_REVIEW: "bg-violet-50 text-violet-700 border-violet-100",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-100",
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

      // Go directly to the newly created assessment.
      window.location.href = `/assessment/${data.assessment.id}`;
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
      <main className="min-h-screen bg-white">
        <div className="mx-24 min-h-screen border-x border-zinc-200">
          <div className="mx-auto max-w-5xl px-8 py-20">
            <motion.div
              animate={
                prefersReducedMotion ? undefined : { opacity: [0.3, 0.7, 0.3] }
              }
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex items-center gap-3 text-xs tracking-wide text-zinc-400"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              retrieving assessments…
            </motion.div>
          </div>
        </div>
      </main>
    );
  }

  if (!organization) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-24 min-h-screen border-x border-zinc-200">
          <div className="mx-auto max-w-5xl px-8 py-20">
            <p className="text-xs text-red-600">
              Failed to load assessments.
            </p>
          </div>
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
    <main className="min-h-screen bg-white">
      <div className="mx-24 min-h-screen border-x border-zinc-200">
        <div className="mx-auto max-w-5xl px-8 py-20">
          {/* Header */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                ESG reporting
              </p>

              <h1 className="mt-3  text-4xl tracking-tight text-zinc-900">
                Assessments
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
                Manage your organization&apos;s ESG reporting periods and track
                assessment progress.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 rounded-sm bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              <span className="text-base leading-none">+</span>
              New assessment
            </button>
          </div>

          {/* Summary */}
          <div className="mt-12 grid grid-cols-3 border-y border-zinc-200">
            <div className="border-r border-zinc-200 px-5 py-5">
              <p className="text-[10px] uppercase tracking-widest text-zinc-400">
                Total
              </p>

              <p className="mt-2 text-2xl font-medium text-zinc-900">
                {assessments.length}
              </p>
            </div>

            <div className="border-r border-zinc-200 px-5 py-5">
              <p className="text-[10px] uppercase tracking-widest text-zinc-400">
                In progress
              </p>

              <p className="mt-2 text-2xl font-medium text-zinc-900">
                {inProgressCount}
              </p>
            </div>

            <div className="px-5 py-5">
              <p className="text-[10px] uppercase tracking-widest text-zinc-400">
                Completed
              </p>

              <p className="mt-2 text-2xl font-medium text-zinc-900">
                {completedCount}
              </p>
            </div>
          </div>

          {/* Assessment list */}
          <section className="mt-14">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                  Organization assessments
                </p>
              </div>

              <span className="text-[11px] text-zinc-400">
                {assessments.length}{" "}
                {assessments.length === 1 ? "record" : "records"}
              </span>
            </div>

            {assessments.length === 0 ? (
              <div className="border border-dashed border-zinc-300 py-20 text-center">
                <p className=" text-xl text-zinc-800">
                  No assessments yet
                </p>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                  Create your first ESG assessment to begin collecting
                  sustainability data.
                </p>

                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="mt-6 rounded-sm bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
                >
                  Create assessment →
                </button>
              </div>
            ) : (
              <div className="divide-y divide-zinc-200 border-y border-zinc-200">
                {assessments.map((assessment) => (
                  <Link
                    key={assessment.id}
                    href={`/assessment/${assessment.id}`}
                    className="group block px-5 py-6 transition-colors hover:bg-zinc-50"
                  >
                    <div className="flex items-start justify-between gap-8">
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <h2 className="truncate text-lg font-medium text-zinc-900">
                            {assessment.name}
                          </h2>

                          <span
                            className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-wider ${
                              STATUS_STYLES[assessment.status]
                            }`}
                          >
                            {STATUS_LABELS[assessment.status]}
                          </span>
                        </div>

                        {assessment.description && (
                          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                            {assessment.description}
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] uppercase tracking-wider text-zinc-400">
                          <span>Reporting year {assessment.reportingYear}</span>

                          <span>·</span>

                          <span>
                            {assessment._count.documents}{" "}
                            {assessment._count.documents === 1
                              ? "document"
                              : "documents"}
                          </span>

                          <span>·</span>

                          <span>
                            Created{" "}
                            {new Date(
                              assessment.createdAt,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-5">
                        {assessment.esgScore?.overallScore != null ? (
                          <div className="text-right">
                            <p className="text-[9px] uppercase tracking-widest text-zinc-400">
                              ESG score
                            </p>

                            <p className="mt-1 text-xl font-medium text-zinc-900">
                              {Number(assessment.esgScore.overallScore).toFixed(
                                1,
                              )}
                            </p>
                          </div>
                        ) : (
                          <span className="text-[10px] uppercase tracking-wider text-zinc-300">
                            No score
                          </span>
                        )}

                        <span className="text-lg text-zinc-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-zinc-700">
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
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-6"
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
                  className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                        New record
                      </p>

                      <h2 className="mt-2 text-2xl tracking-tight text-zinc-900">
                        Create assessment
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={closeCreateModal}
                      className="text-xl leading-none text-zinc-400 transition hover:text-zinc-900"
                    >
                      ×
                    </button>
                  </div>

                  {/* Name */}
                  <div className="mt-8">
                    <label
                      htmlFor="assessment-name"
                      className="text-[10px] uppercase tracking-widest text-zinc-400"
                    >
                      Name
                    </label>

                    <input
                      id="assessment-name"
                      type="text"
                      value={newName}
                      onChange={(event) => setNewName(event.target.value)}
                      placeholder={`e.g. ${organization.name} FY2026 Assessment`}
                      className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
                    />
                  </div>

                  {/* Year */}
                  <div className="mt-5">
                    <label
                      htmlFor="assessment-year"
                      className="text-[10px] uppercase tracking-widest text-zinc-400"
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
                      className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
                    />
                  </div>

                  {/* Description */}
                  <div className="mt-5">
                    <label
                      htmlFor="assessment-description"
                      className="text-[10px] uppercase tracking-widest text-zinc-400"
                    >
                      Description{" "}
                      <span className="normal-case text-zinc-300">
                        (optional)
                      </span>
                    </label>

                    <textarea
                      id="assessment-description"
                      value={newDescription}
                      onChange={(event) =>
                        setNewDescription(event.target.value)
                      }
                      rows={3}
                      placeholder="Briefly describe this reporting period..."
                      className="mt-2 w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
                    />
                  </div>

                  {createError && (
                    <p className="mt-4 text-[11px] text-red-600">
                      {createError}
                    </p>
                  )}

                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={closeCreateModal}
                      disabled={creating}
                      className="rounded-sm border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-800 transition hover:border-zinc-300 disabled:opacity-50"
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
                      className="inline-flex items-center gap-1.5 rounded-sm bg-emerald-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-40"
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
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type Recommendation = {
  id: string;
  title: string;
  description: string;
  category: "ENVIRONMENT" | "SOCIAL" | "GOVERNANCE";
  priority: "HIGH" | "MEDIUM" | "LOW";
  impact: "HIGH" | "MEDIUM" | "LOW";
  reason: string;
  actions: string[];
  assessmentId: string;
  assessmentName: string;
  metric?: string;
  currentValue?: string;
  targetValue?: string;
  createdAt: string;
};

const priorityStyles = {
  HIGH: "bg-red-50 text-red-700",
  MEDIUM: "bg-amber-50 text-amber-700",
  LOW: "bg-zinc-100 text-zinc-600",
};

const categoryStyles = {
  ENVIRONMENT: "bg-emerald-50 text-emerald-700",
  SOCIAL: "bg-blue-50 text-blue-700",
  GOVERNANCE: "bg-violet-50 text-violet-700",
};

function formatCategory(category: string) {
  return category.charAt(0) + category.slice(1).toLowerCase();
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecommendations() {
      try {
        const response = await fetch("/api/recommendations");

        if (!response.ok) {
          throw new Error("Failed to load recommendations");
        }

        const data = await response.json();

        setRecommendations(data.recommendations ?? []);
      } catch (error) {
        console.error("Failed to load recommendations:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRecommendations();
  }, []);

  const highPriority = recommendations.filter(
    (recommendation) => recommendation.priority === "HIGH",
  ).length;

  const mediumPriority = recommendations.filter(
    (recommendation) => recommendation.priority === "MEDIUM",
  ).length;

  const lowPriority = recommendations.filter(
    (recommendation) => recommendation.priority === "LOW",
  ).length;

  if (loading) {
    return (
      <main className="min-h-screen border-x border-zinc-200 mx-24 bg-white">
        <div className="mx-auto max-w-5xl px-8 py-20">
          <p className="text-xs text-zinc-400">retrieving recommendations…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen border-x border-zinc-200 mx-24 bg-white">
      <div className="mx-auto max-w-5xl px-8 py-20">
        {/* Header */}
        <div className="border-b border-zinc-200 pb-8">
          <div className="flex items-end justify-between gap-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                Sustainability actions
              </p>

              <h1 className="mt-3 text-4xl tracking-tight text-zinc-900">
                Recommendations
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
                Actionable recommendations generated from your
                organization&apos;s ESG performance and assessment data.
              </p>
            </div>

            <div className="text-xs text-zinc-400">
              {recommendations.length}{" "}
              {recommendations.length === 1
                ? "recommendation"
                : "recommendations"}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="text-xs text-zinc-400">High priority</p>

            <p className="mt-2 text-2xl font-semibold text-zinc-900">
              {highPriority}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="text-xs text-zinc-400">Medium priority</p>

            <p className="mt-2 text-2xl font-semibold text-zinc-900">
              {mediumPriority}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="text-xs text-zinc-400">Low priority</p>

            <p className="mt-2 text-2xl font-semibold text-zinc-900">
              {lowPriority}
            </p>
          </div>
        </div>

        {/* Empty state */}
        {recommendations.length === 0 ? (
          <div className="py-24 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 text-xl text-zinc-400">
              ✓
            </div>

            <h2 className="mt-5 text-2xl text-zinc-900">
              No recommendations yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
              Recommendations will appear here once ESG assessment data has been
              analyzed.
            </p>

            <Link
              href="/assessments"
              className="mt-6 inline-flex rounded-sm bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              View assessments →
            </Link>
          </div>
        ) : (
          /* Recommendations */
          <section className="mt-12">
            <div className="mb-6">
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                Priority recommendations
              </p>

              <h2 className="mt-2 text-2xl tracking-tight text-zinc-900">
                Areas that need attention
              </h2>
            </div>

            <div className="space-y-5">
              {recommendations.map((recommendation, index) => (
                <motion.article
                  key={recommendation.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.06,
                  }}
                  className="rounded-xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300 hover:shadow-sm"
                >
                  {/* Top */}
                  <div className="flex items-start justify-between gap-6">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wider ${
                            priorityStyles[recommendation.priority]
                          }`}
                        >
                          {recommendation.priority} priority
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wider ${
                            categoryStyles[recommendation.category]
                          }`}
                        >
                          {formatCategory(recommendation.category)}
                        </span>
                      </div>

                      <h3 className="mt-4 text-lg font-semibold text-zinc-900">
                        {recommendation.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-zinc-500">
                        {recommendation.description}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-[10px] uppercase tracking-wider text-zinc-400">
                        Impact
                      </p>

                      <p className="mt-1 text-sm font-medium text-zinc-900">
                        {recommendation.impact}
                      </p>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="mt-6 rounded-lg border border-zinc-100 bg-zinc-50 p-4">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-400">
                      Why this matters
                    </p>

                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      {recommendation.reason}
                    </p>

                    {(recommendation.metric ||
                      recommendation.currentValue ||
                      recommendation.targetValue) && (
                      <div className="mt-4 flex flex-wrap gap-6 border-t border-zinc-200 pt-4">
                        {recommendation.metric && (
                          <div>
                            <p className="text-[10px] text-zinc-400">Metric</p>
                            <p className="mt-1 text-sm text-zinc-900">
                              {recommendation.metric}
                            </p>
                          </div>
                        )}

                        {recommendation.currentValue && (
                          <div>
                            <p className="text-[10px] text-zinc-400">Current</p>
                            <p className="mt-1 text-sm text-zinc-900">
                              {recommendation.currentValue}
                            </p>
                          </div>
                        )}

                        {recommendation.targetValue && (
                          <div>
                            <p className="text-[10px] text-zinc-400">Target</p>
                            <p className="mt-1 text-sm text-zinc-900">
                              {recommendation.targetValue}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-6">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-400">
                      Recommended actions
                    </p>

                    <div className="mt-3 space-y-2">
                      {recommendation.actions.map((action, actionIndex) => (
                        <div
                          key={actionIndex}
                          className="flex items-start gap-3 text-sm text-zinc-600"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />

                          <span>{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 flex items-center justify-between border-t border-zinc-100 pt-5">
                    <div className="text-xs text-zinc-400">
                      Assessment:{" "}
                      <span className="text-zinc-600">
                        {recommendation.assessmentName}
                      </span>
                    </div>

                    <Link
                      href={`/assessment/${recommendation.assessmentId}`}
                      className="text-xs font-medium text-zinc-500 transition hover:text-zinc-900"
                    >
                      View assessment →
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

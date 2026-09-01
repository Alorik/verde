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
  HIGH: "border-red-500 bg-red-50 text-red-800",
  MEDIUM: "border-amber-500 bg-amber-50 text-amber-800",
  LOW: "border-zinc-400 bg-zinc-100 text-zinc-800",
};

const categoryStyles = {
  ENVIRONMENT: "border-emerald-600 bg-emerald-50 text-emerald-800",
  SOCIAL: "border-blue-500 bg-blue-50 text-blue-800",
  GOVERNANCE: "border-violet-500 bg-violet-50 text-violet-800",
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
      <main className="bg-zinc-100 px-12">
        <div className="mx-12 border-x border-emerald-700/30 bg-white py-10 sm:px-10">
          <p className="text-xs font-medium text-zinc-600">retrieving recommendations…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-zinc-100 px-12">
      <div className="mx-12 border-x  bg-white py-10 sm:px-10 border-emerald-800/30 ">
        {/* Header */}
        <div className="border-b border-emerald-800/30 shadow-[0_3px_6px_rgba(6,95,70,0.18)] pb-8 -mx-10">
          <div className="flex items-end justify-between gap-8">
            <div className="mx-10">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-600 px-1">
                Sustainability actions
              </p>

              <h1 className="mt-3 text-4xl font-medium tracking-tight text-zinc-950">
                Recommendations
              </h1>

              <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-zinc-700">
                Actionable recommendations generated from your
                organization&apos;s ESG performance and assessment data.
              </p>
            </div>

            <div className="text-xs font-medium text-zinc-600 mx-10">
              {recommendations.length}{" "}
              {recommendations.length === 1
                ? "recommendation"
                : "recommendations"}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-10 grid grid-cols-3 border-l border-t border-emerald-700/30">
          <div className="border-b border-r border-emerald-700/30 bg-zinc-50 p-5">
            <p className="text-xs font-medium text-zinc-600">High priority</p>

            <p className="mt-2 text-3xl font-medium text-zinc-950">
              {highPriority}
            </p>
          </div>

          <div className="border-b border-r border-emerald-700/30 bg-zinc-50 p-5">
            <p className="text-xs font-medium text-zinc-600">Medium priority</p>

            <p className="mt-2 text-3xl font-medium text-zinc-950">
              {mediumPriority}
            </p>
          </div>

          <div className="border-b border-r border-emerald-700/30 bg-zinc-50 p-5">
            <p className="text-xs font-medium text-zinc-600">Low priority</p>

            <p className="mt-2 text-3xl font-medium text-zinc-950">
              {lowPriority}
            </p>
          </div>
        </div>

        {/* Empty state */}
        {recommendations.length === 0 ? (
          <div className="border border-dashed border-emerald-700/40 bg-zinc-50 py-24 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center border border-zinc-400 text-xl font-medium text-zinc-600">
              ✓
            </div>

            <h2 className="mt-5 text-2xl font-medium text-zinc-950">
              No recommendations yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm font-medium text-zinc-700">
              Recommendations will appear here once ESG assessment data has been
              analyzed.
            </p>

            <Link
              href="/assessments"
              className="mt-6 inline-flex border border-zinc-950 bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-900"
            >
              View assessments →
            </Link>
          </div>
        ) : (
          /* Recommendations */
          <section className="mt-12">
            <div className="mb-6">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-600">
                Priority recommendations
              </p>

              <h2 className="mt-2 text-2xl font-medium tracking-tight text-zinc-950">
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
                  className="border border-emerald-700/30 bg-white p-6 transition hover:border-emerald-500 hover:bg-emerald-50/30"
                >
                  {/* Top */}
                  <div className="flex items-start justify-between gap-6">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`border px-3 py-1 text-[10px] font-medium uppercase tracking-wider ${
                            priorityStyles[recommendation.priority]
                          }`}
                        >
                          {recommendation.priority} priority
                        </span>

                        <span
                          className={`border px-3 py-1 text-[10px] font-medium uppercase tracking-wider ${
                            categoryStyles[recommendation.category]
                          }`}
                        >
                          {formatCategory(recommendation.category)}
                        </span>
                      </div>

                      <h3 className="mt-4 text-lg font-medium text-zinc-950">
                        {recommendation.title}
                      </h3>

                      <p className="mt-2 text-sm font-medium leading-6 text-zinc-700">
                        {recommendation.description}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                        Impact
                      </p>

                      <p className="mt-1 text-sm font-medium text-zinc-950">
                        {recommendation.impact}
                      </p>
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="mt-6 border border-emerald-700/30 bg-zinc-50 p-4">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                      Why this matters
                    </p>

                    <p className="mt-2 text-sm font-medium leading-6 text-zinc-800">
                      {recommendation.reason}
                    </p>

                    {(recommendation.metric ||
                      recommendation.currentValue ||
                      recommendation.targetValue) && (
                      <div className="mt-4 flex flex-wrap gap-6 border-t border-emerald-700/30 pt-4">
                        {recommendation.metric && (
                          <div>
                            <p className="text-[10px] font-medium text-zinc-600">
                              Metric
                            </p>
                            <p className="mt-1 text-sm font-medium text-zinc-950">
                              {recommendation.metric}
                            </p>
                          </div>
                        )}

                        {recommendation.currentValue && (
                          <div>
                            <p className="text-[10px] font-medium text-zinc-600">
                              Current
                            </p>
                            <p className="mt-1 text-sm font-medium text-zinc-950">
                              {recommendation.currentValue}
                            </p>
                          </div>
                        )}

                        {recommendation.targetValue && (
                          <div>
                            <p className="text-[10px] font-medium text-zinc-600">
                              Target
                            </p>
                            <p className="mt-1 text-sm font-medium text-zinc-950">
                              {recommendation.targetValue}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-6">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                      Recommended actions
                    </p>

                    <div className="mt-3 space-y-2">
                      {recommendation.actions.map((action, actionIndex) => (
                        <div
                          key={actionIndex}
                          className="flex items-start gap-3 text-sm font-medium text-zinc-800"
                        >
                          <span className="mt-2 h-2 w-2 shrink-0 bg-emerald-600" />

                          <span>{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 flex items-center justify-between border-t border-emerald-700/30 pt-5">
                    <div className="text-xs font-medium text-zinc-600">
                      Assessment:{" "}
                      <span className="font-medium text-zinc-950">
                        {recommendation.assessmentName}
                      </span>
                    </div>

                    <Link
                      href={`/assessment/${recommendation.assessmentId}`}
                      className="border border-zinc-500 px-3 py-1.5 text-xs font-medium text-zinc-800 transition hover:border-emerald-600 hover:bg-emerald-100 hover:text-emerald-900"
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

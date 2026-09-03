"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Score = number | string | null;

type Assessment = {
  id: string;
  name: string;
  reportingYear: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  description: string | null;

  esgScore: {
    overallScore: Score;
    environmentalScore: Score;
    socialScore: Score;
    governanceScore: Score;
    calculatedAt?: string;
    metrics?: Array<Record<string, unknown>>;
  } | null;

  documents: Array<{
    id: string;
    fileName: string;
    documentType: string;
    fileSize: number;
    uploadedAt: string;
    extractionStatus: string;
    electricity: Record<string, unknown> | null;
    water: Record<string, unknown> | null;
    employeeData: Record<string, unknown> | null;
    csrReport: Record<string, unknown> | null;
    esgMetrics: Array<Record<string, unknown>>;
  }>;
};

function score(value: Score) {
  return value == null ? "—" : Number(value).toFixed(1);
}

function statusLabel(status: string) {
  return status.replace(/_/g, " ");
}

export default function ReportPage({
  params,
}: {
  params: Promise<{ assessmentId: string }>;
}) {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      try {
        const { assessmentId } = await params;

        const response = await fetch(`/api/assessments/${assessmentId}`);

        if (!response.ok) {
          throw new Error("Failed to load report");
        }

        const data = await response.json();

        setAssessment(data.assessment);
      } catch (error) {
        console.error("Failed to load report:", error);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-100 px-12">
        <div className="mx-12 border-x border-emerald-700/30 bg-white px-10 py-16">
          <p className="text-xs font-medium text-zinc-600">
            retrieving report…
          </p>
        </div>
      </main>
    );
  }

  if (!assessment) {
    return (
      <main className="min-h-screen bg-zinc-100 px-12">
        <div className="mx-12 border-x border-emerald-700/30 bg-white px-10 py-16">
          <h1 className="text-2xl font-medium text-zinc-950">
            Report not found
          </h1>

          <Link
            href="/reports"
            className="mt-6 inline-flex border border-emerald-700 bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
          >
            ← Back to reports
          </Link>
        </div>
      </main>
    );
  }

  const current = assessment.esgScore;

  return (
    <main className="min-h-screen bg-zinc-100 px-12">
      <div className="mx-12 border-x border-emerald-700/30 bg-white px-10 py-10">
        {/* Header */}
        <header className="border-b border-emerald-700/30 pb-8">
          <Link
            href="/reports"
            className="text-xs font-medium text-zinc-500 hover:text-emerald-800"
          >
            ← Back to reports
          </Link>

          <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-600">
            ESG performance report
          </p>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-medium tracking-tight text-zinc-950">
                {assessment.name}
              </h1>

              <p className="mt-3 text-sm font-medium text-zinc-600">
                Reporting year {assessment.reportingYear}
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                Overall ESG
              </p>

              <p className="mt-1 text-5xl font-medium text-emerald-800">
                {score(current?.overallScore ?? null)}
              </p>
            </div>
          </div>
        </header>

        {/* Score breakdown */}
        <section className="mt-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-600">
            Performance
          </p>

          <h2 className="mt-2 text-2xl font-medium tracking-tight text-zinc-950">
            ESG score breakdown
          </h2>

          <div className="mt-6 grid border-l border-t border-emerald-700/30 sm:grid-cols-3">
            {[
              ["Environmental", current?.environmentalScore],
              ["Social", current?.socialScore],
              ["Governance", current?.governanceScore],
            ].map(([label, value]) => (
              <div
                key={label as string}
                className="border-b border-r border-emerald-700/30 bg-zinc-50 p-6"
              >
                <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                  {label as string}
                </p>

                <p className="mt-3 text-4xl font-medium text-zinc-950">
                  {score(value as Score)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Assessment details */}
        <section className="mt-12 border border-emerald-700/30">
          <div className="border-b border-emerald-700/30 bg-zinc-950 p-5 text-sm font-medium text-white">
            Assessment details
          </div>

          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                Status
              </p>

              <p className="mt-1 text-sm font-medium text-zinc-950">
                {statusLabel(assessment.status)}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                Reporting year
              </p>

              <p className="mt-1 text-sm font-medium text-zinc-950">
                {assessment.reportingYear}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                Created
              </p>

              <p className="mt-1 text-sm font-medium text-zinc-950">
                {new Date(assessment.createdAt).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                Updated
              </p>

              <p className="mt-1 text-sm font-medium text-zinc-950">
                {new Date(assessment.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          {assessment.description && (
            <p className="border-t border-emerald-700/30 p-6 text-sm font-medium leading-6 text-zinc-700">
              {assessment.description}
            </p>
          )}
        </section>

        {/* Documents */}
        <section className="mt-12">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-600">
            Source data
          </p>

          <h2 className="mt-2 text-2xl font-medium tracking-tight text-zinc-950">
            Uploaded documents
          </h2>

          <div className="mt-6 space-y-4">
            {assessment.documents.length === 0 ? (
              <div className="border border-dashed border-emerald-700/30 bg-zinc-50 p-10 text-center">
                <p className="text-sm font-medium text-zinc-600">
                  No documents uploaded.
                </p>
              </div>
            ) : (
              assessment.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="border border-emerald-700/30 bg-zinc-50 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-zinc-950">
                        {doc.fileName}
                      </h3>

                      <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                        {doc.documentType.replace(/_/g, " ")} ·{" "}
                        {(doc.fileSize / 1024).toFixed(1)} KB
                      </p>
                    </div>

                    <span className="border border-emerald-700/30 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-zinc-700">
                      {doc.extractionStatus}
                    </span>
                  </div>

                  {[doc.electricity, doc.water, doc.employeeData, doc.csrReport]
                    .filter(Boolean)
                    .map((values, index) => (
                      <div
                        key={index}
                        className="mt-5 grid grid-cols-2 gap-3 border-t border-emerald-700/20 pt-4 text-xs"
                      >
                        {Object.entries(values as Record<string, unknown>)
                          .filter(
                            ([key]) => !["id", "documentId"].includes(key),
                          )
                          .map(([key, value]) => (
                            <p key={key}>
                              <span className="font-medium text-zinc-500">
                                {key.replace(/([A-Z])/g, " $1")}:
                              </span>{" "}
                              {String(value)}
                            </p>
                          ))}
                      </div>
                    ))}

                  {doc.esgMetrics.length > 0 && (
                    <div className="mt-5 border-t border-emerald-700/20 pt-4">
                      <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                        Calculated metrics
                      </p>

                      {doc.esgMetrics.map((metric, index) => (
                        <p
                          key={index}
                          className="mt-2 text-xs font-medium text-zinc-800"
                        >
                          {Object.entries(metric)
                            .filter(
                              ([key]) => !["id", "esgScoreId"].includes(key),
                            )
                            .map(([key, value]) => `${key}: ${String(value)}`)
                            .join(" · ")}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

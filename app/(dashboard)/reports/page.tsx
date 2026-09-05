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
  esgScore: {
    overallScore: Score;
    environmentalScore: Score;
    socialScore: Score;
    governanceScore: Score;
  } | null;
  _count: { documents: number };
};

type Organization = { name: string; assessments: Assessment[] };

type DetailAssessment = Assessment & {
  description: string | null;
  updatedAt: string;
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
  esgScore: (Assessment["esgScore"] & {
    calculatedAt?: string;
    metrics?: Array<Record<string, unknown>>;
  }) | null;
};

function score(value: Score) {
  return value == null ? "—" : Number(value).toFixed(1);
}

function statusLabel(status: string) {
  return status.replace(/_/g, " ");
}

export default function ReportsPage() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<DetailAssessment | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  async function openDetail(assessmentId: string) {
    setDetailLoading(true);
    try {
      const response = await fetch(`/api/assessments/${assessmentId}`);
      if (!response.ok) throw new Error("Failed to load detailed report");
      const data = await response.json();
      setDetail(data.assessment);
    } catch (error) {
      console.error("Failed to load detailed report:", error);
    } finally {
      setDetailLoading(false);
    }
  }

  useEffect(() => {
    async function loadReports() {
      try {
        const response = await fetch("/api/organizations");
        if (!response.ok) throw new Error("Failed to load reports");
        const data = await response.json();
        setOrganization(data.organization);
      } catch (error) {
        console.error("Failed to load reports:", error);
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  const assessments = organization?.assessments ?? [];
  const scoredAssessments = assessments.filter(
    (assessment) => assessment.esgScore?.overallScore != null,
  );
  const latest = scoredAssessments[0];
  const average = scoredAssessments.length
    ? scoredAssessments.reduce(
        (total, assessment) =>
          total + Number(assessment.esgScore?.overallScore ?? 0),
        0,
      ) / scoredAssessments.length
    : null;

  if (loading) {
    return (
      <main className="bg-zinc-100 px-12">
        <div className="border-x border-emerald-700/30 bg-white py-10 sm:px-10">
          <p className="text-xs font-medium text-zinc-600">
            retrieving reports…
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-zinc-100 px-12">
      <div className="border-x border-emerald-700/30 bg-white py-10 sm:px-10">
        <header className="border-b shadow-[0_3px_6px_rgba(6,95,70,0.18)] border-emerald-700/30 -mx-10 pb-8 top-12 sticky z-20 bg-white">
          <div className="mx-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-600">
              ESG performance
            </p>
            <h1 className="mt-3 text-4xl font-medium tracking-tight text-zinc-950">
              Reports
            </h1>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-zinc-700">
              Review score performance across{" "}
              {organization?.name ?? "your organization"}&apos;s ESG
              assessments.
            </p>
          </div>
        </header>

        <section className="mt-10 grid border-l border-t border-emerald-700/30 sm:grid-cols-3">
          {[
            [
              "Latest overall",
              latest ? score(latest.esgScore?.overallScore ?? null) : "—",
            ],
            ["Average overall", average == null ? "—" : average.toFixed(1)],
            ["Reports scored", scoredAssessments.length.toString()],
          ].map(([label, value]) => (
            <div
              key={label}
              className="border-b border-r border-emerald-700/30 bg-zinc-50 p-5"
            >
              <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">
                {label}
              </p>
              <p className="mt-2 text-3xl font-medium text-zinc-950">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-12">
          <div className=" pb-5">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-600">
              Assessment reports
            </p>
            <h2 className="mt-2 text-2xl font-medium tracking-tight text-zinc-950">
              Score breakdown
            </h2>
          </div>

          {assessments.length === 0 ? (
            <div className="mt-5 border border-dashed border-emerald-700/30 bg-zinc-50 py-20 text-center">
              <p className="text-xl font-medium text-zinc-950">
                No reports yet
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm font-medium text-zinc-700">
                Complete an assessment to generate an ESG performance report.
              </p>
              <Link
                href="/assessments"
                className="mt-6 inline-flex border border-emerald-800/30 bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-900"
              >
                View assessments →
              </Link>
            </div>
          ) : (
            <div className="mt-5 border border-emerald-700/30">
              {assessments.map((assessment) => {
                const current = assessment.esgScore;
                return (
                  <article
                    key={assessment.id}
                    className="border-b border-emerald-700/30 p-5 last:border-b-0 hover:bg-emerald-50/40"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-5">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-medium text-zinc-950">
                            {assessment.name}
                          </h3>
                          <span className="border border-emerald-700/30 bg-zinc-100 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-zinc-700">
                            {statusLabel(assessment.status)}
                          </span>
                        </div>
                        <p className="mt-2 text-xs font-medium uppercase tracking-wider text-zinc-600">
                          Reporting year {assessment.reportingYear} ·{" "}
                          {assessment._count.documents}{" "}
                          {assessment._count.documents === 1
                            ? "document"
                            : "documents"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">
                          Overall ESG
                        </p>
                        <p className="mt-1 text-3xl font-medium text-zinc-950">
                          {score(current?.overallScore ?? null)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 grid grid-cols-3 border-l border-t border-emerald-700/30">
                      {[
                        ["Environmental", current?.environmentalScore],
                        ["Social", current?.socialScore],
                        ["Governance", current?.governanceScore],
                      ].map(([label, value]) => (
                        <div
                          key={label as string}
                          className="border-b border-r border-emerald-700/30 bg-zinc-50 p-3"
                        >
                          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                            {label as string}
                          </p>
                          <p className="mt-1 text-lg font-medium text-zinc-950">
                            {score(value as Score)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href={`/assessments/${assessment.id}`}
                        className="inline-flex border border-zinc-500 px-3 py-1.5 text-xs font-medium text-zinc-800 hover:border-emerald-600 hover:bg-emerald-100 hover:text-emerald-900"
                      >
                        View assessment →
                      </Link>
                      <Link
                        href={`/reports/${assessment.id}`}
                        className="border border-emerald-700 bg-emerald-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-950"
                      >
                        View detailed report →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {(detailLoading || detail) && (
          <div
            className="fixed inset-0 z-50 flex justify-end bg-zinc-950/30"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setDetail(null);
            }}
          >
            <aside className="h-full w-full max-w-2xl overflow-y-auto border-l border-emerald-700/30 bg-white p-6 shadow-2xl sm:p-10">
              <div className="flex items-start justify-between border border-emerald-700/30  pb-5">
                <div className="p-4">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">
                    Detailed report
                  </p>
                  <h2 className="mt-2 text-2xl font-medium text-zinc-950">
                    {detail?.name ?? "Loading report…"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setDetail(null)}
                  className="border border-emerald-800/30 px-3 py-1 text-lg font-medium text-zinc-700 hover:bg-zinc-100"
                  aria-label="Close detailed report"
                >
                  ×
                </button>
              </div>

              {detailLoading && !detail ? (
                <p className="mt-8 text-sm font-medium text-zinc-600">
                  Loading report details…
                </p>
              ) : detail ? (
                <div className="mt-6 space-y-8">
                  <div className="grid grid-cols-2 border-l border-t border-emerald-700/30 sm:grid-cols-4">
                    {[
                      ["Overall", detail.esgScore?.overallScore],
                      ["Environmental", detail.esgScore?.environmentalScore],
                      ["Social", detail.esgScore?.socialScore],
                      ["Governance", detail.esgScore?.governanceScore],
                    ].map(([label, value]) => (
                      <div
                        key={label as string}
                        className="border-b border-r border-emerald-700/30 bg-zinc-50 p-3 "
                      >
                        <p className="text-[9px] font-medium uppercase tracking-wider text-zinc-600">
                          {label as string}
                        </p>
                        <p className="mt-1 text-xl font-medium text-zinc-950">
                          {score(value as Score)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border border-emerald-700/30">
                    <div className="border-b border-emerald-700/30 bg-zinc-950 p-4 text-sm font-medium text-white">
                      Assessment details
                    </div>
                    <div className="grid gap-3 p-4 text-sm sm:grid-cols-2">
                      <p>
                        <span className="font-medium text-zinc-600">
                          Status:
                        </span>{" "}
                        {statusLabel(detail.status)}
                      </p>
                      <p>
                        <span className="font-medium text-zinc-600">
                          Reporting year:
                        </span>{" "}
                        {detail.reportingYear}
                      </p>
                      <p>
                        <span className="font-medium text-zinc-600">
                          Created:
                        </span>{" "}
                        {new Date(detail.createdAt).toLocaleString()}
                      </p>
                      <p>
                        <span className="font-medium text-zinc-600">
                          Updated:
                        </span>{" "}
                        {new Date(detail.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    {detail.description && (
                      <p className="border-t border-emerald-700/30 p-4 text-sm font-medium text-zinc-800">
                        {detail.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="border-b border-emerald-700/30 pb-3 text-lg font-medium text-zinc-950">
                      Uploaded documents
                    </h3>
                    <div className="mt-4 space-y-3">
                      {detail.documents.length === 0 ? (
                        <p className="text-sm font-medium text-zinc-600">
                          No documents uploaded.
                        </p>
                      ) : (
                        detail.documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="border border-emerald-700/30 bg-zinc-50 p-4"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <p className="text-sm font-medium text-zinc-950">
                                {doc.fileName}
                              </p>
                              <span className="border border-emerald-700/30 px-2 py-1 text-[10px] font-medium uppercase text-zinc-700">
                                {doc.extractionStatus}
                              </span>
                            </div>
                            <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-zinc-600">
                              {doc.documentType.replace(/_/g, " ")} ·{" "}
                              {(doc.fileSize / 1024).toFixed(1)} KB · Uploaded{" "}
                              {new Date(doc.uploadedAt).toLocaleString()}
                            </p>
                            {[
                              doc.electricity,
                              doc.water,
                              doc.employeeData,
                              doc.csrReport,
                            ]
                              .filter(Boolean)
                              .map((values, index) => (
                                <div
                                  key={index}
                                  className="mt-3 grid grid-cols-2 gap-2 border-t border-emerald-700/30 pt-3 text-xs"
                                >
                                  {Object.entries(
                                    values as Record<string, unknown>,
                                  )
                                    .filter(
                                      ([key]) =>
                                        !["id", "documentId"].includes(key),
                                    )
                                    .map(([key, value]) => (
                                      <p key={key}>
                                        <span className="font-medium text-zinc-600">
                                          {key.replace(/([A-Z])/g, " $1")}:
                                        </span>{" "}
                                        {String(value)}
                                      </p>
                                    ))}
                                </div>
                              ))}
                            {doc.esgMetrics.length > 0 && (
                              <div className="mt-3 border-t border-emerald-700/30 pt-3">
                                <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                                  Calculated metrics
                                </p>
                                {doc.esgMetrics.map((metric, index) => (
                                  <p
                                    key={index}
                                    className="mt-1 text-xs font-medium text-zinc-800"
                                  >
                                    {Object.entries(metric)
                                      .filter(
                                        ([key]) =>
                                          !["id", "esgScoreId"].includes(key),
                                      )
                                      .map(
                                        ([key, value]) =>
                                          `${key}: ${String(value)}`,
                                      )
                                      .join(" · ")}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

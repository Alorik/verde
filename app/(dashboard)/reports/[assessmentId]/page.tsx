"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import {
  FileText,
  Database,
  CalendarDays,
  Activity,
  Leaf,
  Users,
  ShieldCheck,
  ArrowUpRight,
  Download
} from "lucide-react";

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

function getScoreTone(value: Score) {
  if (value == null || Number.isNaN(Number(value))) {
    return {
      text: "text-zinc-500",
      bg: "bg-zinc-50",
      border: "border-zinc-300",
      layer: "bg-zinc-100",
      badge: "bg-zinc-50 text-zinc-500 border-zinc-300",
    };
  }

  const numericValue = Number(value);

  if (numericValue < 50) {
    return {
      text: "text-rose-700",
      bg: "bg-rose-50",
      border: "border-rose-500/40",
      layer: "bg-rose-100 border-rose-500/20",
      badge: "bg-rose-50 text-rose-700 border-rose-500/30",
    };
  }

  if (numericValue <= 75) {
    return {
      text: "text-amber-700",
      bg: "bg-amber-50",
      border: "border-amber-500/40",
      layer: "bg-amber-100 border-amber-500/20",
      badge: "bg-amber-50 text-amber-700 border-amber-500/30",
    };
  }

  return {
    text: "text-emerald-800",
    bg: "bg-emerald-50",
    border: "border-emerald-700/40",
    layer: "bg-emerald-100 border-emerald-700/20",
    badge: "bg-emerald-50 text-emerald-800 border-emerald-700/30",
  };
}

function statusLabel(status: string) {
  return status.replace(/_/g, " ");
}

export default function ReportPage({
  params,
}: {
  params: Promise<{ assessmentId: string }>;
  }) {
  
  const handleDownloadPDF = () => {
    window.print();
  };
  
  
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
            className="mt-6  inline-flex border border-emerald-700 bg-zinc-950 px-4 py-2 text-sm font-medium text-white"
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
      <div className="mx-12 min-h-screen border-x border-emerald-700/30 bg-white px-10 py-10">
        {/* =========================================================
            HEADER
        ========================================================= */}

        <header className="relative -mx-10 border-b border-emerald-700/30 bg-white pb-10 sticky top-16 z-999 print:static print:mx-0 print:border-b print:bg-white">
          <div className="mx-10">
            {" "}
            <div className="mt-6 flex items-center gap-3 print:hidden">
              <Link
                href="/reports"
                className="inline-flex items-center border border-emerald-700/30 px-4 py-2 text-sm font-medium transition hover:border-emerald-700 hover:bg-emerald-50"
              >
                ← Back to reports
              </Link>

              <button
                type="button"
                onClick={handleDownloadPDF}
                className="inline-flex items-center gap-2 border border-emerald-700 bg-emerald-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"
              >
                <Download size={14} />
                Download PDF
              </button>
            </div>
            <div className="mt-4 flex flex-col justify-between gap-10 md:flex-row md:items-end">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-emerald-800">
                  ESG performance report
                </p>

                <h1 className="mt-3 text-5xl font-medium tracking-tight text-zinc-950">
                  {assessment.name}
                </h1>

                <div className="mt-4 flex items-center gap-4 text-xs font-medium text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={13} />
                    Reporting year {assessment.reportingYear}
                  </span>

                  <span className="h-1 w-1 bg-emerald-700" />

                  <span className="uppercase tracking-wider">
                    {statusLabel(assessment.status)}
                  </span>
                </div>
              </div>

              {/* Main score */}
              {/* Main score */}
              {(() => {
                const overallTone = getScoreTone(current?.overallScore ?? null);

                return (
                  <div className="relative w-fit">
                    {/* 3D depth */}
                    <div
                      className={`absolute inset-0 translate-x-2 translate-y-2 border ${overallTone.layer}`}
                    />

                    <div
                      className={`relative flex min-w-[150px] flex-col border-2 ${overallTone.border} ${overallTone.bg} p-5 shadow-[0_15px_35px_rgba(6,78,59,0.14)]`}
                    >
                      <p
                        className={`text-[9px] font-medium uppercase tracking-[0.2em] ${overallTone.text}`}
                      >
                        Overall ESG
                      </p>

                      <p
                        className={`mt-1 text-5xl font-medium tracking-tight ${overallTone.text}`}
                      >
                        {score(current?.overallScore ?? null)}
                      </p>

                      <div className="mt-2 flex items-center gap-1 text-[9px] font-medium uppercase tracking-widest text-zinc-500">
                        <Activity size={11} />
                        Overall score
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </header>

        {/* =========================================================
            SCORE BREAKDOWN
        ========================================================= */}

        <section className="mt-14">
          <SectionHeading
            eyebrow="01 / Performance"
            title="ESG score breakdown"
            description="Performance across the three core sustainability dimensions."
          />

          <div className="mt-7 grid gap-5 md:grid-cols-3">
            <ScoreCard
              letter="E"
              title="Environmental"
              value={current?.environmentalScore ?? null}
              icon={Leaf}
              description="Environmental impact and resource performance."
            />

            <ScoreCard
              letter="S"
              title="Social"
              value={current?.socialScore ?? null}
              icon={Users}
              description="People, workforce and social responsibility."
            />

            <ScoreCard
              letter="G"
              title="Governance"
              value={current?.governanceScore ?? null}
              icon={ShieldCheck}
              description="Governance, ethics and compliance."
            />
          </div>
        </section>

        {/* =========================================================
            DETAILS
        ========================================================= */}

        <section className="mt-16">
          <SectionHeading
            eyebrow="02 / Assessment"
            title="Assessment details"
            description="Metadata and context associated with this assessment."
          />

          <div className="relative mt-7">
            {/* 3D layer */}
            <div className="absolute inset-0 translate-x-2 translate-y-2 border border-emerald-700/20 bg-emerald-50" />

            <div className="relative border border-zinc-300 bg-white shadow-[0_12px_30px_rgba(6,78,59,0.07)]">
              <div className="grid sm:grid-cols-2">
                <DetailItem
                  icon={Activity}
                  label="Status"
                  value={statusLabel(assessment.status)}
                />

                <DetailItem
                  icon={CalendarDays}
                  label="Reporting year"
                  value={String(assessment.reportingYear)}
                />

                <DetailItem
                  icon={CalendarDays}
                  label="Created"
                  value={new Date(assessment.createdAt).toLocaleString()}
                />

                <DetailItem
                  icon={Activity}
                  label="Last updated"
                  value={new Date(assessment.updatedAt).toLocaleString()}
                />
              </div>

              {assessment.description && (
                <div className="border-t border-emerald-700/20 bg-zinc-50 p-6">
                  <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                    Description
                  </p>

                  <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-zinc-700">
                    {assessment.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =========================================================
            DOCUMENTS
        ========================================================= */}

        <section className="mt-16">
          <SectionHeading
            eyebrow="03 / Source data"
            title="Uploaded documents"
            description="Documents used to calculate this ESG assessment."
          />

          <div className="mt-7 space-y-6">
            {assessment.documents.length === 0 ? (
              <div className="border border-dashed border-emerald-700/30 bg-zinc-50 p-10 text-center">
                <p className="text-sm font-medium text-zinc-600">
                  No documents uploaded.
                </p>
              </div>
            ) : (
              assessment.documents.map((doc, index) => (
                <DocumentCard key={doc.id} document={doc} index={index} />
              ))
            )}
          </div>
        </section>

        {/* =========================================================
            FOOTER
        ========================================================= */}

        <div className="mt-20 border-t border-emerald-700/30 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400">
              ESG assessment · {assessment.reportingYear}
            </p>

            <Link
              href="/reports"
              className="flex items-center gap-2 text-xs font-medium text-emerald-800 hover:text-emerald-950"
            >
              All reports
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-800">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-medium tracking-tight text-zinc-950">
        {title}
      </h2>

      <p className="mt-2 text-sm font-medium text-zinc-500">{description}</p>
    </div>
  );
}

/* =========================================================
   SCORE CARD
========================================================= */

function ScoreCard({
  letter,
  title,
  value,
  icon: Icon,
  description,
}: {
  letter: string;
  title: string;
  value: Score;
  icon: typeof Leaf;
  description: string;
}) {
  const tone = getScoreTone(value);

  return (
    <div className="group relative">
      {/* 3D extrusion */}
      <div
        className={`absolute inset-0 translate-x-2 translate-y-2 border ${tone.layer}`}
      />

      <div
        className={`relative border ${tone.border} bg-white p-6 shadow-[0_10px_25px_rgba(6,78,59,0.06)] transition-transform duration-300 group-hover:-translate-y-1`}
      >
        <div className="flex items-start justify-between">
          <div
            className={`flex h-10 w-10 items-center justify-center border ${tone.border} ${tone.bg} ${tone.text}`}
          >
            <Icon size={18} />
          </div>

          <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">
            {letter}
          </span>
        </div>

        <p className="mt-7 text-[10px] font-medium uppercase tracking-widest text-zinc-500">
          {title}
        </p>

        <p className={`mt-2 text-4xl font-medium ${tone.text}`}>
          {score(value)}
        </p>

        <p className="mt-4 text-xs font-medium leading-5 text-zinc-500">
          {description}
        </p>

        <div className="mt-6 h-px bg-zinc-200" />

        <div className="mt-3 flex items-center justify-between">
          <p className="text-[9px] font-medium uppercase tracking-widest text-zinc-400">
            ESG dimension
          </p>

          <span
            className={`border px-2 py-1 text-[9px] font-medium uppercase tracking-wider ${tone.badge}`}
          >
            {value == null
              ? "Not scored"
              : Number(value) < 50
                ? "Needs attention"
                : Number(value) <= 75
                  ? "Moderate"
                  : "Strong"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DETAIL ITEM
========================================================= */

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
}) {
  return (
    <div className="border-b border-r border-emerald-700/20 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center border border-emerald-700/30 bg-emerald-50 text-emerald-800">
          <Icon size={14} />
        </div>

        <div>
          <p className="text-[9px] font-medium uppercase tracking-widest text-zinc-400">
            {label}
          </p>

          <p className="mt-1 text-sm font-medium text-zinc-950">{value}</p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   DOCUMENT CARD
========================================================= */

function DocumentCard({
  document,
  index,
}: {
  document: Assessment["documents"][number];
  index: number;
}) {
  const dataSets = [
    document.electricity,
    document.water,
    document.employeeData,
    document.csrReport,
  ].filter(Boolean);

  return (
    <div className="group relative">
      {/* 3D depth */}
      <div className="absolute inset-0 translate-x-2 translate-y-2 border border-emerald-700/20 bg-emerald-50" />

      <div className="relative border border-zinc-300 bg-white shadow-[0_10px_25px_rgba(6,78,59,0.06)]">
        {/* =====================================================
            DOCUMENT HEADER
        ===================================================== */}

        <div className="flex flex-wrap items-start justify-between gap-5 border-b border-emerald-700/20 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 flex-none items-center justify-center border border-emerald-700/40 bg-emerald-50 text-emerald-800">
              <FileText size={19} />
            </div>

            <div>
              <p className="text-[9px] font-medium uppercase tracking-widest text-zinc-400">
                Document 0{index + 1}
              </p>

              <h3 className="mt-1 text-sm font-medium text-zinc-950">
                {document.fileName}
              </h3>

              <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                {document.documentType.replace(/_/g, " ")}
                {" · "}
                {(document.fileSize / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>

          <span className="border border-emerald-700/30 bg-emerald-50 px-3 py-1.5 text-[9px] font-medium uppercase tracking-wider text-emerald-800">
            {document.extractionStatus}
          </span>
        </div>

        {/* =====================================================
            DATA + METRICS
        ===================================================== */}

        <div
          className={`grid ${
            document.esgMetrics.length > 0
              ? "lg:grid-cols-[1.35fr_0.85fr]"
              : "grid-cols-1"
          }`}
        >
          {/* =================================================
              LEFT — EXTRACTED DATA
          ================================================= */}

          {dataSets.length > 0 && (
            <div className="bg-zinc-50 p-6">
              <div className="mb-5 flex items-center gap-2">
                <Database size={13} className="text-emerald-700" />

                <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                  Extracted data
                </p>
              </div>

              <div className="space-y-5">
                {dataSets.map((values, dataIndex) => (
                  <div
                    key={dataIndex}
                    className="border border-zinc-200 bg-white"
                  >
                    {/* Dataset label */}
                    <div className="border-b border-zinc-200 bg-zinc-100 px-4 py-3">
                      <p className="text-[9px] font-medium uppercase tracking-widest text-zinc-500">
                        Dataset {dataIndex + 1}
                      </p>
                    </div>

                    {/* Data table */}
                    <div className="divide-y divide-zinc-200">
                      {Object.entries(values as Record<string, unknown>)
                        .filter(([key]) => !["id", "documentId"].includes(key))
                        .map(([key, value]) => (
                          <div
                            key={key}
                            className="grid grid-cols-[1fr_auto] gap-6 px-4 py-3 text-xs"
                          >
                            <span className="font-medium capitalize text-zinc-500">
                              {key.replace(/([A-Z])/g, " $1")}
                            </span>

                            <span className="text-right font-medium text-zinc-900">
                              {String(value)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================
              RIGHT — CALCULATED METRICS
          ================================================= */}

          {document.esgMetrics.length > 0 && (
            <div className="relative border-l border-emerald-700/20 bg-emerald-50/70 p-6">
              {/* Small 3D depth */}
              <div className="pointer-events-none absolute inset-y-3 right-[-5px] -z-0 bg-emerald-100" />

              <div className="relative">
                {/* Metrics heading */}

                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center border border-emerald-700/30 bg-white text-emerald-700">
                    <Activity size={13} />
                  </div>

                  <div>
                    <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-emerald-900">
                      Calculated metrics
                    </p>

                    <p className="mt-0.5 text-[10px] font-medium text-emerald-800/60">
                      Derived ESG indicators
                    </p>
                  </div>
                </div>

                {/* Metrics table */}

                <div className="mt-5 overflow-hidden border border-emerald-700/25 bg-white shadow-[0_8px_20px_rgba(6,78,59,0.08)]">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-emerald-700/20 bg-emerald-900">
                        <th className="px-3 py-2.5 text-left text-[9px] font-medium uppercase tracking-wider text-white">
                          Metric
                        </th>

                        <th className="px-3 py-2.5 text-right text-[9px] font-medium uppercase tracking-wider text-white">
                          Value
                        </th>

                        <th className="px-3 py-2.5 text-right text-[9px] font-medium uppercase tracking-wider text-white">
                          Score
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {document.esgMetrics.map((metric, metricIndex) => {
                        const name = metric.name
                          ? String(metric.name)
                          : "Metric";

                        const rawValue =
                          metric.normalizedValue ??
                          metric.rawValue ??
                          metric.textValue ??
                          "—";

                        const unit =
                          metric.normalizedUnit ?? metric.rawUnit ?? "";

                        const metricScore = metric.score ?? "—";

                        return (
                          <tr
                            key={metricIndex}
                            className="border-b border-emerald-700/10 last:border-0"
                          >
                            <td className="px-3 py-3">
                              <p className="text-xs font-medium text-zinc-900">
                                {name}
                              </p>

                              {metric.category != null && (
                                <p className="mt-1 text-[8px] font-medium uppercase tracking-wider text-emerald-700">
                                  {String(metric.category)}
                                </p>
                              )}
                            </td>

                            <td className="whitespace-nowrap px-3 py-3 text-right">
                              <span className="text-xs font-medium text-zinc-800">
                                {String(rawValue)}
                              </span>

                              {unit && (
                                <span className="ml-1 text-[9px] text-zinc-400">
                                  {String(unit)}
                                </span>
                              )}
                            </td>

                            <td className="px-3 py-3 text-right">
                              {(() => {
                                const tone = getScoreTone(metricScore as Score);

                                return (
                                  <span
                                    className={`inline-flex min-w-[38px] justify-center border px-2 py-1 text-[10px] font-medium ${tone.badge}`}
                                  >
                                    {String(metricScore)}
                                  </span>
                                );
                              })()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Metric footer */}

                <div className="mt-4 flex items-center justify-between border-t border-emerald-700/20 pt-3">
                  <p className="text-[9px] font-medium uppercase tracking-wider text-emerald-800/60">
                    {document.esgMetrics.length}{" "}
                    {document.esgMetrics.length === 1 ? "metric" : "metrics"}{" "}
                    calculated
                  </p>

                  <Activity size={13} className="text-emerald-700/50" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

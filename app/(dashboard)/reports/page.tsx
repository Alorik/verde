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

function score(value: Score) {
  return value == null ? "—" : Number(value).toFixed(1);
}

function statusLabel(status: string) {
  return status.replace(/_/g, " ");
}

export default function ReportsPage() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

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
        <div className="mx-12 border-x border-zinc-300 bg-white py-10 sm:px-10">
          <p className="text-xs font-semibold text-zinc-600">retrieving reports…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-zinc-100 px-12">
      <div className="mx-12 border-x border-zinc-300 bg-white py-10 sm:px-10">
        <header className="border-b-4 border-zinc-950 pb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600">
            ESG performance
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950">
            Reports
          </h1>
          <p className="mt-3 max-w-2xl text-sm font-medium leading-6 text-zinc-700">
            Review score performance across {organization?.name ?? "your organization"}&apos;s ESG assessments.
          </p>
        </header>

        <section className="mt-10 grid border-l border-t border-zinc-300 sm:grid-cols-3">
          {[
            ["Latest overall", latest ? score(latest.esgScore?.overallScore ?? null) : "—"],
            ["Average overall", average == null ? "—" : average.toFixed(1)],
            ["Reports scored", scoredAssessments.length.toString()],
          ].map(([label, value]) => (
            <div key={label} className="border-b border-r border-zinc-300 bg-zinc-50 p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{label}</p>
              <p className="mt-2 text-3xl font-bold text-zinc-950">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-12">
          <div className="border-b border-zinc-300 pb-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600">Assessment reports</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950">Score breakdown</h2>
          </div>

          {assessments.length === 0 ? (
            <div className="mt-5 border border-dashed border-zinc-400 bg-zinc-50 py-20 text-center">
              <p className="text-xl font-bold text-zinc-950">No reports yet</p>
              <p className="mx-auto mt-2 max-w-md text-sm font-medium text-zinc-700">Complete an assessment to generate an ESG performance report.</p>
              <Link href="/assessments" className="mt-6 inline-flex border border-zinc-950 bg-zinc-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-900">View assessments →</Link>
            </div>
          ) : (
            <div className="mt-5 border border-zinc-300">
              {assessments.map((assessment) => {
                const current = assessment.esgScore;
                return (
                  <article key={assessment.id} className="border-b border-zinc-300 p-5 last:border-b-0 hover:bg-emerald-50/40">
                    <div className="flex flex-wrap items-start justify-between gap-5">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-bold text-zinc-950">{assessment.name}</h3>
                          <span className="border border-zinc-400 bg-zinc-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-700">{statusLabel(assessment.status)}</span>
                        </div>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-zinc-600">Reporting year {assessment.reportingYear} · {assessment._count.documents} {assessment._count.documents === 1 ? "document" : "documents"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Overall ESG</p>
                        <p className="mt-1 text-3xl font-bold text-zinc-950">{score(current?.overallScore ?? null)}</p>
                      </div>
                    </div>
                    <div className="mt-5 grid grid-cols-3 border-l border-t border-zinc-300">
                      {[["Environmental", current?.environmentalScore], ["Social", current?.socialScore], ["Governance", current?.governanceScore]].map(([label, value]) => (
                        <div key={label as string} className="border-b border-r border-zinc-300 bg-zinc-50 p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">{label as string}</p>
                          <p className="mt-1 text-lg font-bold text-zinc-950">{score(value as Score)}</p>
                        </div>
                      ))}
                    </div>
                    <Link href={`/assessments/${assessment.id}`} className="mt-4 inline-flex border border-zinc-500 px-3 py-1.5 text-xs font-bold text-zinc-800 hover:border-emerald-600 hover:bg-emerald-100 hover:text-emerald-900">Open assessment →</Link>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

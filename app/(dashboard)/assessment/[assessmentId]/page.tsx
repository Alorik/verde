"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Document = {
  id: string;
  fileName: string;
  documentType:
    | "ELECTRICITY_BILL"
    | "WATER_REPORT"
    | "EMPLOYEE_DATA"
    | "CSR_REPORT"
    | "SUSTAINABILITY_REPORT"
    | "OTHER";
  fileSize: number;
  fileUrl: string | null;
  mimeType: string;
  assessmentId: string;
  uploadedAt: string;
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
  documents: Document[];
};

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-zinc-100 text-zinc-600 border-zinc-200",
  in_review: "bg-amber-50 text-amber-700 border-amber-200",
  submitted: "bg-blue-50 text-blue-700 border-blue-200",
  complete: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

function statusLabel(status: string) {
  return status.replace(/_/g, " ");
}

function statusStyle(status: string) {
  return STATUS_STYLES[status.toLowerCase()] ?? STATUS_STYLES.draft;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AssessmentDetail({
  params,
}: {
  params: Promise<{ assessmentId: string }>;
}) {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("");


  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    async function loadAssessments() {
      const { assessmentId } = await params;

      const response = await fetch(`/api/assessments/${assessmentId}`);
      if (!response.ok) {
        console.error("failed to load assessment");
        return;
      }

      const data = await response.json();

      setAssessment(data.assessment);
    }
    loadAssessments();
  }, [params]);

  if (!assessment) {
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

  const referenceNumber = `AST-${assessment.id.slice(-6).toUpperCase().padStart(6, "0")}`;

  const fields: { label: string; value: string }[] = [
    { label: "Reporting year", value: assessment.reportingYear.toString() },
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
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href={`/organization/${assessment.organizationId}`}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-zinc-400 transition hover:text-emerald-600"
          >
            <svg
              className="h-3 w-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Organization record
          </Link>
        </motion.div>

        {/* Eyebrow + stamp row */}
        <div className="mt-5 flex items-start justify-between">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400"
          >
            Assessment record
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

        {/* Title + status */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-serif text-4xl tracking-tight text-zinc-900"
            style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
          >
            {assessment.name}
          </motion.h1>

          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[11px] font-medium capitalize tracking-wide ${statusStyle(
              assessment.status,
            )}`}
          >
            {statusLabel(assessment.status)}
          </motion.span>
        </div>

        {/* Drawn rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.65, 0, 0.35, 1] }}
          style={{ transformOrigin: "left" }}
          className="mt-8 h-px w-full bg-zinc-200"
        />

        {/* Field list */}
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

        {/* Description — prose, not a field row */}
        {assessment.description && (
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8"
          >
            <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-400">
              Description
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">
              {assessment.description}
            </p>
          </motion.div>
        )}

        {/* Filed footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[11px] text-zinc-400"
        >
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            on file · {assessment.id}
          </span>
          <span>filed {formatDate(assessment.createdAt)}</span>
          <span>updated {formatDate(assessment.updatedAt)}</span>
        </motion.div>

        {/* Documents */}
        <motion.section
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 1.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-14"
        >
          <div className="flex items-end justify-between border-b border-zinc-200 pb-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                Documents
              </p>

              <h2
                className="mt-2 font-serif text-2xl tracking-tight text-zinc-900"
                style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
              >
                Assessment documents
              </h2>
            </div>

            <span className="font-mono text-xs text-zinc-400">
              {assessment.documents.length}{" "}
              {assessment.documents.length === 1 ? "file" : "files"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="mt-5 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
          >
            + Upload document
          </button>
          
          {assessment.documents.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-zinc-500">
                No documents uploaded yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {assessment.documents.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center justify-between py-5"
                >
                  <div>
                    <h3 className="text-sm font-medium text-zinc-900">
                      {document.fileName}
                    </h3>

                    <div className="mt-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                      <span>{document.documentType.replace(/_/g, " ")}</span>

                      <span>·</span>

                      <span>{formatDate(document.uploadedAt)}</span>
                    </div>
                  </div>

                  <div className="text-xs text-zinc-400">
                    {(document.fileSize / 1024).toFixed(1)} KB
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.section>

        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-6">
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                    New document
                  </p>

                  <h2
                    className="mt-2 font-serif text-2xl text-zinc-900"
                    style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
                  >
                    Upload document
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="text-xl text-zinc-400 transition hover:text-zinc-900"
                >
                  ×
                </button>
              </div>

              {/* File input */}
              <div className="mt-8">
                <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                  File
                </label>

                <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 px-6 py-10 text-center transition hover:border-zinc-400 hover:bg-zinc-50">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      setSelectedFile(file);
                    }}
                  />

                  {selectedFile ? (
                    <>
                      <p className="text-sm font-medium text-zinc-900">
                        {selectedFile.name}
                      </p>

                      <p className="mt-1 text-xs text-zinc-400">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-zinc-700">
                        Choose a file
                      </p>

                      <p className="mt-1 text-xs text-zinc-400">
                        PDF, CSV, XLSX or other supported files
                      </p>
                    </>
                  )}
                </label>
              </div>

              {/* Document type */}
              <div className="mt-6">
                <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                  Document type
                </label>

                <select
                  value={documentType}
                  onChange={(event) => setDocumentType(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
                >
                  <option value="">Select document type</option>
                  <option value="ELECTRICITY_BILL">Electricity Bill</option>
                  <option value="WATER_REPORT">Water Report</option>
                  <option value="EMPLOYEE_DATA">Employee Data</option>
                  <option value="CSR_REPORT">CSR Report</option>
                  <option value="SUSTAINABILITY_REPORT">
                    Sustainability Report
                  </option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Actions */}
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFile(null);
                    setDocumentType("");
                  }}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={!selectedFile || !documentType}
                  className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Upload
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

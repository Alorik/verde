"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";


type DocumentType =
  | "ELECTRICITY_BILL"
  | "WATER_REPORT"
  | "EMPLOYEE_DATA"
  | "CSR_REPORT"
  | "SUSTAINABILITY_REPORT"
  | "OTHER";

type ExtractionStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

type Electricity = {
  id: string;
  documentId: string;
  electricityCost: number | string;
  unitsConsumed: number | string;
};

type Document = {
  id: string;
  fileName: string;
  documentType: DocumentType;
  fileSize: number;
  fileUrl: string | null;
  mimeType: string;
  assessmentId: string;
  extractionStatus: ExtractionStatus;
  electricity?: Electricity | null;
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

const DOCUMENT_TYPE_META: Record<
  DocumentType,
  { label: string; chip: string }
> = {
  ELECTRICITY_BILL: {
    label: "Electricity bill",
    chip: "bg-amber-50 text-amber-700 border-amber-200",
  },
  WATER_REPORT: {
    label: "Water report",
    chip: "bg-blue-50 text-blue-700 border-blue-200",
  },
  EMPLOYEE_DATA: {
    label: "Employee data",
    chip: "bg-violet-50 text-violet-700 border-violet-200",
  },
  CSR_REPORT: {
    label: "CSR report",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  SUSTAINABILITY_REPORT: {
    label: "Sustainability report",
    chip: "bg-teal-50 text-teal-700 border-teal-200",
  },
  OTHER: {
    label: "Other",
    chip: "bg-zinc-100 text-zinc-600 border-zinc-200",
  },
};

const EXTRACTION_META: Record<
  ExtractionStatus,
  { label: string; chip: string }
> = {
  PENDING: {
    label: "Queued",
    chip: "bg-zinc-100 text-zinc-500 border-zinc-200",
  },
  PROCESSING: {
    label: "Extracting",
    chip: "bg-blue-50 text-blue-700 border-blue-200",
  },
  COMPLETED: {
    label: "Extracted",
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  FAILED: {
    label: "Failed",
    chip: "bg-coral-50 text-coral-700 border-coral-200",
  },
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

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatNumber(value: number | string) {
  const n = typeof value === "string" ? parseFloat(value) : value;
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

/* ---------- SVG bits ---------- */

function StatusIcon({ status }: { status: string }) {
  const s = status.toLowerCase();
  const common = {
    className: "h-3 w-3",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (s === "complete" || s === "completed") {
    return (
      <svg {...common}>
        <path d="M20 6 9 17l-5-5" />
      </svg>
    );
  }
  if (s === "submitted") {
    return (
      <svg {...common}>
        <path d="M22 2 11 13" />
        <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
      </svg>
    );
  }
  if (s === "in_review") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" strokeDasharray="3 3.5" />
    </svg>
  );
}

function SealIcon() {
  return (
    <svg
      className="h-3 w-3"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="5" />
      <path d="M8.5 12.5 7 21l5-2.5L17 21l-1.5-8.5" />
    </svg>
  );
}

function DocumentTypeIcon({ type }: { type: DocumentType }) {
  const common = {
    className: "h-[18px] w-[18px]",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (type) {
    case "ELECTRICITY_BILL":
      return (
        <svg {...common}>
          <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
        </svg>
      );
    case "WATER_REPORT":
      return (
        <svg {...common}>
          <path d="M12 3s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11Z" />
        </svg>
      );
    case "EMPLOYEE_DATA":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
          <path d="M16 8a3 3 0 1 1 3 3" />
          <path d="M22 20c0-2.7-1.7-5-4-5.8" />
        </svg>
      );
    case "CSR_REPORT":
    case "SUSTAINABILITY_REPORT":
      return (
        <svg {...common}>
          <path d="M5 21c0-6 4-14 14-16-1 8-6 14-14 16Z" />
          <path d="M5 21c2-2.5 4.5-4.5 7-6" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
          <path d="M14 2v6h6" />
        </svg>
      );
  }
}

function ExtractionIcon({ status }: { status: ExtractionStatus }) {
  const common = {
    className: "h-3 w-3",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (status === "COMPLETED") {
    return (
      <svg {...common}>
        <path d="M20 6 9 17l-5-5" />
      </svg>
    );
  }
  if (status === "FAILED") {
    return (
      <svg {...common}>
        <path d="M12 9v4" />
        <path d="M12 16.5v.01" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    );
  }
  if (status === "PROCESSING") {
    return (
      <motion.svg
        {...common}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <path d="M21 12a9 9 0 1 1-3.5-7.1" />
      </motion.svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" strokeDasharray="2.5 3" />
    </svg>
  );
}

function Divider() {
  return (
    <motion.span
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.65, 0, 0.35, 1] }}
      style={{ transformOrigin: "center" }}
      className="hidden h-10 w-px flex-none bg-zinc-200 sm:block"
    />
  );
}

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const docCardVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
};

function DocumentCard({ doc }: { doc: Document }) {
  const typeMeta = DOCUMENT_TYPE_META[doc.documentType];
  const extractionMeta =
    EXTRACTION_META[doc.extractionStatus] ?? EXTRACTION_META.PENDING;
  const hasElectricityData =
    doc.documentType === "ELECTRICITY_BILL" &&
    doc.extractionStatus === "COMPLETED" &&
    doc.electricity;

  return (
    <motion.div
      layout
      variants={docCardVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="overflow-hidden rounded-xl border border-zinc-200 bg-white transition hover:border-zinc-300"
    >
      <div className="flex items-start gap-3 p-3.5">
        <span
          className={`flex h-10 w-10 flex-none items-center justify-center rounded-lg border ${typeMeta.chip}`}
        >
          <DocumentTypeIcon type={doc.documentType} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="truncate text-sm font-medium text-zinc-900">
              {doc.fileName}
            </span>
            <span
              className={`inline-flex flex-none items-center rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide ${typeMeta.chip}`}
            >
              {typeMeta.label}
            </span>
            <span
              className={`inline-flex flex-none items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wide ${extractionMeta.chip}`}
            >
              <ExtractionIcon status={doc.extractionStatus} />
              {extractionMeta.label}
            </span>
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
            <span>{formatFileSize(doc.fileSize)}</span>
            <span aria-hidden="true">·</span>
            <span>Uploaded {formatDate(doc.uploadedAt)}</span>
          </div>

          {doc.extractionStatus === "FAILED" && (
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-coral-600">
              Extraction failed — data not available
            </p>
          )}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {hasElectricityData && doc.electricity && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid grid-cols-2 gap-4 border-t border-zinc-100 bg-zinc-50/60 px-3.5 py-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                  Electricity cost
                </p>
                <p className="mt-0.5 text-sm font-medium text-zinc-900">
                  ${formatNumber(doc.electricity.electricityCost)}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                  Units consumed
                </p>
                <p className="mt-0.5 text-sm font-medium text-zinc-900">
                  {formatNumber(doc.electricity.unitsConsumed)} kWh
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
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

  async function loadAssessment(assessmentId: string) {
    const response = await fetch(`/api/assessments/${assessmentId}`);

    if (!response.ok) {
      console.error("failed to load assessment");
      return;
    }
    const data = await response.json();

    setAssessment(data.assessment);
  }
  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { assessmentId } = await params;

      const response = await fetch(`/api/assessments/${assessmentId}`);

      if (!response.ok) {
        console.error("failed to load assessment");
        return;
      }

      const data = await response.json();

      if (!cancelled) {
        setAssessment(data.assessment);
      }

    }

    load();

    return () => {
      cancelled = true;
    };
  }, [params]);

  // Poll while any document is still pending/processing extraction,
  // so status chips and the electricity panel update without a manual refresh.

  useEffect(() => {
    if (!assessment) return;

    const hasPendingWork = assessment.documents.some(
      (d) =>
        d.extractionStatus === "PENDING" || d.extractionStatus === "PROCESSING",
    );

    if (!hasPendingWork) return;

    const interval = setInterval(() => {
      loadAssessment(assessment.id);
    }, 4000);

    return () => clearInterval(interval);
  }, [assessment]);

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

  const listVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.09,
        delayChildren: 0.6,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-8 py-20 sm:px-12">
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

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400"
        >
          Assessment record
        </motion.p>

        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto_auto_auto_minmax(0,1fr)] items-center gap-6">
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="justify-self-start truncate font-serif text-4xl tracking-tight text-zinc-900 sm:text-5xl"
            style={{ fontFamily: "'Source Serif 4', Georgia, serif" }}
            title={assessment.name}
          >
            {assessment.name}
          </motion.h1>

          <Divider />

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col items-center gap-1.5"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-300">
              Status
            </span>
            <motion.span
              whileHover={{ y: -1 }}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 font-mono text-[11px] font-medium capitalize tracking-wide ${statusStyle(
                assessment.status,
              )}`}
            >
              <StatusIcon status={assessment.status} />
              {statusLabel(assessment.status)}
            </motion.span>
          </motion.div>

          <Divider />

          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 1.3, rotate: -6 }
            }
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.3,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="flex flex-col items-end gap-1.5 justify-self-end"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-300">
              Reference
            </span>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm border border-emerald-200 bg-emerald-50 py-1 pl-2.5 pr-3 font-mono text-[11px] font-medium tracking-wide text-emerald-700">
              <SealIcon />
              {referenceNumber}
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.65, 0, 0.35, 1] }}
          style={{ transformOrigin: "left" }}
          className="mt-10 h-px w-full bg-zinc-200"
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
              className="grid grid-cols-[1fr_auto] items-baseline gap-4 border-b border-zinc-100 py-4"
            >
              <dt className="font-mono text-[11px] uppercase tracking-widest text-zinc-400">
                {field.label}
              </dt>
              <dd className="justify-self-end text-base text-zinc-900">
                {field.value}
              </dd>
            </motion.div>
          ))}
        </motion.dl>

        {/* Description */}
        {assessment.description && (
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 1.05,
              ease: [0.22, 1, 0.36, 1],
            }}
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
          transition={{ duration: 0.5, delay: 1.25 }}
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
          transition={{ duration: 0.5, delay: 1.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14"
        >
          <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-zinc-200 pb-4">
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

            <span className="justify-self-end font-mono text-xs text-zinc-400">
              {assessment.documents.length}{" "}
              {assessment.documents.length === 1 ? "file" : "files"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Upload document
          </button>

          {assessment.documents.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-zinc-200 py-12 text-center">
              <p className="text-sm text-zinc-500">
                No documents uploaded yet.
              </p>
            </div>
          ) : (
            <motion.div layout className="mt-5 grid gap-2.5">
              <AnimatePresence initial={false} mode="popLayout">
                {assessment.documents.map((document) => (
                  <DocumentCard key={document.id} doc={document} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.section>

        <AnimatePresence>
          {showUploadModal && (
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
                className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl"
              >
                <div className="grid grid-cols-[1fr_auto] items-start gap-4">
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
                    className="justify-self-end text-xl leading-none text-zinc-400 transition hover:text-zinc-900"
                  >
                    ×
                  </button>
                </div>

                <div className="mt-8">
                  <label className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                    File
                  </label>

                  <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 px-6 py-10 text-center transition hover:border-emerald-300 hover:bg-emerald-50/40">
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
                    onClick={async () => {
                      if (!selectedFile || !documentType) return;

                      const formData = new FormData();
                      formData.append("file", selectedFile);
                      formData.append("documentType", documentType);

                      const response = await fetch(
                        `/api/assessments/${assessment.id}/documents`,
                        { method: "POST", body: formData },
                      );

                      if (!response.ok) {
                        console.error("Failed to upload document");
                        return;
                      }
                      await loadAssessment(assessment.id);

                      setShowUploadModal(false);
                      setSelectedFile(null);
                      setDocumentType("");
                    }}
                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Upload
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

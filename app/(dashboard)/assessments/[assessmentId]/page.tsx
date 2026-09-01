"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Droplets, FileText, Sprout, UsersRound, Zap } from "lucide-react";
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
  draft: "bg-zinc-100 text-zinc-800 border-zinc-400",
  in_review: "bg-amber-50 text-amber-800 border-amber-500",
  submitted: "bg-blue-50 text-blue-800 border-blue-500",
  complete: "bg-emerald-50 text-emerald-800 border-emerald-600",
  completed: "bg-emerald-50 text-emerald-800 border-emerald-600",
};

const DOCUMENT_TYPE_META: Record<
  DocumentType,
  { label: string; chip: string }
> = {
  ELECTRICITY_BILL: {
    label: "Electricity bill",
    chip: "bg-amber-50 text-amber-800 border-amber-500",
  },
  WATER_REPORT: {
    label: "Water report",
    chip: "bg-blue-50 text-blue-800 border-blue-500",
  },
  EMPLOYEE_DATA: {
    label: "Employee data",
    chip: "bg-violet-50 text-violet-800 border-violet-500",
  },
  CSR_REPORT: {
    label: "CSR report",
    chip: "bg-emerald-50 text-emerald-800 border-emerald-600",
  },
  OTHER: {
    label: "Other",
    chip: "bg-zinc-100 text-zinc-800 border-zinc-400",
  },
};

const EXTRACTION_META: Record<
  ExtractionStatus,
  { label: string; chip: string }
> = {
  PENDING: {
    label: "Queued",
    chip: "bg-zinc-100 text-zinc-700 border-zinc-400",
  },
  PROCESSING: {
    label: "Extracting",
    chip: "bg-blue-50 text-blue-800 border-blue-500",
  },
  COMPLETED: {
    label: "Extracted",
    chip: "bg-emerald-50 text-emerald-800 border-emerald-600",
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
  switch (type) {
    case "ELECTRICITY_BILL":
      return <Zap className="h-[19px] w-[19px]" strokeWidth={2.25} />;

    case "WATER_REPORT":
      return <Droplets className="h-[19px] w-[19px]" strokeWidth={2.25} />;

    case "EMPLOYEE_DATA":
      return <UsersRound className="h-[19px] w-[19px]" strokeWidth={2.1} />;

    case "CSR_REPORT":
      return <Sprout className="h-[19px] w-[19px]" strokeWidth={2.1} />;

    default:
      return <FileText className="h-[19px] w-[19px]" strokeWidth={2.1} />;
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
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
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
      transition={{
        duration: 0.5,
        delay: 0.4,
        ease: [0.65, 0, 0.35, 1],
      }}
      style={{ transformOrigin: "center" }}
      className="hidden h-10 w-px flex-none bg-zinc-200 sm:block"
    />
  );
}

const rowVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const docCardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.98,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
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
      className="overflow-hidden border border-zinc-300 bg-white transition hover:border-emerald-500"
    >
      <div className="flex items-start gap-3 p-3.5">
        <span
          className={`flex h-10 w-10 flex-none items-center justify-center border ${typeMeta.chip}`}
        >
          <DocumentTypeIcon type={doc.documentType} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="truncate text-sm font-bold text-zinc-950">
              {doc.fileName}
            </span>

            <span
              className={`inline-flex flex-none items-center border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${typeMeta.chip}`}
            >
              {typeMeta.label}
            </span>

            <span
              className={`inline-flex flex-none items-center gap-1 border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${extractionMeta.chip}`}
            >
              <ExtractionIcon status={doc.extractionStatus} />
              {extractionMeta.label}
            </span>
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
            <span>{formatFileSize(doc.fileSize)}</span>
            <span aria-hidden="true">·</span>
            <span>Uploaded {formatDate(doc.uploadedAt)}</span>
          </div>

          {doc.extractionStatus === "FAILED" && (
            <p className="mt-2  text-[10px] uppercase tracking-wide text-coral-600">
              Extraction failed — data not available
            </p>
          )}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {hasElectricityData && doc.electricity && (
          <motion.div
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: "auto",
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="grid grid-cols-2 gap-4 border-t border-zinc-300 bg-zinc-50 px-3.5 py-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                  Electricity cost
                </p>

                <p className="mt-0.5 text-sm font-bold text-zinc-950">
                  ${formatNumber(doc.electricity.electricityCost)}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                  Units consumed
                </p>

                <p className="mt-0.5 text-sm font-bold text-zinc-950">
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
  const [uploadingType, setUploadingType] = useState<DocumentType | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [calculateError, setCalculateError] = useState<string | null>(null);
  const [esgScore, setEsgScore] = useState<number | null>(null);
  const [esgMetrics, setEsgMetrics] = useState<Record<string, unknown> | null>(
    null,
  );

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

  const UPLOAD_TYPES: {
    type: DocumentType;
    label: string;
  }[] = [
    {
      type: "ELECTRICITY_BILL",
      label: "Electricity bill",
    },
    {
      type: "WATER_REPORT",
      label: "Water report",
    },
    {
      type: "CSR_REPORT",
      label: "CSR report",
    },
    {
      type: "EMPLOYEE_DATA",
      label: "Employee data",
    },
  ];

  async function handleUpload(type: DocumentType, file: File) {
    if (!assessment) return;

    setUploadingType(type);

    const formData = new FormData();

    formData.append("file", file);
    formData.append("documentType", type);

    const response = await fetch(
      `/api/assessments/${assessment.id}/documents`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      console.error("Failed to upload document");
      setUploadingType(null);
      return;
    }

    await loadAssessment(assessment.id);
    setUploadingType(null);
  }

  async function handleCalculateEsg() {
    if (!assessment) return;

    setCalculating(true);
    setCalculateError(null);

    const response = await fetch(
      `/api/assessments/${assessment.id}/calculate`,
      {
        method: "POST",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      setCalculateError(data.message ?? "Failed to calculate ESG score");

      setCalculating(false);
      return;
    }

    setEsgScore(data.score.esgScore.overallScore);
    setEsgMetrics(data.score.metrics ?? null);

    setCalculating(false);
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
      <div className="flex min-h-screen items-center justify-center bg-zinc-100">
        <motion.div
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  opacity: [0.3, 0.7, 0.3],
                }
          }
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex items-center gap-3 text-xs font-semibold tracking-wide text-zinc-600"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          retrieving record…
        </motion.div>
      </div>
    );
  }

  const referenceNumber = `AST-${assessment.id
    .slice(-6)
    .toUpperCase()
    .padStart(6, "0")}`;

  const fields: {
    label: string;
    value: string;
  }[] = [
    {
      label: "Reporting year",
      value: assessment.reportingYear.toString(),
    },
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
    <div className="bg-zinc-100 px-12">
      <div className="mx-12 border-x border-zinc-300 bg-white py-10 sm:px-10">
        {/* Breadcrumb */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href={`/organization/${assessment.organizationId}`}
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-zinc-600 transition hover:text-emerald-800"
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
          transition={{
            duration: 0.4,
            delay: 0.05,
          }}
          className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600"
        >
          Assessment record
        </motion.p>

        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto_auto_auto_minmax(0,1fr)] items-center gap-6 border-b-4 border-zinc-950 pb-8">
          <motion.h1
            initial={{
              opacity: 0,
              y: 14,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.55,
              delay: 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="justify-self-start truncate text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl"
            title={assessment.name}
          >
            {assessment.name}
          </motion.h1>

          <Divider />

          <motion.div
            initial={{
              opacity: 0,
              y: 14,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.55,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col items-center gap-1.5"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
              Status
            </span>

            <motion.span
              whileHover={{ y: -1 }}
              className={`inline-flex items-center gap-1.5 whitespace-nowrap border px-3 py-1 text-[11px] font-bold capitalize tracking-wide ${statusStyle(
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
                : {
                    opacity: 0,
                    scale: 1.3,
                    rotate: -6,
                  }
            }
            animate={{
              opacity: 1,
              scale: 1,
              rotate: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.3,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="flex flex-col items-end gap-1.5 justify-self-end"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
              Reference
            </span>

            <span className="inline-flex items-center gap-1.5 whitespace-nowrap border border-emerald-600 bg-emerald-50 py-1 pl-2.5 pr-3 text-[11px] font-bold tracking-wide text-emerald-800">
              <SealIcon />
              {referenceNumber}
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: 0.7,
            delay: 0.45,
            ease: [0.65, 0, 0.35, 1],
          }}
          style={{
            transformOrigin: "left",
          }}
          className="hidden"
        />

        {/* Field list */}

        <motion.dl
          variants={listVariants}
          initial="hidden"
          animate="show"
          className="mt-8 grid border-l border-t border-zinc-300 sm:max-w-sm"
        >
          {fields.map((field) => (
            <motion.div
              key={field.label}
              variants={rowVariants}
              className="flex min-h-28 flex-col justify-between border-b border-r border-zinc-300 bg-zinc-50 p-5"
            >
              <dt className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">
                {field.label}
              </dt>

              <dd className="mt-4 text-lg font-bold text-zinc-950">
                {field.value}
              </dd>
            </motion.div>
          ))}
        </motion.dl>

        {/* Description */}

        {assessment.description && (
          <motion.div
            initial={{
              opacity: 0,
              y: prefersReducedMotion ? 0 : 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 1.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-8 border border-zinc-300 bg-zinc-50 p-5"
          >
            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">
              Description
            </p>

            <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-800">
              {assessment.description}
            </p>
          </motion.div>
        )}

        {/* Filed footer */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            delay: 1.25,
          }}
          className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] font-semibold text-zinc-600"
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
          initial={{
            opacity: 0,
            y: prefersReducedMotion ? 0 : 16,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            delay: 1.35,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-14"
        >
          <div className="grid grid-cols-[1fr_auto] items-center gap-4 border border-zinc-950 bg-zinc-950 p-5 text-white">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                Documents
              </p>

              <h2
                className="mt-2 text-2xl font-bold tracking-tight text-white"
              >
                Assessment documents
              </h2>
            </div>

            <span className="justify-self-end text-xs font-semibold text-zinc-300">
              {assessment.documents.length}{" "}
              {assessment.documents.length === 1 ? "file" : "files"}
            </span>
          </div>

          <div className="mt-5 divide-y divide-zinc-300 border border-zinc-300">
            {UPLOAD_TYPES.map(({ type, label }) => {
              const existing = assessment.documents.find(
                (d) => d.documentType === type,
              );

              const isUploading = uploadingType === type;

              return (
                <div
                  key={type}
                  className="flex items-center justify-between gap-4 px-4 py-3.5 hover:bg-emerald-50"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 flex-none items-center justify-center border ${DOCUMENT_TYPE_META[type].chip}`}
                    >
                      <DocumentTypeIcon type={type} />
                    </span>

                    <div>
                      <p className="text-sm font-bold text-zinc-950">
                        {label}
                      </p>

                      {existing && (
                        <p className="mt-0.5 truncate text-[10px] font-semibold uppercase tracking-wide text-zinc-600">
                          {existing.fileName}
                        </p>
                      )}
                    </div>
                  </div>

                  <label
                    className={`inline-flex flex-none items-center gap-1.5 border px-3.5 py-1.5 text-xs font-bold transition ${
                      isUploading
                        ? "cursor-wait border-zinc-300 text-zinc-500"
                        : "cursor-pointer border-zinc-500 text-zinc-800 hover:border-emerald-600 hover:bg-emerald-100 hover:text-emerald-900"
                    }`}
                  >
                    <input
                      type="file"
                      className="hidden"
                      disabled={isUploading}
                      onChange={(event) => {
                        const file = event.target.files?.[0];

                        if (file) {
                          handleUpload(type, file);
                        }

                        event.target.value = "";
                      }}
                    />

                    {isUploading
                      ? "Uploading…"
                      : existing
                        ? "Replace"
                        : "Upload"}
                  </label>
                </div>
              );
            })}
          </div>

          {assessment.documents.length === 0 && (
            <p className="mt-4 text-[11px] font-semibold text-amber-700">
              Please upload at least one document.
            </p>
          )}

          <div className="mt-8 flex items-center justify-end gap-4">
            {calculateError && (
              <p className="text-[11px] font-semibold text-red-700">{calculateError}</p>
            )}

            {esgScore !== null && !calculateError && (
              <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-800">
                Score: {esgScore}
              </p>
            )}

            <button
              type="button"
              disabled={assessment.documents.length === 0 || calculating}
              onClick={handleCalculateEsg}
              className="border border-zinc-950 bg-zinc-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {calculating ? "Calculating…" : "Calculate ESG"}
            </button>
          </div>

          {assessment.documents.length === 0 ? (
            <div className="mt-6 border border-dashed border-zinc-400 bg-zinc-50 py-12 text-center">
              <p className="text-sm font-medium text-zinc-700">
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
      </div>
    </div>
  );
}

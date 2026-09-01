"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Document = {
  id: string;
  fileName: string;
  documentType: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  fileUrl: string | null;
  assessment: {
    id: string;
    name: string;
    reportingYear: number;
  };
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDocuments() {
      try {
        const response = await fetch("/api/documents");

        if (!response.ok) {
          throw new Error("Failed to load documents");
        }

        const data = await response.json();

        setDocuments(data.documents ?? []);
      } catch (error) {
        console.error("Failed to load documents:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDocuments();
  }, []);

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function formatDocumentType(type: string) {
    return type
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  if (loading) {
    return (
      <main className="bg-zinc-100 px-12">
        <div className="mx-12 border-x border-zinc-300 bg-white py-10 sm:px-10">
          <p className="text-xs font-medium text-zinc-600">retrieving documents…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-zinc-100 px-12">
      <div className="mx-12 border-x border-emerald-800/30  bg-white py-10 sm:px-10">
        {/* Header */}
        <div className="flex items-end justify-between -mx-10 border-b  border-emerald-800/30 shadow-[0_3px_6px_rgba(6,95,70,0.18)] pb-8 mb-8">
          <div className="mx-10">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-600">
              Document archive
            </p>

            <h1 className="mt-3 text-4xl font-medium tracking-tight text-zinc-950">
              Documents
            </h1>

            <p className="mt-2 text-sm font-medium text-zinc-700">
              All documents submitted across your ESG assessments.
            </p>
          </div>

          <div className="text-xs font-medium text-zinc-600 mx-10">
            {documents.length}{" "}
            {documents.length === 1 ? "document" : "documents"}
          </div>
        </div>

        {/* Empty state */}
        {documents.length === 0 ? (
          <div className="border border-dashed border-zinc-400 bg-zinc-50 py-24 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center border border-zinc-400 text-xl font-medium text-zinc-600">
              +
            </div>

            <h2 className="mt-5 text-2xl font-medium text-zinc-950">
              No documents yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm font-medium text-zinc-700">
              Documents uploaded to your ESG assessments will appear here.
            </p>

            <Link
              href="/assessments"
              className="mt-6 inline-flex border border-zinc-950 bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-900"
            >
              View assessments →
            </Link>
          </div>
        ) : (
          /* Document list */
          <div className="border border-zinc-300 bg-white">
            {documents.map((document) => (
              <div
                key={document.id}
                className="group flex items-center justify-between gap-6 border-b border-zinc-300 p-5 transition last:border-b-0 hover:bg-emerald-50"
              >
                {/* File information */}
                <div className="flex min-w-0 items-center gap-4">
                  {/* PDF icon */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-zinc-400 bg-zinc-50">
                    <svg
                      className="h-5 w-5 text-zinc-700"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6" />
                      <path d="M8 13h8" />
                      <path d="M8 17h5" />
                    </svg>
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-medium text-zinc-950">
                      {document.fileName}
                    </h2>

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                      <span>{formatDocumentType(document.documentType)}</span>

                      <span>·</span>

                      <span>{formatFileSize(document.fileSize)}</span>

                      <span>·</span>

                      <span>
                        {new Date(document.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="mt-2 text-xs font-medium text-zinc-700">
                      Assessment:{" "}
                      <span className="font-medium text-zinc-950">
                        {document.assessment.name}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-3">
                  {document.fileUrl && (
                    <Link
                      href={`/api/documents/${document.id}/view`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-zinc-500 bg-white px-4 py-2 text-xs font-medium text-zinc-800 transition hover:border-emerald-600 hover:bg-emerald-100 hover:text-emerald-900"
                    >
                      View document
                    </Link>
                  )}

                  <Link
                    href={`/assessment/${document.assessment.id}`}
                    className="text-xl font-medium text-zinc-500 transition group-hover:text-zinc-950"
                  >
                    →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

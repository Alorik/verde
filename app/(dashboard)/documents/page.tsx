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
      <main className="min-h-screen border-x border-zinc-200 mx-24 bg-white">
        <div className="mx-auto max-w-5xl px-8 py-20">
          <p className=" text-xs text-zinc-400">retrieving documents…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen border-x border-zinc-200 mx-24 bg-white">
      <div className="mx-auto max-w-5xl px-8 py-20">
        {/* Header */}
        <div className="flex items-end justify-between border-b border-zinc-200 pb-6">
          <div>
            <p className=" text-[11px] uppercase tracking-[0.2em] text-zinc-400">
              Document archive
            </p>

            <h1 className="mt-3  text-4xl tracking-tight text-zinc-900">
              Documents
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              All documents submitted across your ESG assessments.
            </p>
          </div>

          <div className=" text-xs text-zinc-400">
            {documents.length}{" "}
            {documents.length === 1 ? "document" : "documents"}
          </div>
        </div>

        {/* Empty state */}
        {documents.length === 0 ? (
          <div className="py-24 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 text-xl text-zinc-400">
              +
            </div>

            <h2 className="mt-5  text-2xl text-zinc-900">No documents yet</h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
              Documents uploaded to your ESG assessments will appear here.
            </p>

            <Link
              href="/assessments"
              className="mt-6 inline-flex rounded-sm bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              View assessments →
            </Link>
          </div>
        ) : (
          /* Document list */
          <div className="divide-y divide-zinc-100">
            {documents.map((document) => (
              <div
                key={document.id}
                className="group flex items-center justify-between gap-6 py-6 transition hover:bg-zinc-50"
              >
                {/* File information */}
                <div className="flex min-w-0 items-center gap-4">
                  {/* PDF icon */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50">
                    <svg
                      className="h-5 w-5 text-zinc-500"
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
                    <h2 className="truncate text-sm font-medium text-zinc-900">
                      {document.fileName}
                    </h2>

                    <div className="mt-1 flex flex-wrap items-center gap-2  text-[10px] uppercase tracking-wider text-zinc-400">
                      <span>{formatDocumentType(document.documentType)}</span>

                      <span>·</span>

                      <span>{formatFileSize(document.fileSize)}</span>

                      <span>·</span>

                      <span>
                        {new Date(document.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-zinc-500">
                      Assessment:{" "}
                      <span className="text-zinc-700">
                        {document.assessment.name}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-3">
                  {document.fileUrl && (
                    <a
                      href={document.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-sm border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
                    >
                      View document
                    </a>
                  )}

                  <Link
                    href={`/assessment/${document.assessment.id}`}
                    className="text-zinc-300 transition group-hover:text-zinc-700"
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

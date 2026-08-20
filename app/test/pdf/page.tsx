"use client";

import { useState } from "react";

export default function PDFTestPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function extractPDF() {
    if (!file) return;

    setLoading(true);
    setResult("");

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/test/pdf", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    setResult(JSON.stringify(data, null, 2));
    setLoading(false);
  }

  return (
    <main className="min-h-screen p-10">
      <h1 className="text-2xl font-semibold">PDF Extraction Test</h1>

      <input
        type="file"
        accept="application/pdf"
        className="mt-6"
        onChange={(event) => {
          setFile(event.target.files?.[0] ?? null);
        }}
      />

      <button
        type="button"
        disabled={!file || loading}
        onClick={extractPDF}
        className="mt-6 block rounded-lg bg-black px-4 py-2 text-black disabled:opacity-40"
      >
        {loading ? "Extracting..." : "Extract PDF"}
      </button>

      {result && (
        <pre className="mt-8 whitespace-pre-wrap rounded-lg bg-zinc-100 p-5">
          {result}
        </pre>
      )}
    </main>
  );
}

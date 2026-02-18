"use client";

import { useRef, useEffect } from "react";
import {
  RiDownloadLine,
  RiFileCopyLine,
  RiRestartLine,
} from "react-icons/ri";
import { useEulaStore } from "@/stores/eula-store";

export default function EulaPreview() {
  const { generatedEula, isGenerating, generationError } =
    useEulaStore();
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom while streaming
  useEffect(() => {
    if (isGenerating && contentRef.current) {
      contentRef.current.scrollTop =
        contentRef.current.scrollHeight;
    }
  }, [generatedEula, isGenerating]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedEula);
  };

  const handleDownloadPdf = async () => {
    try {
      const res = await fetch("/api/generate-eula-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eulaText: generatedEula }),
      });

      if (!res.ok) throw new Error("PDF generation failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "EULA.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: download as plain text
      const blob = new Blob([generatedEula], {
        type: "text/plain;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "EULA.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  if (generationError) {
    return (
      <div className="flex w-full flex-col items-center gap-y-4 py-12">
        <div className="flex items-start gap-3 border border-red-200 bg-red-50 p-4">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            !
          </div>
          <p className="font-whisper text-sm text-red-800">
            {generationError}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold font-ortank text-lg">
          {isGenerating
            ? "Generating EULA..."
            : "Generated EULA"}
        </h3>
        {!isGenerating && generatedEula && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-2 border border-neutral-300 bg-white px-4 py-2 font-whisper text-sm transition-all duration-200 hover:border-black"
            >
              <RiFileCopyLine className="h-4 w-4" />
              Copy
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="flex items-center gap-2 border border-black bg-black px-4 py-2 font-whisper text-sm text-white transition-all duration-200 hover:bg-neutral-800"
            >
              <RiDownloadLine className="h-4 w-4" />
              Download PDF
            </button>
          </div>
        )}
      </div>

      {/* Streaming content */}
      <div
        ref={contentRef}
        className="max-h-[600px] overflow-y-auto border border-neutral-300 bg-white p-8"
      >
        {isGenerating && !generatedEula && (
          <div className="flex items-center gap-2 text-neutral-400">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-neutral-400" />
            <span className="font-whisper text-sm">
              Preparing your EULA...
            </span>
          </div>
        )}
        <div className="whitespace-pre-wrap font-whisper text-sm leading-relaxed">
          {generatedEula}
          {isGenerating && (
            <span className="inline-block h-4 w-0.5 animate-pulse bg-black" />
          )}
        </div>
      </div>
    </div>
  );
}

export function EulaGenerateButton({
  onGenerate,
}: {
  onGenerate: () => void;
}) {
  const { isGenerating } = useEulaStore();

  return (
    <button
      type="button"
      onClick={onGenerate}
      disabled={isGenerating}
      className="flex items-center gap-2 border border-black bg-black px-8 py-4 font-whisper text-sm font-medium text-white transition-all duration-200 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isGenerating ? (
        <>
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Generating...
        </>
      ) : (
        "Generate EULA"
      )}
    </button>
  );
}

export function EulaResetButton({
  onReset,
}: {
  onReset: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onReset}
      className="flex items-center gap-2 border border-neutral-300 bg-white px-6 py-4 font-whisper text-sm transition-all duration-200 hover:border-black"
    >
      <RiRestartLine className="h-4 w-4" />
      Start over
    </button>
  );
}

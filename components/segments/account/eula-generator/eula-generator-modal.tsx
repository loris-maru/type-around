"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCheckLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiDownloadLine,
  RiFileCopyLine,
  RiImageLine,
  RiLoader4Line,
  RiRestartLine,
} from "react-icons/ri";
import { uploadFile } from "@/lib/firebase/storage";
import { useEulaStore } from "@/stores/eula-store";
import type { EulaFormData } from "@/types/eula";
import {
  fontProductSchema,
  foundryInfoSchema,
  licenseScopeSchema,
} from "@/types/eula";
import StepFontProduct from "./step-font-product";
import StepFoundryInfo from "./step-foundry-info";
import StepIndicator from "./step-indicator";
import StepLegalPreferences from "./step-legal-preferences";
import StepLicenseScope from "./step-license-scope";
import StepRestrictions from "./step-restrictions";

// ─── Modal step enum ────────────────────────────────────────────────
type ModalPhase = "form" | "preview" | "confirmation";

const FORM_STEP_COMPONENTS = [
  StepFoundryInfo,
  StepFontProduct,
  StepLicenseScope,
  StepRestrictions,
  StepLegalPreferences,
];

// ─── Logo Upload sub-component ──────────────────────────────────────
function LogoUpload({ studioId }: { studioId: string }) {
  const { foundryInfo, updateFoundryInfo } = useEulaStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const url = await uploadFile(file, "icons", studioId);
      updateFoundryInfo({ logoUrl: url });
    } catch {
      // silently fail
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="flex flex-col gap-y-2">
      <span className="font-whisper text-sm">
        Logo{" "}
        <span className="text-neutral-400">
          (optional, for PDF header)
        </span>
      </span>
      <input
        ref={fileInputRef}
        type="file"
        accept=".svg,.png,.jpg,.jpeg,.webp"
        onChange={handleFileChange}
        className="hidden"
      />
      {foundryInfo.logoUrl ? (
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={foundryInfo.logoUrl}
              alt="Logo"
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <button
            type="button"
            onClick={() =>
              updateFoundryInfo({ logoUrl: "" })
            }
            className="flex items-center gap-1 font-whisper text-red-500 text-xs hover:text-red-700"
          >
            <RiDeleteBinLine className="h-3.5 w-3.5" />
            Remove
          </button>
        </div>
      ) : (
        // biome-ignore lint/a11y/useKeyWithClickEvents: drop zone
        // biome-ignore lint/a11y/noStaticElementInteractions: drop zone
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() =>
            !isUploading && fileInputRef.current?.click()
          }
          className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 transition-colors ${
            isUploading
              ? "cursor-wait border-neutral-300 bg-neutral-50"
              : "border-neutral-300 hover:border-neutral-400"
          }`}
        >
          {isUploading ? (
            <RiLoader4Line className="h-5 w-5 animate-spin text-neutral-400" />
          ) : (
            <>
              <RiImageLine className="h-5 w-5 text-neutral-400" />
              <span className="font-whisper text-neutral-500 text-xs">
                Drop logo or click to upload
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Preview phase component ────────────────────────────────────────
function PreviewPhase() {
  const { generatedEula, isGenerating, generationError } =
    useEulaStore();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isGenerating && contentRef.current) {
      contentRef.current.scrollTop =
        contentRef.current.scrollHeight;
    }
  }, [isGenerating]);

  if (generationError) {
    return (
      <div className="flex flex-col items-center gap-y-4 py-8">
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 font-bold text-white text-xs">
            !
          </div>
          <p className="font-whisper text-red-800 text-sm">
            {generationError}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-3">
      <p className="font-whisper text-neutral-500 text-sm">
        {isGenerating
          ? "Generating your EULA. Please wait..."
          : "Review the generated EULA below. If you're happy, confirm to proceed."}
      </p>
      <div
        ref={contentRef}
        className="max-h-[50vh] overflow-y-auto rounded-lg border border-neutral-200 bg-neutral-50 p-6"
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

// ─── Confirmation phase component ───────────────────────────────────
function ConfirmationPhase({
  onDownload,
}: {
  onDownload: () => void;
}) {
  const { generatedEula } = useEulaStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedEula);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-y-6 py-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <RiCheckLine className="h-8 w-8 text-green-600" />
      </div>
      <div className="text-center">
        <h3 className="font-bold font-ortank text-lg">
          EULA ready
        </h3>
        <p className="mt-1 font-whisper text-neutral-500 text-sm">
          Your End User License Agreement has been generated
          successfully.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 py-3 font-whisper text-sm transition-all duration-200 hover:border-black"
        >
          <RiFileCopyLine className="h-4 w-4" />
          {copied ? "Copied!" : "Copy text"}
        </button>
        <button
          type="button"
          onClick={onDownload}
          className="flex items-center gap-2 rounded-lg border border-black bg-black px-5 py-3 font-whisper text-sm text-white transition-all duration-200 hover:bg-neutral-800"
        >
          <RiDownloadLine className="h-4 w-4" />
          Download PDF
        </button>
      </div>
    </div>
  );
}

// ─── Main modal ─────────────────────────────────────────────────────
export default function EulaGeneratorModal({
  isOpen,
  onClose,
  studioId,
}: {
  isOpen: boolean;
  onClose: () => void;
  studioId: string;
}) {
  const store = useEulaStore();
  const {
    currentStep,
    nextStep,
    prevStep,
    foundryInfo,
    fontProduct,
    licenseScope,
    restrictions,
    legalPreferences,
    generatedEula,
    isGenerating,
    generationError,
    setIsGenerating,
    setGeneratedEula,
    appendToEula,
    setGenerationError,
    reset,
  } = store;

  const [phase, setPhase] = useState<ModalPhase>("form");

  // Scroll lock
  useEffect(() => {
    if (!isOpen) return;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    if (isGenerating) return; // prevent closing mid-generation
    reset();
    setPhase("form");
    onClose();
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        return foundryInfoSchema.safeParse(foundryInfo)
          .success;
      case 2:
        return fontProductSchema.safeParse(fontProduct)
          .success;
      case 3:
        return licenseScopeSchema.safeParse(licenseScope)
          .success;
      default:
        return true;
    }
  };

  const handleGenerate = useCallback(async () => {
    setPhase("preview");
    setIsGenerating(true);
    setGeneratedEula("");
    setGenerationError(null);

    const formData: EulaFormData = {
      ...foundryInfo,
      ...fontProduct,
      ...licenseScope,
      ...restrictions,
      ...legalPreferences,
    };

    try {
      const response = await fetch("/api/generate-eula", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => null);
        throw new Error(
          errorData?.error || "Failed to generate EULA"
        );
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, {
          stream: true,
        });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) appendToEula(parsed.text);
              if (parsed.error)
                throw new Error(parsed.error);
            } catch (e) {
              if (
                data !== "[DONE]" &&
                !(e instanceof SyntaxError)
              )
                throw e;
            }
          }
        }
      }
    } catch (error) {
      setGenerationError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred"
      );
    } finally {
      setIsGenerating(false);
    }
  }, [
    foundryInfo,
    fontProduct,
    licenseScope,
    restrictions,
    legalPreferences,
    setIsGenerating,
    setGeneratedEula,
    appendToEula,
    setGenerationError,
  ]);

  const handleConfirm = () => {
    setPhase("confirmation");
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
      // Fallback: download as text
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

  const handleStartOver = () => {
    reset();
    setPhase("form");
  };

  if (!isOpen) return null;

  const isLastFormStep = currentStep === 5;
  const FormStepComponent =
    FORM_STEP_COMPONENTS[currentStep - 1];

  // ── Phase titles ──────────────────────────────────────────────────
  const phaseTitle =
    phase === "form"
      ? "Generate E.U.L.A."
      : phase === "preview"
        ? "Preview E.U.L.A."
        : "E.U.L.A. Ready";

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden">
      {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-3xl flex-col rounded-lg bg-white">
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex shrink-0 items-center justify-between border-neutral-200 border-b p-6">
          <h2 className="font-bold font-ortank text-xl">
            {phaseTitle}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            disabled={isGenerating}
            aria-label="Close modal"
            className="rounded-lg p-1 transition-colors hover:bg-neutral-100 disabled:opacity-30"
          >
            <RiCloseLine className="h-6 w-6" />
          </button>
        </div>

        {/* ── Body ───────────────────────────────────────────────── */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6">
          {phase === "form" && (
            <div className="flex flex-col gap-y-6">
              <StepIndicator currentStep={currentStep} />

              {/* Form step content */}
              <FormStepComponent />

              {/* Logo upload — only on step 1 */}
              {currentStep === 1 && (
                <LogoUpload studioId={studioId} />
              )}
            </div>
          )}

          {phase === "preview" && <PreviewPhase />}

          {phase === "confirmation" && (
            <ConfirmationPhase
              onDownload={handleDownloadPdf}
            />
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <div className="shrink-0 border-neutral-200 border-t p-6">
          {phase === "form" && (
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 py-2.5 font-whisper text-sm transition-all duration-200 hover:border-black disabled:cursor-not-allowed disabled:opacity-30"
              >
                <RiArrowLeftLine className="h-4 w-4" />
                Previous
              </button>

              {isLastFormStep ? (
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="flex items-center gap-2 rounded-lg border border-black bg-black px-6 py-2.5 font-medium font-whisper text-sm text-white transition-all duration-200 hover:bg-neutral-800"
                >
                  Generate E.U.L.A.
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (validateCurrentStep()) nextStep();
                  }}
                  className="flex items-center gap-2 rounded-lg border border-black bg-black px-6 py-2.5 font-whisper text-sm text-white transition-all duration-200 hover:bg-neutral-800"
                >
                  Next
                  <RiArrowRightLine className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {phase === "preview" && (
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleStartOver}
                disabled={isGenerating}
                className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 py-2.5 font-whisper text-sm transition-all duration-200 hover:border-black disabled:opacity-30"
              >
                <RiRestartLine className="h-4 w-4" />
                Start over
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={
                  isGenerating ||
                  !generatedEula ||
                  !!generationError
                }
                className="flex items-center gap-2 rounded-lg border border-black bg-black px-6 py-2.5 font-medium font-whisper text-sm text-white transition-all duration-200 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RiCheckLine className="h-4 w-4" />
                Confirm
              </button>
            </div>
          )}

          {phase === "confirmation" && (
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleStartOver}
                className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 py-2.5 font-whisper text-sm transition-all duration-200 hover:border-black"
              >
                <RiRestartLine className="h-4 w-4" />
                Generate another
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="flex items-center gap-2 rounded-lg border border-black bg-black px-6 py-2.5 font-whisper text-sm text-white transition-all duration-200 hover:bg-neutral-800"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

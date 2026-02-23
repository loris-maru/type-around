"use client";

import { useCallback, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { useModalOpen } from "@/hooks/use-modal-open";
import { useEulaStore } from "@/stores/eula-store";
import type { ModalPhase } from "@/types/components";
import type { EulaFormData } from "@/types/eula";
import {
  fontProductSchema,
  foundryInfoSchema,
  licenseScopeSchema,
} from "@/types/eula";
import {
  PhaseConfirmationBody,
  PhaseConfirmationFooter,
} from "./phase-confirmation";
import {
  PhaseFormBody,
  PhaseFormFooter,
} from "./phase-form";
import {
  PhasePreviewBody,
  PhasePreviewFooter,
} from "./phase-preview";

export default function EulaGeneratorModal({
  isOpen,
  onClose,
  studioId,
}: {
  isOpen: boolean;
  onClose: () => void;
  studioId: string;
}) {
  useModalOpen(isOpen);

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
    setIsGenerating,
    setGeneratedEula,
    appendToEula,
    setGenerationError,
    reset,
  } = store;

  const [phase, setPhase] = useState<ModalPhase>("form");

  const handleClose = () => {
    if (isGenerating) return;
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

  const phaseTitle =
    phase === "form"
      ? "Generate E.U.L.A."
      : phase === "preview"
        ? "Preview E.U.L.A."
        : "E.U.L.A. Ready";

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden"
      data-modal
      data-lenis-prevent
    >
      {/* biome-ignore lint/a11y/noStaticElementInteractions: backdrop */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      <div className="relative mx-4 flex max-h-[90vh] w-full max-w-3xl flex-col rounded-lg bg-white">
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

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6">
          {phase === "form" && (
            <PhaseFormBody
              currentStep={currentStep}
              studioId={studioId}
            />
          )}
          {phase === "preview" && <PhasePreviewBody />}
          {phase === "confirmation" && (
            <PhaseConfirmationBody
              onDownload={handleDownloadPdf}
            />
          )}
        </div>

        <div className="shrink-0 border-neutral-200 border-t p-6">
          {phase === "form" && (
            <PhaseFormFooter
              currentStep={currentStep}
              prevStep={prevStep}
              nextStep={nextStep}
              onGenerate={handleGenerate}
              validateCurrentStep={validateCurrentStep}
            />
          )}
          {phase === "preview" && (
            <PhasePreviewFooter
              onStartOver={handleStartOver}
              onConfirm={handleConfirm}
            />
          )}
          {phase === "confirmation" && (
            <PhaseConfirmationFooter
              onStartOver={handleStartOver}
              onClose={handleClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useCallback } from "react";
import {
  RiArrowLeftLine,
  RiArrowRightLine,
} from "react-icons/ri";
import { useEulaStore } from "@/stores/eula-store";
import {
  EULA_STEPS,
  foundryInfoSchema,
  fontProductSchema,
  licenseScopeSchema,
} from "@/types/eula";
import type { EulaFormData } from "@/types/eula";
import StepFoundryInfo from "./step-foundry-info";
import StepFontProduct from "./step-font-product";
import StepLicenseScope from "./step-license-scope";
import StepRestrictions from "./step-restrictions";
import StepLegalPreferences from "./step-legal-preferences";
import EulaPreview, {
  EulaGenerateButton,
  EulaResetButton,
} from "./eula-preview";

const STEP_COMPONENTS = [
  StepFoundryInfo,
  StepFontProduct,
  StepLicenseScope,
  StepRestrictions,
  StepLegalPreferences,
];

export default function EulaGenerator() {
  const store = useEulaStore();
  const {
    currentStep,
    nextStep,
    prevStep,
    generatedEula,
    isGenerating,
    setIsGenerating,
    setGeneratedEula,
    appendToEula,
    setGenerationError,
    reset,
    foundryInfo,
    fontProduct,
    licenseScope,
    restrictions,
    legalPreferences,
  } = store;

  const StepComponent = STEP_COMPONENTS[currentStep - 1];
  const isLastStep = currentStep === 5;
  const hasResult =
    generatedEula.length > 0 || isGenerating;

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1: {
        const result =
          foundryInfoSchema.safeParse(foundryInfo);
        return result.success;
      }
      case 2: {
        const result =
          fontProductSchema.safeParse(fontProduct);
        return result.success;
      }
      case 3: {
        const result =
          licenseScopeSchema.safeParse(licenseScope);
        return result.success;
      }
      default:
        return true;
    }
  };

  const handleGenerate = useCallback(async () => {
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
        // Parse SSE events
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                appendToEula(parsed.text);
              }
              if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (e) {
              // If it's not JSON, treat it as plain text
              if (
                data !== "[DONE]" &&
                !(e instanceof SyntaxError)
              ) {
                throw e;
              }
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

  const handleReset = () => {
    reset();
  };

  return (
    <div className="relative flex w-full flex-col items-start gap-y-8">
      {/* Header */}
      <div>
        <h2 className="font-bold font-ortank text-xl">
          EULA Generator
        </h2>
        <p className="mt-1 font-whisper text-neutral-500">
          Generate a professional End User License Agreement
          for your typeface.
        </p>
      </div>

      {/* Step indicator */}
      {!hasResult && (
        <div className="flex w-full items-center gap-2">
          {EULA_STEPS.map((step) => (
            <div
              key={step.id}
              className="flex flex-1 flex-col items-center gap-y-2"
            >
              <div className="flex w-full items-center">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center border font-whisper text-xs font-medium transition-colors duration-200 ${
                    step.id === currentStep
                      ? "border-black bg-black text-white"
                      : step.id < currentStep
                        ? "border-black bg-white text-black"
                        : "border-neutral-300 bg-white text-neutral-400"
                  }`}
                >
                  {step.id}
                </div>
                {step.id < 5 && (
                  <div
                    className={`h-px flex-1 transition-colors duration-200 ${
                      step.id < currentStep
                        ? "bg-black"
                        : "bg-neutral-300"
                    }`}
                  />
                )}
              </div>
              <span
                className={`text-center font-whisper text-xs ${
                  step.id === currentStep
                    ? "text-black"
                    : "text-neutral-400"
                }`}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Step content or result */}
      {hasResult ? (
        <div className="w-full">
          <EulaPreview />
          {!isGenerating && (
            <div className="mt-6 flex gap-3">
              <EulaResetButton onReset={handleReset} />
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="w-full border border-neutral-200 bg-white p-8">
            <StepComponent />
          </div>

          {/* Navigation buttons */}
          <div className="flex w-full items-center justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 border border-neutral-300 bg-white px-6 py-3 font-whisper text-sm transition-all duration-200 hover:border-black disabled:cursor-not-allowed disabled:opacity-30"
            >
              <RiArrowLeftLine className="h-4 w-4" />
              Previous
            </button>

            {isLastStep ? (
              <EulaGenerateButton
                onGenerate={handleGenerate}
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (validateCurrentStep()) {
                    nextStep();
                  }
                }}
                className="flex items-center gap-2 border border-black bg-black px-6 py-3 font-whisper text-sm text-white transition-all duration-200 hover:bg-neutral-800"
              >
                Next
                <RiArrowRightLine className="h-4 w-4" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

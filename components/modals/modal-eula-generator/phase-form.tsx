"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiDeleteBinLine,
  RiImageLine,
  RiLoader4Line,
} from "react-icons/ri";
import StepFontProduct from "@/components/segments/account/eula-generator/step-font-product";
import StepFoundryInfo from "@/components/segments/account/eula-generator/step-foundry-info";
import StepIndicator from "@/components/segments/account/eula-generator/step-indicator";
import StepLegalPreferences from "@/components/segments/account/eula-generator/step-legal-preferences";
import StepLicenseScope from "@/components/segments/account/eula-generator/step-license-scope";
import StepRestrictions from "@/components/segments/account/eula-generator/step-restrictions";
import { uploadFile } from "@/lib/firebase/storage";
import { useEulaStore } from "@/stores/eula-store";

const FORM_STEP_COMPONENTS = [
  StepFoundryInfo,
  StepFontProduct,
  StepLicenseScope,
  StepRestrictions,
  StepLegalPreferences,
];

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
            <Image
              width={64}
              height={64}
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

export type PhaseFormProps = {
  currentStep: number;
  studioId: string;
  prevStep: () => void;
  nextStep: () => void;
  onGenerate: () => void;
  validateCurrentStep: () => boolean;
};

export function PhaseFormBody({
  currentStep,
  studioId,
}: Pick<PhaseFormProps, "currentStep" | "studioId">) {
  const FormStepComponent =
    FORM_STEP_COMPONENTS[currentStep - 1];
  return (
    <div className="flex flex-col gap-y-6">
      <StepIndicator currentStep={currentStep} />
      <FormStepComponent />
      {currentStep === 1 && (
        <LogoUpload studioId={studioId} />
      )}
    </div>
  );
}

export function PhaseFormFooter({
  currentStep,
  prevStep,
  nextStep,
  onGenerate,
  validateCurrentStep,
}: Omit<PhaseFormProps, "studioId">) {
  const isLastFormStep = currentStep === 5;
  return (
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
          onClick={onGenerate}
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
  );
}

export default function PhaseForm(props: PhaseFormProps) {
  return (
    <>
      <PhaseFormBody
        currentStep={props.currentStep}
        studioId={props.studioId}
      />
      <PhaseFormFooter
        currentStep={props.currentStep}
        prevStep={props.prevStep}
        nextStep={props.nextStep}
        onGenerate={props.onGenerate}
        validateCurrentStep={props.validateCurrentStep}
      />
    </>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { RiCheckLine, RiRestartLine } from "react-icons/ri";
import { useEulaStore } from "@/stores/eula-store";

export type PhasePreviewProps = {
  onStartOver: () => void;
  onConfirm: () => void;
};

export function PhasePreviewBody() {
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

export function PhasePreviewFooter({
  onStartOver,
  onConfirm,
}: PhasePreviewProps) {
  const { generatedEula, isGenerating, generationError } =
    useEulaStore();

  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={onStartOver}
        disabled={isGenerating}
        className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 py-2.5 font-whisper text-sm transition-all duration-200 hover:border-black disabled:opacity-30"
      >
        <RiRestartLine className="h-4 w-4" />
        Start over
      </button>
      <button
        type="button"
        onClick={onConfirm}
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
  );
}

export default function PhasePreview(
  props: PhasePreviewProps
) {
  return (
    <>
      <PhasePreviewBody />
      <PhasePreviewFooter
        onStartOver={props.onStartOver}
        onConfirm={props.onConfirm}
      />
    </>
  );
}

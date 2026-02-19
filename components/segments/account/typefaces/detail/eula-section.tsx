"use client";

import { useState } from "react";
import {
  RiInformation2Line,
  RiSparklingLine,
} from "react-icons/ri";
import CollapsibleSection from "@/components/global/collapsible-section";
import FileDropZone from "@/components/global/file-drop-zone";
import type { EulaSectionProps } from "@/types/components";

export default function EulaSection({
  studioId,
  eula,
  onEulaChange,
  onOpenEulaGenerator,
}: EulaSectionProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <CollapsibleSection
      id="eula"
      title="EULA"
    >
      <div className="flex flex-col gap-y-3">
        <div className="flex items-center gap-x-2">
          <span className="font-semibold text-black text-sm">
            E.U.L.A.
          </span>
          <button
            type="button"
            aria-label="E.U.L.A. info tooltip"
            className="relative border-none bg-transparent p-0"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <RiInformation2Line className="h-4 w-4 cursor-help text-neutral-400" />
            {showTooltip && (
              <div className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-neutral-200 bg-black px-3 py-1.5 text-white text-xs shadow-lg">
                EULA: End User License Agreement
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" />
              </div>
            )}
          </button>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-6">
          <span className="font-whisper text-neutral-600 text-sm">
            Upload your PDF
          </span>
          <div />
          <span className="font-whisper text-neutral-600 text-sm">
            You don&apos;t have a PDF?
          </span>

          <FileDropZone
            label=""
            accept=".pdf"
            value={eula}
            onChange={onEulaChange}
            description=".pdf"
            studioId={studioId}
            folder="documents"
          />
          <div className="flex items-center justify-center">
            <span className="font-whisper text-neutral-400 text-xs">
              or
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenEulaGenerator}
            className="flex h-full min-h-0 flex-col items-center justify-center gap-2 rounded-lg border-2 border-neutral-300 p-6 transition-all duration-200 hover:border-black hover:bg-white hover:shadow-button"
          >
            <RiSparklingLine className="h-8 w-8 text-neutral-400" />
            <span className="font-medium font-whisper text-black text-sm">
              Generate EULA
            </span>
            <span className="font-whisper text-neutral-400 text-xs">
              Answer a few questions and we&apos;ll create a
              professional EULA for you.
            </span>
          </button>
        </div>
      </div>
    </CollapsibleSection>
  );
}

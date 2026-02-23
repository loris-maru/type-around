"use client";

import { useState } from "react";
import {
  RiCheckLine,
  RiDownloadLine,
  RiFileCopyLine,
  RiRestartLine,
} from "react-icons/ri";
import { useEulaStore } from "@/stores/eula-store";

export type PhaseConfirmationProps = {
  onDownload: () => void;
  onStartOver: () => void;
  onClose: () => void;
};

export function PhaseConfirmationBody({
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

export function PhaseConfirmationFooter({
  onStartOver,
  onClose,
}: Pick<
  PhaseConfirmationProps,
  "onStartOver" | "onClose"
>) {
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={onStartOver}
        className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-5 py-2.5 font-whisper text-sm transition-all duration-200 hover:border-black"
      >
        <RiRestartLine className="h-4 w-4" />
        Generate another
      </button>
      <button
        type="button"
        onClick={onClose}
        className="flex items-center gap-2 rounded-lg border border-black bg-black px-6 py-2.5 font-whisper text-sm text-white transition-all duration-200 hover:bg-neutral-800"
      >
        Done
      </button>
    </div>
  );
}

export default function PhaseConfirmation(
  props: PhaseConfirmationProps
) {
  return (
    <>
      <PhaseConfirmationBody
        onDownload={props.onDownload}
      />
      <PhaseConfirmationFooter
        onStartOver={props.onStartOver}
        onClose={props.onClose}
      />
    </>
  );
}

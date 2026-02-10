"use client";

import { useCallback } from "react";
import IconDownload from "@/components/icons/icon-download";
import { cn } from "@/utils/class-names";
import { downloadFile } from "@/utils/download-file";
import { slugify } from "@/utils/slugify";

type DownloadButtonsProps = {
  typefaceName: string;
  specimenUrl?: string;
  trialFontUrls?: { styleName: string; file: string }[];
};

export default function DownloadButtons({
  typefaceName,
  specimenUrl,
  trialFontUrls,
}: DownloadButtonsProps) {
  const handleDownloadTrialFonts = useCallback(async () => {
    if (!trialFontUrls?.length) return;
    for (const font of trialFontUrls) {
      await downloadFile(
        font.file,
        `${slugify(typefaceName)}-${slugify(font.styleName)}-trial.woff2`
      );
    }
  }, [trialFontUrls, typefaceName]);

  const handleDownloadSpecimen = useCallback(async () => {
    if (!specimenUrl) return;
    await downloadFile(
      specimenUrl,
      `${slugify(typefaceName)}-specimen.pdf`
    );
  }, [specimenUrl, typefaceName]);

  const hasTrialFonts =
    trialFontUrls && trialFontUrls.length > 0;

  if (!hasTrialFonts && !specimenUrl) return null;

  return (
    <div className="relative flex w-full flex-row px-24 pb-[20vh]">
      <div className="relative flex w-full flex-row">
        {hasTrialFonts && (
          <button
            type="button"
            aria-label="Download trial fonts"
            name="download-trial-font"
            className={cn(
              "download-button-hover flex cursor-pointer flex-row items-center justify-between gap-x-2 rounded-2xl border border-neutral-300 px-16 py-12 font-medium font-whisper text-black text-sm transition-all duration-300 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:bg-white",
              specimenUrl ? "w-1/2" : "w-full"
            )}
            onClick={handleDownloadTrialFonts}
          >
            <div className="font-bold font-ortank text-2xl">
              Download trial fonts
            </div>
            <IconDownload className="h-6 w-6" />
          </button>
        )}
        {specimenUrl && (
          <button
            type="button"
            aria-label="Download specimen"
            name="download-specimen"
            className={cn(
              "download-button-hover flex cursor-pointer flex-row items-center justify-between gap-x-2 rounded-2xl border border-neutral-300 px-24 py-12 font-medium font-whisper text-black text-sm transition-all duration-300 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:bg-white",
              hasTrialFonts ? "w-1/2" : "w-full"
            )}
            onClick={handleDownloadSpecimen}
          >
            <div className="font-bold font-ortank text-2xl">
              Download specimen
            </div>
            <IconDownload className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
}

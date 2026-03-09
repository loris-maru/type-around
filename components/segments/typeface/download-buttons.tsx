"use client";

import { useCallback } from "react";
import IconDownload from "@/components/icons/icon-download";
import type { DownloadButtonsProps } from "@/types/components";
import { cn } from "@/utils/class-names";
import { downloadFile } from "@/utils/download-file";
import { slugify } from "@/utils/slugify";

export default function DownloadButtons({
  typefaceName,
  specimenUrl,
  trialFontUrls,
  showTrialFonts = true,
  showSpecimen = true,
  backgroundColor,
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
    showTrialFonts &&
    trialFontUrls &&
    trialFontUrls.length > 0;
  const hasSpecimen = showSpecimen && !!specimenUrl;

  if (!hasTrialFonts && !hasSpecimen) return null;

  const sectionStyle: React.CSSProperties = {};
  if (backgroundColor)
    sectionStyle.backgroundColor = backgroundColor;

  return (
    <div
      className="relative flex w-full flex-col px-5 py-12 lg:flex-row lg:px-24 lg:py-32"
      style={
        Object.keys(sectionStyle).length > 0
          ? sectionStyle
          : undefined
      }
    >
      <div className="relative flex w-full flex-row">
        {hasTrialFonts && (
          <button
            type="button"
            aria-label="Download trial fonts"
            name="download-trial-font"
            className={cn(
              "download-button-hover flex cursor-pointer flex-row items-center justify-between gap-2 rounded-2xl border border-neutral-300 px-8 py-8 font-medium font-whisper text-black text-sm transition-all duration-300 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:bg-white lg:px-16 lg:py-12",
              hasSpecimen ? "w-full lg:w-1/2" : "w-full"
            )}
            onClick={handleDownloadTrialFonts}
          >
            <div className="text-left font-bold font-ortank text-xl lg:text-2xl">
              Download trial fonts
            </div>
            <IconDownload className="h-6 w-6" />
          </button>
        )}
        {hasSpecimen && (
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

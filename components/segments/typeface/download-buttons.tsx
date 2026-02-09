"use client";

import IconDownload from "@/components/icons/icon-download";
import { cn } from "@/utils/class-names";

export default function DownloadButtons() {
  const handleDownloadTrialFonts = () => {
    console.log("Download trial fonts");
  };

  const handleDownloadSpecimen = () => {
    console.log("Download specimen");
  };

  return (
    <div className="relative flex w-full flex-row px-24 pb-[20vh]">
      <div className="relative flex w-full flex-row">
        <button
          type="button"
          aria-label="Download trial font"
          name="download-trial-font"
          className={cn(
            "download-button-hover flex w-1/2 flex-row items-center justify-between gap-x-2 rounded-2xl border border-neutral-300 px-16 py-12 font-medium font-whisper text-black text-sm transition-all duration-300 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:bg-white"
          )}
          onClick={handleDownloadTrialFonts}
        >
          <div className="font-bold font-ortank text-2xl">
            Download trial fonts
          </div>
          <IconDownload className="h-6 w-6" />
        </button>
        <button
          type="button"
          aria-label="Download specimen"
          name="download-specimen"
          className={cn(
            "download-button-hover flex w-1/2 flex-row items-center justify-between gap-x-2 rounded-2xl border border-neutral-300 px-24 py-12 font-medium font-whisper text-black text-sm transition-all duration-300 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:bg-white"
          )}
          onClick={handleDownloadSpecimen}
        >
          <div className="font-bold font-ortank text-2xl">
            Download specimen
          </div>
          <IconDownload className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

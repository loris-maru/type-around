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
    <div className="relative w-full px-24 flex flex-row pb-[20vh]">
      <div className="relative w-full flex flex-row">
        <button
          type="button"
          aria-label="Download trial font"
          name="download-trial-font"
          className={cn(
            "flex w-1/2 justify-between px-16 py-12 flex-row items-center gap-x-2 font-whisper text-sm text-black font-medium transition-all duration-300 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:bg-white download-button-hover border-l border-b border-neutral-300"
          )}
          style={{
            borderRadius: "0px 0px 0px 16px",
          }}
          onClick={handleDownloadTrialFonts}
        >
          <div className="font-ortank text-2xl font-bold">
            Download trial fonts
          </div>
          <IconDownload className="w-6 h-6" />
        </button>
        <div className="block w-px h-full bg-neutral-300" />
        <button
          type="button"
          aria-label="Download specimen"
          name="download-specimen"
          className={cn(
            "flex w-1/2 justify-between px-24 py-12 flex-row items-center gap-x-2 font-whisper text-sm text-black font-medium transition-all duration-300 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:bg-white download-button-hover border-r border-b border-neutral-300"
          )}
          style={{
            borderRadius: "0px 0px 16px 0px",
          }}
          onClick={handleDownloadSpecimen}
        >
          <div className="font-ortank text-2xl font-bold">
            Download specimen
          </div>
          <IconDownload className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

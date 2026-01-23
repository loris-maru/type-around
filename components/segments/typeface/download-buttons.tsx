"use client";

import IconDownload from "@/components/icons/icon-download";

export default function DownloadButtons() {
  const handleDownloadTrialFonts = () => {
    console.log("Download trial fonts");
  };

  const handleDownloadSpecimen = () => {
    console.log("Download specimen");
  };

  return (
    <div className="relative w-full px-24 flex flex-row pb-[20vh]">
      <div
        className="relative w-full flex flex-row border-b border-x border-t-0 border-neutral-300"
        style={{ borderRadius: "0 0 16px 16px" }}
      >
        <button
          type="button"
          aria-label="Download trial font"
          name="download-trial-font"
          className="flex w-1/2 justify-between px-16 py-12 flex-row items-center gap-x-2 font-whisper text-sm text-black font-medium"
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
          className="flex w-1/2 justify-between px-24 py-12 flex-row items-center gap-x-2 font-whisper text-sm text-black font-medium"
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

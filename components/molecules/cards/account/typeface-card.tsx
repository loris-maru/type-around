"use client";

import type { TypefaceCardProps } from "@/types/components";

export default function TypefaceCard({
  typeface,
  onClick,
}: TypefaceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex h-[320px] w-full cursor-pointer flex-col items-start justify-between rounded-lg border border-black bg-white p-6 shadow-button transition-all duration-300 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-button-hover"
    >
      <div className="flex flex-col gap-1">
        <div className="text-left font-bold font-ortank text-3xl text-black">
          {typeface.name}
          <br />
          {typeface.hangeulName}
        </div>
      </div>
      <div className="relative flex flex-row font-normal font-whisper text-black text-sm">
        <div className="flex flex-row flex-nowrap">
          Fonts: {typeface.fonts.length}
        </div>
      </div>
    </button>
  );
}

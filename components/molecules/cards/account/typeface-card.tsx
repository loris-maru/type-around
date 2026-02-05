"use client";

import { StudioTypeface } from "@/types/studio";

interface TypefaceCardProps {
  typeface: StudioTypeface;
  onClick?: () => void;
}

export default function TypefaceCard({
  typeface,
  onClick,
}: TypefaceCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative w-full h-[320px] border border-black rounded-lg flex flex-col items-start justify-between p-6 cursor-pointer bg-white shadow-button transition-all duration-300 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:shadow-button-hover"
    >
      <div className="flex flex-col gap-1">
        <div className="font-ortank text-3xl font-bold text-black">
          {typeface.name}
          <br />
          {typeface.hangeulName}
        </div>
      </div>
      <div className="relative flex flex-row text-sm font-whisper text-black font-normal">
        <div className="flex flex-row flex-nowrap">
          Fonts: {typeface.fonts.length}
        </div>
      </div>
    </button>
  );
}

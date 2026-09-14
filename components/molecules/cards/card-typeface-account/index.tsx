"use client";

import type { TypefaceCardProps } from "@/types/components";

export default function TypefaceCardAccount({
  typeface,
  onClick,
  index,
}: TypefaceCardProps) {
  const fontCount = typeface.fonts.length;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex h-[320px] w-full cursor-pointer flex-col items-start justify-between border border-black bg-white p-5 text-left transition-colors hover:bg-black hover:text-white"
    >
      <div className="flex w-full items-start justify-between">
        {index !== undefined && (
          <span className="swiss-num text-xs text-neutral-500 group-hover:text-neutral-400">
            {String(index).padStart(2, "0")}
          </span>
        )}
        <span className="inline-block h-2 w-2 bg-swiss-red" />
      </div>

      <div className="flex w-full flex-col gap-2">
        <div className="swiss-h1 break-words text-[2.25rem]">
          {typeface.name}
        </div>
        {typeface.hangeulName && (
          <div className="font-ortank text-lg leading-tight text-neutral-500 group-hover:text-neutral-400">
            {typeface.hangeulName}
          </div>
        )}
      </div>

      <div className="swiss-rule-light flex w-full items-baseline justify-between pt-3 group-hover:border-neutral-700">
        <span className="swiss-label text-neutral-500 group-hover:text-neutral-400">
          Fonts
        </span>
        <span className="swiss-num text-sm">
          {fontCount}
        </span>
      </div>
    </button>
  );
}

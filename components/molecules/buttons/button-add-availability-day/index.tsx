"use client";

import { RiAddLine } from "react-icons/ri";
import type { ButtonAddAvailabilityDayProps } from "@/types/components";

export default function ButtonAddAvailabilityDay({
  day,
  onClick,
  slotCount = 0,
}: ButtonAddAvailabilityDayProps) {
  const hasSlots = slotCount > 0;
  return (
    <button
      type="button"
      onClick={onClick}
      className="swiss-num flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 border border-swiss-rule bg-white text-sm text-swiss-ink transition-colors hover:border-swiss-ink"
    >
      <span>{day}</span>
      {hasSlots ? (
        <span className="min-w-4 bg-swiss-red px-1 py-0.5 text-center font-medium text-[10px] text-white leading-none">
          {slotCount}
        </span>
      ) : (
        <RiAddLine className="h-3 w-3 text-neutral-400" />
      )}
    </button>
  );
}

"use client";

import { RiAddLine } from "react-icons/ri";

type ButtonAddAvailabilityDayProps = {
  day: number;
  onClick: () => void;
  slotCount?: number;
};

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
      className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg border border-neutral-200 bg-white font-whisper text-neutral-800 text-sm transition-colors hover:border-neutral-400 hover:bg-neutral-50"
    >
      <span>{day}</span>
      {hasSlots ? (
        <span className="rounded-full bg-black px-1.5 py-0.5 text-[10px] text-white">
          {slotCount}
        </span>
      ) : (
        <RiAddLine className="h-3 w-3 text-neutral-400" />
      )}
    </button>
  );
}

"use client";

import type { ButtonSelectSlotProps } from "@/types/components";

export default function ButtonSelectSlot({
  slot,
  onClick,
}: ButtonSelectSlotProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="swiss-btn swiss-num min-h-9 px-3 text-xs tracking-normal normal-case"
    >
      {slot}
    </button>
  );
}

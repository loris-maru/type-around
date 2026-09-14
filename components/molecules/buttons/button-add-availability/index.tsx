"use client";

import type { ButtonAddAvailabilityProps } from "@/types/components";

export default function ButtonAddAvailability({
  onClick,
  disabled = false,
  children = "Add",
}: ButtonAddAvailabilityProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="swiss-btn swiss-btn-solid flex-1"
    >
      {children}
    </button>
  );
}

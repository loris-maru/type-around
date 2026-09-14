"use client";

import type { ButtonCancelFormProps } from "@/types/components";

export default function ButtonCancelForm({
  onClick,
  children = "Cancel",
  className = "",
}: ButtonCancelFormProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`swiss-btn ${className}`}
    >
      {children}
    </button>
  );
}

"use client";

import type { ButtonRemoveDesignerProps } from "@/types/components";

export default function ButtonRemoveDesigner({
  onClick,
  ariaLabel,
  children,
}: ButtonRemoveDesignerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="cursor-pointer transition-colors hover:text-red-500"
    >
      {children}
    </button>
  );
}

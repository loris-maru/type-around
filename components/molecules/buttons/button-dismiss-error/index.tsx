"use client";

import { RiCloseLine } from "react-icons/ri";
import type { ButtonDismissErrorProps } from "@/types/components";

export default function ButtonDismissError({
  onClick,
}: ButtonDismissErrorProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ml-auto text-swiss-red transition-colors hover:text-swiss-ink"
      aria-label="Dismiss error"
    >
      <RiCloseLine className="h-5 w-5" />
    </button>
  );
}

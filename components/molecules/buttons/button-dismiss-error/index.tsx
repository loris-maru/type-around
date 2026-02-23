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
      className="ml-auto text-red-500 transition-colors hover:text-red-700"
      aria-label="Dismiss error"
    >
      <RiCloseLine className="h-5 w-5" />
    </button>
  );
}

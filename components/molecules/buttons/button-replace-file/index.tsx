"use client";

import { RiRefreshLine } from "react-icons/ri";
import type { ButtonReplaceFileProps } from "@/types/components";

export default function ButtonReplaceFile({
  onClick,
}: ButtonReplaceFileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="swiss-btn flex-1"
    >
      <RiRefreshLine className="h-4 w-4" />
      Replace
    </button>
  );
}

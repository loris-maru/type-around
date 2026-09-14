"use client";

import { RiEyeLine } from "react-icons/ri";
import type { ButtonPreviewPageProps } from "@/types/components";

export default function ButtonPreviewPage({
  onClick,
}: ButtonPreviewPageProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="swiss-btn w-40"
    >
      <RiEyeLine className="h-4 w-4" />
      Preview
    </button>
  );
}

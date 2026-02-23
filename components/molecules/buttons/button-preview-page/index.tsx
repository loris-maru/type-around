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
      className="flex w-40 cursor-pointer items-center justify-center gap-2 rounded-lg border border-black bg-white py-3 text-black shadow-lg transition-colors hover:bg-neutral-100"
    >
      <RiEyeLine className="h-5 w-5" />
      Preview
    </button>
  );
}

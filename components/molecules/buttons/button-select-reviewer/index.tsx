"use client";

import type { ButtonSelectReviewerProps } from "@/types/components";

export default function ButtonSelectReviewer({
  children,
  onSelect,
}: ButtonSelectReviewerProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full cursor-pointer items-center gap-4 border-swiss-rule border-t bg-transparent py-4 text-left transition-colors last:border-b hover:bg-white"
    >
      {children}
    </button>
  );
}

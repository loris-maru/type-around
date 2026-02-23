"use client";

import { RiCloseLine } from "react-icons/ri";
import type { ModalHeaderProps } from "@/types/components";

export default function ModalHeader({
  title,
  onClose,
}: ModalHeaderProps) {
  return (
    <div className="flex shrink-0 items-center justify-between border-neutral-200 border-b p-6">
      <h2 className="font-bold font-ortank text-xl">
        {title}
      </h2>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close modal"
        className="rounded-lg p-1 transition-colors hover:bg-neutral-100"
      >
        <RiCloseLine className="h-6 w-6" />
      </button>
    </div>
  );
}

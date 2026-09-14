"use client";

import { RiAddFill } from "react-icons/ri";
import type { ButtonAddPackageProps } from "@/types/components";

export default function ButtonAddPackage({
  onClick,
}: ButtonAddPackageProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Add package"
      className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-2 border border-swiss-rule p-4 transition-colors hover:border-swiss-ink"
    >
      <RiAddFill className="h-8 w-8 text-neutral-400" />
      <span className="font-medium text-neutral-500">
        Add package
      </span>
    </button>
  );
}

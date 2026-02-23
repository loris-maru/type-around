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
      className="flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-neutral-300 border-dashed p-4 transition-all duration-300 ease-in-out hover:border-black hover:bg-neutral-50"
    >
      <RiAddFill className="h-8 w-8 text-neutral-400" />
      <span className="font-medium text-neutral-500">
        Add package
      </span>
    </button>
  );
}

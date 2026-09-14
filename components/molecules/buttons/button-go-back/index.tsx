"use client";

import { RiArrowLeftLine } from "react-icons/ri";
import type { ButtonGoBackProps } from "@/types/components";

export default function ButtonGoBack({
  onClick,
}: ButtonGoBackProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="swiss-label flex w-fit cursor-pointer items-center gap-2 text-neutral-500 transition-colors hover:text-swiss-ink"
    >
      <RiArrowLeftLine className="h-4 w-4" />
      Back
    </button>
  );
}

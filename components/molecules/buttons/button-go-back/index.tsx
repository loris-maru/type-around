"use client";

import { RiArrowLeftLine } from "react-icons/ri";

type ButtonGoBackProps = {
  onClick: () => void;
};

export default function ButtonGoBack({
  onClick,
}: ButtonGoBackProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-fit cursor-pointer items-center gap-2 font-whisper text-neutral-600 text-sm transition-colors hover:text-black"
    >
      <RiArrowLeftLine className="h-4 w-4" />
      Back
    </button>
  );
}

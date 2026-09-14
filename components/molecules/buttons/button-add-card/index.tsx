"use client";

import { RiAddFill } from "react-icons/ri";
import type { ButtonAddCardProps } from "@/types/components";

export default function ButtonAddCard({
  label,
  onClick,
}: ButtonAddCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[200px] cursor-pointer flex-col items-start justify-between border border-neutral-300 p-5 text-left transition-colors hover:border-black"
    >
      <RiAddFill className="h-6 w-6 text-neutral-400 transition-colors group-hover:text-swiss-red" />
      <span className="swiss-label text-neutral-500 transition-colors group-hover:text-black">
        {label}
      </span>
    </button>
  );
}

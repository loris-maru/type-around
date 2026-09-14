"use client";

import { RiCloseLine } from "react-icons/ri";
import type { ButtonCloseModalProps } from "@/types/components";

export default function ButtonCloseModal({
  onClick,
  children = "Close",
  variant = "text",
}: ButtonCloseModalProps) {
  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={onClick}
        className="p-1 text-neutral-500 transition-colors hover:text-swiss-red"
        aria-label="Close"
      >
        <RiCloseLine className="h-5 w-5" />
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="swiss-btn flex-1"
    >
      {children}
    </button>
  );
}

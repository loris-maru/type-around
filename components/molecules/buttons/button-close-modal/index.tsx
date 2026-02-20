"use client";

import { RiCloseLine } from "react-icons/ri";

type ButtonCloseModalProps = {
  onClick: () => void;
  children?: React.ReactNode;
  variant?: "icon" | "text";
};

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
        className="rounded p-1 transition-colors hover:bg-neutral-100"
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
      className="flex-1 cursor-pointer rounded-lg border border-neutral-300 px-4 py-2 font-whisper text-neutral-600 text-sm transition-colors hover:bg-neutral-50"
    >
      {children}
    </button>
  );
}

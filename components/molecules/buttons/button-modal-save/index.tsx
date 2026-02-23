"use client";

import { RiLoader4Line, RiSaveLine } from "react-icons/ri";
import type { ButtonModalSaveProps } from "@/types/components";

export default function ButtonModalSave({
  label,
  loadingLabel = "Saving...",
  disabled = false,
  loading,
  type = "button",
  onClick,
  "aria-label": ariaLabel,
  className = "",
}: ButtonModalSaveProps) {
  const showSpinner = disabled && loading === true;
  const isBusy = showSpinner;
  const displayLabel = showSpinner ? loadingLabel : label;
  const effectiveAriaLabel = ariaLabel ?? label;

  return (
    <button
      type={type}
      onClick={type === "button" ? onClick : undefined}
      disabled={disabled}
      aria-label={effectiveAriaLabel}
      aria-busy={isBusy}
      className={`flex w-full items-center justify-center gap-2 rounded-lg bg-black py-3 font-medium font-whisper text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400 ${className}`}
    >
      {showSpinner ? (
        <RiLoader4Line
          className="h-5 w-5 animate-spin"
          aria-hidden
        />
      ) : (
        <RiSaveLine
          className="h-5 w-5 shrink-0"
          aria-hidden
        />
      )}
      {displayLabel}
    </button>
  );
}

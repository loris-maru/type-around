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
      className={`swiss-btn swiss-btn-solid w-full ${className}`}
    >
      {showSpinner ? (
        <RiLoader4Line
          className="h-4 w-4 animate-spin"
          aria-hidden
        />
      ) : (
        <RiSaveLine
          className="h-4 w-4 shrink-0"
          aria-hidden
        />
      )}
      {displayLabel}
    </button>
  );
}

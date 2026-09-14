"use client";

import { RiSaveLine } from "react-icons/ri";
import type { ButtonSaveChangesProps } from "@/types/components";

export default function ButtonSaveChanges({
  onClick,
  disabled = false,
  label = "Save Changes",
  loadingLabel = "Saving...",
}: ButtonSaveChangesProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="swiss-btn swiss-btn-solid min-h-12 px-6"
    >
      <RiSaveLine className="h-4 w-4" />
      {disabled ? loadingLabel : label}
    </button>
  );
}

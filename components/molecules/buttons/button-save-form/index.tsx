"use client";

import { RiSaveLine } from "react-icons/ri";
import type { ButtonSaveFormProps } from "@/types/components";

export default function ButtonSaveForm({
  onClick,
  disabled = false,
  label = "Save",
  loadingLabel = "Saving...",
}: ButtonSaveFormProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="swiss-btn swiss-btn-solid w-40"
    >
      <RiSaveLine className="h-4 w-4" />
      {disabled ? loadingLabel : label}
    </button>
  );
}

"use client";

import { RiSaveLine } from "react-icons/ri";

type ButtonSaveFormProps = {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  loadingLabel?: string;
};

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
      className="flex w-40 cursor-pointer items-center justify-center gap-2 rounded-lg border border-black bg-black py-3 text-white shadow-lg transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
    >
      <RiSaveLine className="h-5 w-5" />
      {disabled ? loadingLabel : label}
    </button>
  );
}

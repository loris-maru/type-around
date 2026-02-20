"use client";

import { RiSaveLine } from "react-icons/ri";

type ButtonSaveChangesProps = {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  loadingLabel?: string;
};

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
      className="flex cursor-pointer items-center gap-2 rounded-lg bg-black px-6 py-3 text-white shadow-lg transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
    >
      <RiSaveLine className="h-5 w-5" />
      {disabled ? loadingLabel : label}
    </button>
  );
}

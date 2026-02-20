"use client";

import {
  RiExternalLinkLine,
  RiLoaderLine,
} from "react-icons/ri";

type ButtonViewStripeDashboardProps = {
  onClick: () => void;
  disabled?: boolean;
};

export default function ButtonViewStripeDashboard({
  onClick,
  disabled = false,
}: ButtonViewStripeDashboardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {disabled ? (
        <RiLoaderLine className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <span className="font-whisper font-medium">
            View Payouts & Settings
          </span>
          <RiExternalLinkLine className="h-4 w-4" />
        </>
      )}
    </button>
  );
}

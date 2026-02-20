"use client";

import { RiRefreshLine } from "react-icons/ri";

type ButtonReplaceFileProps = {
  onClick: () => void;
};

export default function ButtonReplaceFile({
  onClick,
}: ButtonReplaceFileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 font-medium font-whisper text-sm transition-colors hover:bg-neutral-50"
    >
      <RiRefreshLine className="h-4 w-4" />
      Replace
    </button>
  );
}

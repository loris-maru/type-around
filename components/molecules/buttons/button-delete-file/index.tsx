"use client";

import { RiDeleteBinLine } from "react-icons/ri";

type ButtonDeleteFileProps = {
  onClick: () => void;
};

export default function ButtonDeleteFile({
  onClick,
}: ButtonDeleteFileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 font-medium font-whisper text-red-600 text-sm transition-colors hover:bg-red-50"
    >
      <RiDeleteBinLine className="h-4 w-4" />
      Delete
    </button>
  );
}

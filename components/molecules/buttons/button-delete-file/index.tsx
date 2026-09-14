"use client";

import { RiDeleteBinLine } from "react-icons/ri";
import type { ButtonDeleteFileProps } from "@/types/components";

export default function ButtonDeleteFile({
  onClick,
}: ButtonDeleteFileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="swiss-btn flex-1 border-swiss-red text-swiss-red hover:!border-swiss-red hover:!bg-swiss-red"
    >
      <RiDeleteBinLine className="h-4 w-4" />
      Delete
    </button>
  );
}

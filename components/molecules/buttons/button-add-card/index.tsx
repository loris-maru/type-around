"use client";

import { RiAddFill } from "react-icons/ri";

type ButtonAddCardProps = {
  label: string;
  onClick: () => void;
};

export default function ButtonAddCard({
  label,
  onClick,
}: ButtonAddCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-300 p-4 transition-all duration-300 ease-in-out hover:border-black hover:bg-neutral-50"
    >
      <RiAddFill className="h-8 w-8 text-neutral-400" />
      <span className="font-medium text-neutral-500">
        {label}
      </span>
    </button>
  );
}

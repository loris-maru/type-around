"use client";

import { RiCloseLine } from "react-icons/ri";

type ButtonDismissErrorProps = {
  onClick: () => void;
};

export default function ButtonDismissError({
  onClick,
}: ButtonDismissErrorProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="ml-auto text-red-500 transition-colors hover:text-red-700"
      aria-label="Dismiss error"
    >
      <RiCloseLine className="h-5 w-5" />
    </button>
  );
}

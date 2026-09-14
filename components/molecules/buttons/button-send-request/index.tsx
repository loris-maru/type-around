"use client";

import type { ButtonSendRequestProps } from "@/types/components";

export default function ButtonSendRequest({
  onClick,
  className = "",
}: ButtonSendRequestProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`swiss-btn swiss-btn-solid ${className}`}
    >
      Send request
    </button>
  );
}

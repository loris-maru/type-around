"use client";

import type { ModalErrorDisplayProps } from "@/types/components";

export default function ModalErrorDisplay({
  message,
}: ModalErrorDisplayProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-600 text-sm">
      {message}
    </div>
  );
}

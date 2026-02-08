"use client";

import type { PurchaseCardProps } from "@/types/components";

export default function PurchaseCard({
  purchase,
}: PurchaseCardProps) {
  return (
    <div className="relative flex flex-col p-4 border border-black bg-white shadow-button rounded-lg">
      {/* Category badge */}
      <span className="inline-block self-start px-3 py-1 text-xs font-whisper font-medium uppercase tracking-wide rounded-full border border-neutral-300 text-neutral-500 mb-3">
        {purchase.category}
      </span>

      {/* Title */}
      <h3 className="font-ortank text-lg font-bold mb-2">
        {purchase.title}
      </h3>

      {/* Date & cost */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-neutral-200">
        <span className="text-sm text-neutral-500 font-whisper">
          {new Date(purchase.date).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            }
          )}
        </span>
        <span className="text-base font-ortank font-bold">
          ${purchase.cost}
        </span>
      </div>
    </div>
  );
}

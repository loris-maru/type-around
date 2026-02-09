"use client";

import { RiDownloadLine } from "react-icons/ri";
import { MOCK_PURCHASES } from "@/constant/MOCK_PURCHASES";

export default function MyAccountPurchases() {
  return (
    <div className="relative w-full">
      <h1 className="mb-8 font-bold font-ortank text-3xl">
        My Purchases
      </h1>

      {MOCK_PURCHASES.length === 0 ? (
        <p className="font-whisper text-neutral-500">
          No purchases yet.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-neutral-200">
          {MOCK_PURCHASES.map((purchase) => (
            <div
              key={purchase.id}
              className="flex items-center justify-between py-4"
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium font-whisper text-neutral-500 text-xs uppercase tracking-wide">
                  {purchase.category}
                </span>
                <span className="font-bold font-ortank">
                  {purchase.title}
                </span>
              </div>

              <div className="flex items-center gap-6">
                <span className="font-whisper text-neutral-500 text-sm">
                  {new Date(
                    purchase.date
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="min-w-12 text-right font-bold font-ortank text-base">
                  ${purchase.cost}
                </span>
                {purchase.category === "fonts" && (
                  <button
                    type="button"
                    className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-neutral-100"
                    title="Download again"
                    aria-label="Download again"
                  >
                    <RiDownloadLine className="h-5 w-5 text-black" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

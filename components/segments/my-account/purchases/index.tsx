"use client";

import { RiDownloadLine } from "react-icons/ri";
import { MOCK_PURCHASES } from "@/constant/MOCK_PURCHASES";

export default function MyAccountPurchases() {
  return (
    <div className="relative w-full">
      <h1 className="font-ortank text-3xl font-bold mb-8">
        My Purchases
      </h1>

      {MOCK_PURCHASES.length === 0 ? (
        <p className="text-neutral-500 font-whisper">
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
                <span className="text-xs font-whisper font-medium uppercase tracking-wide text-neutral-500">
                  {purchase.category}
                </span>
                <span className="font-ortank font-bold">
                  {purchase.title}
                </span>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-sm text-neutral-500 font-whisper">
                  {new Date(
                    purchase.date
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="text-base font-ortank font-bold min-w-12 text-right">
                  ${purchase.cost}
                </span>
                {purchase.category === "fonts" && (
                  <button
                    type="button"
                    className="p-2 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                    title="Download again"
                  >
                    <RiDownloadLine className="w-5 h-5 text-black" />
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

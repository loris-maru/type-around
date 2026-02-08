"use client";

import PurchaseCard from "@/components/molecules/cards/my-account/purchase-card";
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
        <div className="grid grid-cols-3 gap-4">
          {MOCK_PURCHASES.map((purchase) => (
            <PurchaseCard
              key={purchase.id}
              purchase={purchase}
            />
          ))}
        </div>
      )}
    </div>
  );
}

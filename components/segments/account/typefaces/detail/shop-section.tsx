"use client";

import CollapsibleSection from "@/components/global/collapsible-section";
import type { ShopSectionProps } from "@/types/components";

export default function ShopSection({
  printPrice,
  webPrice,
  appPrice,
  onInputChange,
}: ShopSectionProps) {
  return (
    <CollapsibleSection
      id="shop"
      title="Shop"
    >
      <div>
        <h3 className="mb-4 font-bold font-ortank text-base text-black">
          Prices
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="printPrice"
              className="mb-2 block font-normal font-whisper text-black text-sm"
            >
              Print
            </label>
            <div className="relative">
              <input
                type="number"
                id="printPrice"
                name="printPrice"
                value={printPrice}
                onChange={onInputChange}
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-neutral-300 px-4 py-3 pr-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="0"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-whisper text-neutral-500 text-sm">
                ₩
              </span>
            </div>
          </div>
          <div>
            <label
              htmlFor="webPrice"
              className="mb-2 block font-normal font-whisper text-black text-sm"
            >
              Web
            </label>
            <div className="relative">
              <input
                type="number"
                id="webPrice"
                name="webPrice"
                value={webPrice}
                onChange={onInputChange}
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-neutral-300 px-4 py-3 pr-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="0"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-whisper text-neutral-500 text-sm">
                ₩
              </span>
            </div>
          </div>
          <div>
            <label
              htmlFor="appPrice"
              className="mb-2 block font-normal font-whisper text-black text-sm"
            >
              App
            </label>
            <div className="relative">
              <input
                type="number"
                id="appPrice"
                name="appPrice"
                value={appPrice}
                onChange={onInputChange}
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-neutral-300 px-4 py-3 pr-10 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="0"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-whisper text-neutral-500 text-sm">
                ₩
              </span>
            </div>
          </div>
        </div>
      </div>
    </CollapsibleSection>
  );
}

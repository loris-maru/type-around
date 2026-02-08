"use client";

import type { StoreBlockData } from "@/types/layout";

export default function StudioStoreBlock({
  data,
}: {
  data: StoreBlockData;
}) {
  const { products } = data;

  if (!products || products.length === 0) return null;

  return (
    <section className="relative w-full px-10 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.key}
            className="flex flex-col border border-neutral-200 rounded-lg overflow-hidden bg-white"
          >
            {/* Product images */}
            {product.images.length > 0 && (
              <div className="relative w-full aspect-square bg-neutral-100 overflow-hidden">
                {/* biome-ignore lint: dynamic image URL from storage */}
                <img
                  src={product.images[0]}
                  alt={product.name || "Product"}
                  className="w-full h-full object-cover"
                />
                {product.images.length > 1 && (
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full font-whisper">
                    +{product.images.length - 1}
                  </span>
                )}
              </div>
            )}

            {/* Product info */}
            <div className="p-4 flex flex-col gap-1">
              <h4 className="text-base font-whisper font-semibold text-black">
                {product.name}
              </h4>
              {product.description && (
                <p className="text-sm font-whisper text-neutral-600">
                  {product.description}
                </p>
              )}
              {product.price > 0 && (
                <p className="text-lg font-ortank font-bold text-black mt-2">
                  ${product.price.toFixed(2)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

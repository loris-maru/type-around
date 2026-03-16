"use client";

import Image from "next/image";
import { useState } from "react";
import {
  RiArrowLeftSFill,
  RiArrowRightSFill,
  RiShoppingCart2Fill,
} from "react-icons/ri";
import { useCartStore } from "@/stores/cart";
import type { StoreProduct } from "@/types/layout";
import { cn } from "@/utils/class-names";

export default function CardProduct({
  product,
  studioId,
  studioSlug,
}: {
  product: StoreProduct;
  studioId?: string;
  studioSlug?: string;
}) {
  const addToCart = useCartStore((s) => s.addToCart);
  const [isDescriptionExpanded, setIsDescriptionExpanded] =
    useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] =
    useState(0);

  const images = product.images ?? [];
  const hasMultipleImages = images.length > 1;

  const goPrev = () => {
    setCurrentImageIndex((i) =>
      i <= 0 ? images.length - 1 : i - 1
    );
  };
  const goNext = () => {
    setCurrentImageIndex((i) =>
      i >= images.length - 1 ? 0 : i + 1
    );
  };

  const variantPrices =
    product.variants?.map((v) => v.price ?? 0) ?? [];
  const displayPrice =
    variantPrices.length > 0
      ? Math.min(...variantPrices)
      : (product.price ?? 0);

  const handleAddToCart = () => {
    const price =
      product.variants?.[0]?.price ?? product.price ?? 0;
    const variantName =
      product.variants?.[0]?.title ?? product.name;
    addToCart({
      fontId: product.key,
      typefaceSlug: "store",
      typefaceName: product.name,
      studioId,
      studioSlug,
      name: variantName,
      fullName: product.name,
      price,
      text: product.description || product.name,
      weight: 400,
      style: "normal",
      salesFileUrls: [],
    });
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white">
      {/* Product images */}
      {images.length > 0 && (
        <div className="relative">
          <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
            <Image
              src={images[currentImageIndex]}
              alt={`${product.name || "Product"} - image ${currentImageIndex + 1}`}
              fill
              className="object-cover"
              unoptimized
            />
            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous image"
                  className="absolute top-1/2 left-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                >
                  <RiArrowLeftSFill className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next image"
                  className="absolute top-1/2 right-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                >
                  <RiArrowRightSFill className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
          {hasMultipleImages && (
            <div className="flex justify-start gap-1.5 border-neutral-200 border-t bg-white p-2">
              {images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setCurrentImageIndex(i)}
                  aria-label={`View image ${i + 1}`}
                  className={cn(
                    "relative h-12 w-12 shrink-0 overflow-hidden rounded border-2 transition-colors",
                    i === currentImageIndex
                      ? "border-black"
                      : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <Image
                    src={img}
                    alt=""
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Product info */}
      <div className="flex flex-col gap-1 p-4">
        <h4 className="font-bold font-whisper text-black text-lg">
          {product.name}
        </h4>
        {product.description && (
          <div>
            <p
              className={cn(
                "font-whisper text-neutral-600 text-sm",
                isDescriptionExpanded
                  ? "line-clamp-none"
                  : "line-clamp-3"
              )}
            >
              {product.description}
            </p>
            <button
              type="button"
              onClick={() =>
                setIsDescriptionExpanded(
                  !isDescriptionExpanded
                )
              }
              className="rounded-full border border-neutral-300 px-3 py-1 font-whisper text-neutral-500 text-sm"
            >
              {isDescriptionExpanded
                ? "Read less"
                : "Read more"}
            </button>
          </div>
        )}
        <div className="flex flex-row justify-between">
          <p className="mt-2 font-bold font-whisper text-black text-lg">
            {displayPrice.toLocaleString()}₩
          </p>
          <button
            type="button"
            name="add-to-cart"
            aria-label="Add to cart"
            onClick={handleAddToCart}
            className="rounded-full border border-neutral-300 px-3 py-1 font-whisper text-neutral-500 text-sm transition-colors hover:border-neutral-400 hover:text-neutral-700"
          >
            <RiShoppingCart2Fill className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

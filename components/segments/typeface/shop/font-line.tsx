"use client";

import { useState } from "react";
import IconCart from "@/components/icons/icon-cart";
import { useCartStore } from "@/stores/cart";
import { getCartItemKey } from "@/types/cart";
import type { Font } from "@/types/typefaces";

export default function FontLine({
  font,
  typefaceName,
  typefaceSlug,
  studioId,
  studioSlug,
  text,
}: {
  font: Font & { id?: string; salesFiles?: string[] };
  typefaceName: string;
  typefaceSlug?: string;
  studioId?: string;
  studioSlug?: string;
  text: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const addToCart = useCartStore((s) => s.addToCart);
  const cartItemForComparison = {
    ...font,
    typefaceName,
    typefaceSlug,
    studioId,
    studioSlug,
    fontId: font.id,
  };
  const isInCart = useCartStore((s) =>
    s.cart.some(
      (i) =>
        getCartItemKey(i) ===
        getCartItemKey(cartItemForComparison)
    )
  );

  const handleAddToCart = () => {
    addToCart({
      ...font,
      typefaceName,
      typefaceSlug,
      studioId,
      studioSlug,
      fontId: font.id,
      salesFileUrls: font.salesFiles || [],
    });
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: hover detection for visual feedback only
    <div
      className="relative flex w-full flex-col gap-2"
      onMouseOver={() => setIsHovered(true)}
      onFocus={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
      onBlur={() => setIsHovered(false)}
    >
      <div className="relative flex w-full flex-row items-center justify-between px-10 font-normal font-whisper text-base text-black">
        <div className="capitalize">{font.name}</div>
        <div>
          {font.price > 0 ? `${font.price}₩` : "Free"}
        </div>
      </div>
      <div className="relative w-full px-10">
        <div
          className="relative z-10 w-full whitespace-nowrap font-black font-ortank text-9xl"
          style={{
            fontVariationSettings: `'wght' ${font.weight}`,
          }}
        >
          {text}
        </div>
        <button
          type="button"
          className="absolute top-1/2 right-10 z-30 flex h-20 w-20 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border transition-all duration-300 ease-in-out hover:border-white hover:bg-white"
          style={{
            opacity: isHovered ? 1 : 0.4,
            transform: isHovered
              ? "scale(1.1)"
              : "scale(1)",
            borderColor: isInCart
              ? "#16a34a"
              : isHovered
                ? "black"
                : "transparent",
            backgroundColor: isInCart
              ? "#f0fdf4"
              : "transparent",
          }}
          onClick={handleAddToCart}
          aria-label={
            isInCart
              ? "Already in cart"
              : `Add ${font.name} to cart`
          }
          disabled={isInCart}
        >
          <IconCart
            className={`h-7 w-7 ${isInCart ? "text-green-600" : "text-black"}`}
          />
        </button>
      </div>
    </div>
  );
}

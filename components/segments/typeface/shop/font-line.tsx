"use client";

import IconCart from "@/components/icons/icon-cart";
import { useState } from "react";

export default function FontLine({
  fontName,
  price,
  weight,
  text,
}: {
  fontName: string;
  price: number;
  weight: number;
  text: string;
}) {
  const [isHovered, setIsHovered] =
    useState<boolean>(false);

  const handleClick = () => {
    console.log("clicked");
  };
  return (
    <div
      className="relative w-full flex flex-col gap-2"
      onMouseOver={() => setIsHovered(true)}
      onFocus={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
      onBlur={() => setIsHovered(false)}
    >
      <div className="relative px-10 w-full flex flex-row justify-between items-center text-black font-whisper text-base font-normal">
        <div className="capitalize">{fontName}</div>
        <div>{price}</div>
      </div>
      <div className="relative px-10 w-full">
        <div
          className="relative z-10 w-full font-ortank text-9xl font-black whitespace-nowrap"
          style={{
            fontVariationSettings: `'wght' ${weight}`,
          }}
        >
          {text}
        </div>
        <button
          type="button"
          className="absolute z-30 top-1/2 -translate-y-1/2 right-10 w-20 h-20 flex items-center justify-center border border-black rounded-full transition-all duration-300 ease-in-out cursor-pointer bg-white/0 hover:bg-white hover:border-white"
          style={{
            opacity: isHovered ? 1 : 0.4,
            transform: isHovered
              ? "scale(1.1)"
              : "scale(1)",
            borderColor: isHovered
              ? "black"
              : "transparent",
          }}
          onClick={handleClick}
          aria-label="Add to cart"
          name="add-to-cart"
          title="Add to cart"
        >
          <IconCart className="w-7 h-7 text-black" />
        </button>
      </div>
    </div>
  );
}

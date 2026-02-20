"use client";

import { useState } from "react";
import IconCart from "@/components/icons/icon-cart";
import {
  InputCheckbox,
  InputDropdown,
} from "@/components/global/inputs";
import { useCartStore } from "@/stores/cart";
import { getCartItemKey } from "@/types/cart";
import type { Font } from "@/types/typefaces";

const USER_OPTIONS = [
  { value: "1-2", label: "1-2 users" },
  { value: "3-10", label: "3-10 users" },
  { value: "11-20", label: "11-20 users" },
  { value: "20+", label: "20+ users" },
] as const;

const LICENSE_OPTIONS = [
  { value: "web", label: "Web" },
  { value: "print", label: "Print" },
  { value: "app", label: "App" },
] as const;

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
  const [users, setUsers] =
    useState<(typeof USER_OPTIONS)[number]["value"]>("1-2");
  const [licenses, setLicenses] = useState<Set<string>>(
    new Set()
  );

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

  const hasLicense = licenses.size > 0;
  const isAddDisabled = isInCart || !hasLicense;

  const handleLicenseChange = (
    value: string,
    checked: boolean
  ) => {
    setLicenses((prev) => {
      const next = new Set(prev);
      if (checked) next.add(value);
      else next.delete(value);
      return next;
    });
  };

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

        <div className="relative z-10 mt-6 flex flex-row flex-wrap items-center gap-x-8 gap-y-2 font-whisper text-sm">
          <div className="flex flex-row items-center gap-2">
            <span className="font-medium text-black">
              Users
            </span>
            <InputDropdown
              value={users}
              options={USER_OPTIONS.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
              onChange={(v) =>
                setUsers(
                  v as (typeof USER_OPTIONS)[number]["value"]
                )
              }
              className="w-36 [&>button]:bg-transparent"
            />
          </div>
          <div className="flex flex-row items-center gap-2">
            <span className="font-medium text-black">
              License
            </span>
            <div className="flex flex-row gap-6">
              {LICENSE_OPTIONS.map((opt) => (
                <InputCheckbox
                  key={opt.value}
                  label={opt.label}
                  checked={licenses.has(opt.value)}
                  onChange={(checked) =>
                    handleLicenseChange(opt.value, checked)
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <div
          className="absolute top-1/2 right-10 z-30 -translate-y-1/2"
          title={
            isAddDisabled && !isInCart
              ? "Please choose a license type"
              : undefined
          }
        >
          <button
            type="button"
            className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border transition-all duration-300 ease-in-out hover:border-white hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              opacity: isHovered || isAddDisabled ? 1 : 0.4,
              transform:
                isHovered && !isAddDisabled
                  ? "scale(1.1)"
                  : "scale(1)",
              borderColor: isInCart
                ? "#16a34a"
                : isHovered && !isAddDisabled
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
                : !hasLicense
                  ? "Please choose a license type"
                  : `Add ${font.name} to cart`
            }
            disabled={isAddDisabled}
          >
            <IconCart
              className={`h-7 w-7 ${isInCart ? "text-green-600" : "text-black"}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

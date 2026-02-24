"use client";

import { motion, useAnimation } from "motion/react";
import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import {
  InputCheckbox,
  InputDropdown,
} from "@/components/global/inputs";
import { useCartStore } from "@/stores/cart";
import { getCartItemKey } from "@/types/cart";
import type { Font } from "@/types/typefaces";
import ButtonAddToCart from "./button-add-to-cart";

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
  const controls = useAnimation();

  const isMobile = useSyncExternalStore(
    useCallback((cb: () => void) => {
      const mq = window.matchMedia("(max-width: 1023px)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    }, []),
    useCallback(
      () =>
        typeof window !== "undefined"
          ? window.matchMedia("(max-width: 1023px)").matches
          : false,
      []
    ),
    useCallback(() => false, [])
  );

  useEffect(() => {
    if (isMobile) {
      controls.start({
        x: [null, -1000],
        transition: {
          duration: 10,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        },
      });
    } else {
      controls.start({
        x: 0,
        transition: {
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1],
        },
      });
    }
  }, [isMobile, controls]);

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
      className="relative flex w-full flex-col gap-2 py-6 lg:py-0"
      onMouseOver={() => setIsHovered(true)}
      onFocus={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
      onBlur={() => setIsHovered(false)}
    >
      <div className="relative flex w-full flex-row items-center justify-between px-5 font-normal font-whisper text-black text-xl lg:px-10 lg:text-base">
        <div className="capitalize">{font.name}</div>
        <div>
          {font.price > 0 ? `${font.price}₩` : "Free"}
        </div>
      </div>
      <div className="relative w-full px-0 lg:px-10">
        <div className="relative w-full overflow-hidden">
          <motion.div
            className="relative z-10 w-full whitespace-nowrap font-black font-ortank text-9xl"
            style={{
              fontVariationSettings: `'wght' ${font.weight}`,
            }}
            animate={controls}
            initial={{ x: 0 }}
          >
            {text}
          </motion.div>
        </div>

        <div className="relative z-10 mt-6 flex flex-col flex-wrap items-start gap-x-8 gap-y-2 px-4 font-whisper text-base lg:flex-row lg:items-center lg:px-0 lg:text-sm">
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
          className="absolute top-1/2 right-10 z-[100] -translate-y-1/2"
          title={
            isAddDisabled && !isInCart
              ? "Please choose a license type"
              : undefined
          }
        >
          <ButtonAddToCart
            isHovered={isHovered}
            isAddDisabled={isAddDisabled}
            isInCart={isInCart}
            hasLicense={hasLicense}
            font={font}
            handleAddToCart={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
}

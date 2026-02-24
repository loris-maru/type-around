"use client";

import Link from "next/link";
import { cn } from "@/utils/class-names";

// Explicit class map so Tailwind includes these at build time
const WIDTH_CLASSES: Record<
  string,
  Record<string, string>
> = {
  base: {
    "100px": "w-[100px]",
    "140px": "w-[140px]",
    "180px": "w-[180px]",
  },
  md: {
    "100px": "md:w-[100px]",
    "140px": "md:w-[140px]",
    "180px": "md:w-[180px]",
  },
  xl: {
    "100px": "xl:w-[100px]",
    "140px": "xl:w-[140px]",
    "180px": "xl:w-[180px]",
  },
};

export default function SimpleButton({
  label,
  href,
  width,
  widthMobile,
  widthSuperDesktop,
  className,
}: {
  label: string;
  href: string;
  width: string;
  widthMobile?: string;
  widthSuperDesktop?: string;
  className?: string;
}) {
  const hasResponsiveWidth =
    widthMobile !== undefined ||
    widthSuperDesktop !== undefined;
  const mobileW = widthMobile ?? width;
  const xlW = widthSuperDesktop ?? width;
  const widthClass =
    hasResponsiveWidth &&
    WIDTH_CLASSES.base[mobileW] &&
    WIDTH_CLASSES.md[width] &&
    WIDTH_CLASSES.xl[xlW]
      ? cn(
          WIDTH_CLASSES.base[mobileW],
          WIDTH_CLASSES.md[width],
          WIDTH_CLASSES.xl[xlW]
        )
      : undefined;
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const targetElement =
        document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        "button-shadow relative flex shrink-0 items-center justify-center rounded-lg border border-black bg-light-gray py-4 text-black transition-all duration-300 ease-in-out hover:-translate-x-1 hover:-translate-y-1 hover:bg-white",
        widthClass,
        className
      )}
      style={
        !widthClass && !className ? { width } : undefined
      }
    >
      {label}
    </Link>
  );
}

import type { LayoutBlockId } from "@/types/layout";

export const MARGIN_CLASS_MAP: Record<string, string> = {
  none: "px-0",
  s: "px-4",
  m: "px-8",
  l: "px-16",
  xl: "px-32",
};

export const ALIGNMENT_CLASS_MAP: Record<string, string> = {
  left: "items-start",
  center: "items-center",
  right: "items-end",
};

export const SIZE_CLASS_MAP: Record<string, string> = {
  full: "w-full",
  "20": "w-1/5",
  "40": "w-2/5",
  "50": "w-1/2",
  "60": "w-3/5",
  "80": "w-4/5",
};

/** Horizontal padding classes for Updates/Shop blocks (S, M, L, XL) */
export const BLOCK_MARGIN_CLASS_MAP: Record<
  string,
  string
> = {
  s: "px-4 lg:px-8",
  m: "px-8 lg:px-16",
  l: "px-12 lg:px-24",
  xl: "px-16 lg:px-32",
};

export const SPACER_CLASS_MAP: Record<string, string> = {
  s: "h-2 lg:h-8",
  m: "h-4 lg:h-16",
  l: "h-8 lg:h-32",
  xl: "h-12 lg:h-48",
};

export const CONFIGURABLE_BLOCKS: LayoutBlockId[] = [
  "about",
  "type-tester",
  "typeface-list",
  "fonts-in-use",
  "gallery",
  "image",
  "video",
  "spacer",
  "store",
  "blog",
  "socials",
];

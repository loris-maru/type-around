import type { LayoutBlockId } from "@/types/layout";

export const MARGIN_CLASS_MAP: Record<string, string> = {
  none: "py-0",
  s: "py-4",
  m: "py-8",
  l: "py-16",
  xl: "py-24",
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

export const SPACER_CLASS_MAP: Record<string, string> = {
  s: "h-8",
  m: "h-16",
  l: "h-32",
  xl: "h-48",
};

export const CONFIGURABLE_BLOCKS: LayoutBlockId[] = [
  "gallery",
  "image",
  "video",
  "spacer",
  "store",
  "typeface-list",
];

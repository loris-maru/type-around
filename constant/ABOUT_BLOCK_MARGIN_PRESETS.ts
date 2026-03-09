import type { BlockMarginSize } from "@/types/layout-typeface";

export const ABOUT_BLOCK_MARGIN_PRESETS: {
  value: BlockMarginSize;
  label: string;
  cssValue: string;
}[] = [
  { value: "s", label: "S", cssValue: "16px" },
  { value: "m", label: "M", cssValue: "42px" },
  { value: "l", label: "L", cssValue: "10vw" },
  { value: "xl", label: "XL", cssValue: "16vw" },
];

export const ABOUT_BLOCK_MARGIN_PRESET_MAP: Record<
  BlockMarginSize,
  string
> = {
  s: "16px",
  m: "42px",
  l: "10vw",
  xl: "16vw",
};

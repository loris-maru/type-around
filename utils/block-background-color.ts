import type { CSSProperties } from "react";
import { BLOCK_BACKGROUND_TRANSPARENT } from "@/constant/BLOCK_BACKGROUND_TRANSPARENT";

export function isTransparentBlockBackground(
  value?: string | null
): boolean {
  return (
    value?.toLowerCase() === BLOCK_BACKGROUND_TRANSPARENT
  );
}

export function getInitialBlockBackgroundColor(
  stored?: string,
  defaultHex = "#ffffff"
): string {
  if (!stored) return defaultHex;
  if (isTransparentBlockBackground(stored)) {
    return BLOCK_BACKGROUND_TRANSPARENT;
  }
  return stored;
}

export function getBlockSectionBackgroundStyle(
  backgroundColor?: string
): CSSProperties {
  if (
    !backgroundColor ||
    isTransparentBlockBackground(backgroundColor)
  ) {
    return {};
  }
  return { backgroundColor };
}

export function applyBlockBackgroundColor(
  style: CSSProperties,
  backgroundColor?: string
): void {
  const bgStyle =
    getBlockSectionBackgroundStyle(backgroundColor);
  if (bgStyle.backgroundColor) {
    style.backgroundColor = bgStyle.backgroundColor;
  }
}

export function getBlockBackgroundSwatchColor(
  backgroundColor?: string,
  defaultHex = "#ffffff"
): string {
  if (isTransparentBlockBackground(backgroundColor)) {
    return "transparent";
  }
  return backgroundColor ?? defaultHex;
}

import type { CSSProperties } from "react";

const DEFAULT_GRADIENT_FROM = "#FFF8E8";
const DEFAULT_GRADIENT_TO = "#F2F2F2";

export function getStudioPageBackgroundStyle(
  gradientFrom?: string,
  gradientTo?: string
): CSSProperties {
  const from =
    gradientFrom?.trim() || DEFAULT_GRADIENT_FROM;
  const to = gradientTo?.trim() || DEFAULT_GRADIENT_TO;
  return {
    background: `linear-gradient(180deg, ${from} 29.33%, ${to} 100%)`,
  };
}

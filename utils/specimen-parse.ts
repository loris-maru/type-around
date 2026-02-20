/**
 * Parses font size from "XXpx" string. Returns default (24) if invalid.
 */
export function parseFontSizePx(
  value: string | null | undefined
): number {
  if (!value) return 24;
  const match = value.match(/^(\d+(?:\.\d+)?)px$/);
  return match ? Number(match[1]) : 24;
}

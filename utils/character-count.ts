/**
 * Extract a numeric character count from the free-form `characters` field on a
 * StudioTypeface. Strips non-digits ("13,500", "2,350 + Hangeul" → 13500, 2350)
 * and falls back to 0 if no digits are present. Used by list/card views that
 * still need a plain number.
 */
export function getCharacterCount(
  value: string | number | undefined | null
): number {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const digits = value.replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

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

/**
 * Render the `characters` field for display. Returns the original string when
 * the source value already contains non-digit context (e.g. "2,350 + Hangeul"),
 * a locale-grouped number for numeric inputs (e.g. 13500 → "13,500"), or `null`
 * when there is nothing meaningful to show.
 */
export function formatCharacters(
  value: string | number | undefined | null
): string | null {
  if (value === undefined || value === null || value === "")
    return null;
  if (typeof value === "number") {
    if (!Number.isFinite(value) || value <= 0) return null;
    return value.toLocaleString("en-US");
  }
  const trimmed = value.trim();
  if (!trimmed) return null;
  // Preserve human-authored strings ("2,350 + Hangeul", "≈10k", etc.) verbatim.
  if (/[^0-9]/.test(trimmed)) return trimmed;
  const n = parseInt(trimmed, 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n.toLocaleString("en-US");
}

/**
 * Normalizes release date values to a 4-digit year string.
 * Supports legacy ISO dates (e.g. "2024-01-01") and year-only values.
 */
export function normalizeReleaseYear(
  value: string | undefined | null
): string {
  if (!value?.trim()) return "";

  const trimmed = value.trim();

  const yearPrefix = trimmed.match(/^(\d{4})/);
  if (yearPrefix) {
    return yearPrefix[1];
  }

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return String(parsed.getFullYear());
  }

  return "";
}

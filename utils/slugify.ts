/**
 * Converts a string to a URL-friendly slug
 * - Converts to lowercase
 * - Replaces spaces and special characters with hyphens
 * - Removes multiple consecutive hyphens
 * - Trims hyphens from start and end
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

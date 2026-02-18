import { generateUUID } from "./generate-uuid";

/**
 * Creates a unique specimen ID: typeface slug + UUID
 * e.g. "ortank-550e8400-e29b-41d4-a716-446655440000"
 */
export function createSpecimenId(
  typefaceSlug: string
): string {
  return `${typefaceSlug}-${generateUUID()}`;
}

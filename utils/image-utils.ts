import { IMAGE_EXTENSIONS } from "@/constant/IMAGE_EXTENSIONS";

/**
 * Extracts file extension from URL (lowercase, without query params).
 */
export function getExtensionFromUrl(url: string): string {
  const path = url.split("?")[0];
  return path.split(".").pop()?.toLowerCase() || "";
}

/**
 * Checks if URL points to a previewable image based on extension.
 */
export function isPreviewableImage(url: string): boolean {
  const ext = getExtensionFromUrl(url);
  return IMAGE_EXTENSIONS.includes(ext);
}

/**
 * Returns true if URL is valid for display (not empty, not blob URL).
 */
export function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith("blob:")) return false;
  return true;
}

/**
 * Page dimensions at 300 DPI (print resolution)
 * A4: 210mm × 297mm → 2480 × 3508 px
 * Letter: 8.5" × 11" → 2550 × 3300 px
 */
export const SPECIMEN_PAGE_DIMENSIONS_300DPI = {
  A4: { width: 2480, height: 3508 },
  Letter: { width: 2550, height: 3300 },
} as const;

export function getPageDimensions(
  format: "A4" | "Letter",
  orientation: "portrait" | "landscape"
): { width: number; height: number } {
  const dims = SPECIMEN_PAGE_DIMENSIONS_300DPI[format];
  return orientation === "portrait"
    ? { width: dims.width, height: dims.height }
    : { width: dims.height, height: dims.width };
}

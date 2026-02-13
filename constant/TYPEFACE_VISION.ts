export const TYPEFACE_VISION_USAGE = [
  "Text",
  "Title",
  "Headline",
  "Billboard",
  "Big Screen",
] as const;

export const TYPEFACE_VISION_CONTRAST = [
  "High",
  "Medium",
  "Low",
] as const;

export const TYPEFACE_VISION_WIDTH = [
  "Wide",
  "Semi-Wide",
  "Normal",
  "Semi-Condensed",
  "Condensed",
] as const;

export const TYPEFACE_VISION_PLAYFUL = [
  "Yes",
  "No",
] as const;

export const TYPEFACE_VISION_FRAME = [
  "In Frame",
  "Out of Frame",
] as const;

export const TYPEFACE_VISION_SERIF = [
  "옛부리",
  "새부리",
  "손멋부리",
  "곧은부리",
  "기타",
  "민부리",
] as const;

export type TypefaceVisionUsage =
  (typeof TYPEFACE_VISION_USAGE)[number];
export type TypefaceVisionContrast =
  (typeof TYPEFACE_VISION_CONTRAST)[number];
export type TypefaceVisionWidth =
  (typeof TYPEFACE_VISION_WIDTH)[number];
export type TypefaceVisionPlayful =
  (typeof TYPEFACE_VISION_PLAYFUL)[number];
export type TypefaceVisionFrame =
  (typeof TYPEFACE_VISION_FRAME)[number];
export type TypefaceVisionSerif =
  (typeof TYPEFACE_VISION_SERIF)[number];

export type TypefaceVision = {
  usage?: string;
  contrast?: string;
  width?: string;
  playful?: string;
  frame?: string;
  serif?: string;
};

/**
 * Build a searchable string from typeface vision for matching
 * queries like "playful font", "wide headline font", "high contrast"
 */
export function typefaceVisionToSearchString(
  vision: TypefaceVision | null | undefined
): string {
  if (!vision) return "";
  const parts: string[] = [];
  if (vision.usage)
    parts.push(vision.usage, vision.usage.toLowerCase());
  if (vision.contrast) {
    parts.push(
      vision.contrast,
      `${vision.contrast} contrast`
    );
  }
  if (vision.width) parts.push(vision.width);
  const playfulLower = vision.playful?.toLowerCase();
  if (playfulLower === "yes")
    parts.push("playful", "playful font");
  if (playfulLower === "no")
    parts.push("serious", "formal");
  if (vision.frame) {
    const frameLower = vision.frame.toLowerCase();
    parts.push(vision.frame, frameLower);
    if (frameLower.includes("in"))
      parts.push("in frame", "inframe");
    if (frameLower.includes("out"))
      parts.push("out of frame", "outframe");
  }
  if (vision.serif) parts.push(vision.serif);
  return parts.join(" ");
}

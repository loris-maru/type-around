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

function splitVisionValue(
  value: string | undefined
): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Build a searchable string from typeface vision for matching
 * queries like "playful font", "wide headline font", "high contrast"
 * Supports multi-select values (comma-separated)
 */
export function typefaceVisionToSearchString(
  vision: TypefaceVision | null | undefined
): string {
  if (!vision) return "";
  const parts: string[] = [];

  for (const usage of splitVisionValue(vision.usage)) {
    parts.push(usage, usage.toLowerCase());
  }
  for (const contrast of splitVisionValue(
    vision.contrast
  )) {
    parts.push(contrast, `${contrast} contrast`);
  }
  for (const width of splitVisionValue(vision.width)) {
    parts.push(width);
  }
  for (const playful of splitVisionValue(vision.playful)) {
    const playfulLower = playful.toLowerCase();
    if (playfulLower === "yes")
      parts.push("playful", "playful font");
    if (playfulLower === "no")
      parts.push("serious", "formal");
  }
  for (const frame of splitVisionValue(vision.frame)) {
    const frameLower = frame.toLowerCase();
    parts.push(frame, frameLower);
    if (frameLower.includes("in"))
      parts.push("in frame", "inframe");
    if (frameLower.includes("out"))
      parts.push("out of frame", "outframe");
  }
  for (const serif of splitVisionValue(vision.serif)) {
    parts.push(serif);
  }
  return parts.join(" ");
}

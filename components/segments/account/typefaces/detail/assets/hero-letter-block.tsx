"use client";

import FileDropZone from "@/components/global/file-drop-zone";
import type { HeroLetterBlockProps } from "@/types/components";

export default function HeroLetterBlock({
  value,
  onChange,
  studioId,
}: HeroLetterBlockProps) {
  return (
    <FileDropZone
      label="Single hero letter (SVG)"
      accept=".svg"
      value={value}
      onChange={onChange}
      description="Put a SVG of your typeface favorite letter. This will be used with an effect."
      icon="image"
      studioId={studioId}
      folder="icons"
    />
  );
}

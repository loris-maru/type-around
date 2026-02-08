"use client";

import {
  ALIGNMENT_CLASS_MAP,
  MARGIN_CLASS_MAP,
  SIZE_CLASS_MAP,
} from "@/constant/BLOCK_CLASS_MAPS";
import type { StudioVideoBlockProps } from "@/types/components";
import { cn } from "@/utils/class-names";

export default function StudioVideoBlock({
  data,
}: StudioVideoBlockProps) {
  if (!data.url) return null;

  const sectionStyle: React.CSSProperties = {};
  if (data.backgroundColor)
    sectionStyle.backgroundColor = data.backgroundColor;
  if (data.fontColor) sectionStyle.color = data.fontColor;

  return (
    <section
      className={cn(
        "relative w-full px-10 flex flex-col",
        MARGIN_CLASS_MAP[data.margin || "m"],
        ALIGNMENT_CLASS_MAP[data.alignment || "center"]
      )}
      style={sectionStyle}
    >
      <div
        className={cn(SIZE_CLASS_MAP[data.size || "full"])}
      >
        <div className="relative w-full overflow-hidden rounded-lg bg-neutral-100 aspect-video">
          {/* biome-ignore lint/a11y/useMediaCaption: user-uploaded video */}
          <video
            src={data.url}
            controls
            className="w-full h-full object-cover"
          />
        </div>
        {data.title && (
          <h4 className="mt-3 text-sm font-whisper font-semibold">
            {data.title}
          </h4>
        )}
        {data.description && (
          <p className="mt-1 text-sm font-whisper opacity-70">
            {data.description}
          </p>
        )}
      </div>
    </section>
  );
}

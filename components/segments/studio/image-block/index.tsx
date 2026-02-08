"use client";

import Image from "next/image";
import {
  ALIGNMENT_CLASS_MAP,
  MARGIN_CLASS_MAP,
  SIZE_CLASS_MAP,
} from "@/constant/BLOCK_CLASS_MAPS";
import type { StudioImageBlockProps } from "@/types/components";
import { cn } from "@/utils/class-names";

export default function StudioImageBlock({
  data,
}: StudioImageBlockProps) {
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
        <div className="relative w-full overflow-hidden rounded-lg bg-neutral-100">
          <Image
            src={data.url}
            alt={data.title || ""}
            width={1200}
            height={800}
            className="w-full h-auto object-cover"
            unoptimized
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

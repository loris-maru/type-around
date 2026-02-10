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

  const isNoMargin = (data.margin || "m") === "none";

  return (
    <section
      className={cn(
        "relative flex w-full flex-col",
        isNoMargin ? "px-0" : "px-10",
        MARGIN_CLASS_MAP[data.margin || "m"],
        ALIGNMENT_CLASS_MAP[data.alignment || "center"]
      )}
      style={sectionStyle}
    >
      <div
        className={cn(SIZE_CLASS_MAP[data.size || "full"])}
      >
        <div
          className={cn(
            "relative w-full overflow-hidden bg-neutral-100",
            !isNoMargin && "rounded-lg"
          )}
        >
          <Image
            src={data.url}
            alt={data.title || ""}
            width={1200}
            height={800}
            className="h-auto w-full object-cover"
            unoptimized
          />
        </div>
        {data.title && (
          <h4 className="mt-3 font-semibold font-whisper text-sm">
            {data.title}
          </h4>
        )}
        {data.description && (
          <p className="mt-1 font-whisper text-sm opacity-70">
            {data.description}
          </p>
        )}
      </div>
    </section>
  );
}

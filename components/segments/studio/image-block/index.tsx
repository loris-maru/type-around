"use client";

import type { ImageBlockData } from "@/types/layout";
import { cn } from "@/utils/class-names";

const MARGIN_MAP = {
  s: "py-4",
  m: "py-8",
  l: "py-16",
  xl: "py-24",
} as const;

const ALIGNMENT_MAP = {
  left: "items-start",
  center: "items-center",
  right: "items-end",
} as const;

export default function StudioImageBlock({
  data,
}: {
  data: ImageBlockData;
}) {
  if (!data.url) return null;

  return (
    <section
      className={cn(
        "relative w-full px-10 flex flex-col",
        MARGIN_MAP[data.margin || "m"],
        ALIGNMENT_MAP[data.alignment || "center"]
      )}
    >
      <div className="max-w-3xl w-full">
        <div className="relative w-full overflow-hidden rounded-lg bg-neutral-100">
          {/* biome-ignore lint: dynamic image URL from storage */}
          <img
            src={data.url}
            alt={data.title || ""}
            className="w-full h-auto object-cover"
          />
        </div>
        {data.title && (
          <h4 className="mt-3 text-sm font-whisper font-semibold text-black">
            {data.title}
          </h4>
        )}
        {data.description && (
          <p className="mt-1 text-sm font-whisper text-neutral-600">
            {data.description}
          </p>
        )}
      </div>
    </section>
  );
}

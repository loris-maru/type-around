"use client";

import Image from "next/image";
import type { StudioGalleryProps } from "@/types/components";

export default function StudioGallery({
  data,
}: StudioGalleryProps) {
  const { gap, images } = data;

  if (!images || images.length === 0) return null;

  const sectionStyle: React.CSSProperties = {};
  if (data.backgroundColor)
    sectionStyle.backgroundColor = data.backgroundColor;
  if (data.fontColor) sectionStyle.color = data.fontColor;

  return (
    <section
      className="relative w-full px-10 py-12"
      style={sectionStyle}
    >
      <div
        className="grid grid-cols-2 md:grid-cols-3"
        style={{ gap: `${gap || 0}px` }}
      >
        {images.map((img) => (
          <div
            key={img.key}
            className="flex flex-col"
          >
            <div className="relative w-full aspect-4/3 overflow-hidden rounded-lg bg-neutral-100">
              <Image
                src={img.url}
                alt={img.title || "Gallery image"}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            {img.showTitle && img.title && (
              <h4 className="mt-2 text-sm font-whisper font-semibold">
                {img.title}
              </h4>
            )}
            {img.showDescription && img.description && (
              <p className="mt-1 text-sm font-whisper opacity-70">
                {img.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

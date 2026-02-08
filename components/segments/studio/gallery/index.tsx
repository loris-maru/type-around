"use client";

import type { GalleryBlockData } from "@/types/layout";

export default function StudioGallery({
  data,
}: {
  data: GalleryBlockData;
}) {
  const { gap, images } = data;

  if (!images || images.length === 0) return null;

  return (
    <section className="relative w-full px-10 py-12">
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
              {/* biome-ignore lint: dynamic image URL from storage */}
              <img
                src={img.url}
                alt={img.title || "Gallery image"}
                className="w-full h-full object-cover"
              />
            </div>
            {img.showTitle && img.title && (
              <h4 className="mt-2 text-sm font-whisper font-semibold text-black">
                {img.title}
              </h4>
            )}
            {img.showDescription && img.description && (
              <p className="mt-1 text-sm font-whisper text-neutral-600">
                {img.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

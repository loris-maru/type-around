"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { RiCloseLine, RiSearch2Line } from "react-icons/ri";
import type { GalleryImage } from "@/types/layout";

export type GalleryCardProps = {
  image: GalleryImage;
};

export default function GalleryCard({
  image,
}: GalleryCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKey);
    return () =>
      document.removeEventListener("keydown", handleKey);
  }, [isOpen, close]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Card */}
      <div className="flex shrink-0 flex-col rounded-lg border border-neutral-300 shadow-medium-gray">
        {/* biome-ignore lint/a11y/useSemanticElements: div required for overlay hover + click interaction */}
        <div
          role="button"
          tabIndex={0}
          onClick={open}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              open();
            }
          }}
          aria-label={`View ${image.title || "gallery image"} fullscreen`}
          className="group relative aspect-4/3 w-full cursor-pointer overflow-hidden rounded-t-lg bg-neutral-100"
        >
          <Image
            src={image.url}
            alt={image.title || "Gallery image"}
            fill
            className="object-cover"
            unoptimized
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/30">
            <RiSearch2Line
              size={28}
              className="text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            />
          </div>
        </div>

        {(image.showTitle && image.title) ||
        (image.showDescription && image.description) ? (
          <div className="px-4 py-3">
            {image.showTitle && image.title && (
              <h4 className="font-semibold font-whisper text-sm">
                {image.title}
              </h4>
            )}
            {image.showDescription && image.description && (
              <p className="mt-1 font-whisper text-sm opacity-70">
                {image.description}
              </p>
            )}
          </div>
        ) : null}
      </div>

      {/* Fullscreen lightbox – rendered via portal to escape overflow:hidden parents */}
      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={close}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                close();
              }
            }}
            role="dialog"
            aria-modal="true"
            aria-label={
              image.title || "Gallery image fullscreen"
            }
          >
            {/* Close button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              aria-label="Close fullscreen view"
              className="absolute top-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <RiCloseLine size={24} />
            </button>

            {/* Image – stop propagation so clicking the image doesn't close the lightbox */}
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: key handler on parent dialog */}
            {/* biome-ignore lint/a11y/noStaticElementInteractions: stopPropagation only, not interactive */}
            <div
              className="relative max-h-[90vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={image.url}
                alt={image.title || "Gallery image"}
                width={1920}
                height={1080}
                className="max-h-[90vh] w-auto rounded-lg object-contain"
                unoptimized
              />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

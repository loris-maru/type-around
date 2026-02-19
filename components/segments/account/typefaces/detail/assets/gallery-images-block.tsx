"use client";

import GalleryUploader from "../gallery-uploader";
import type { GalleryImagesBlockProps } from "@/types/components";

export default function GalleryImagesBlock({
  studioId,
  images,
  onChange,
}: GalleryImagesBlockProps) {
  return (
    <div>
      <h4 className="mb-3 font-medium text-sm">
        Gallery images
      </h4>
      <GalleryUploader
        studioId={studioId}
        images={images}
        onChange={onChange}
      />
    </div>
  );
}

import StudioGallery from "@/components/segments/studio/gallery";
import TypefaceGallery from "@/components/segments/typeface/gallery";
import type { GalleryBlockData } from "@/types/layout";

export default function TypefacePageGalleryBlock({
  galleryData,
  galleryImages,
}: {
  galleryData: GalleryBlockData | undefined;
  galleryImages: { src: string; alt: string }[];
}) {
  if (galleryData?.images?.length) {
    return <StudioGallery data={galleryData} />;
  }
  if (galleryImages.length > 0) {
    return <TypefaceGallery images={galleryImages} />;
  }
  return null;
}

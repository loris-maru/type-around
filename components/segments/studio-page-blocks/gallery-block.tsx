import StudioGallery from "@/components/segments/studio/gallery";
import type { GalleryBlockData } from "@/types/layout";

export default function StudioPageGalleryBlock({
  data,
}: {
  data: GalleryBlockData | undefined;
}) {
  if (!data) return null;
  return <StudioGallery data={data} />;
}

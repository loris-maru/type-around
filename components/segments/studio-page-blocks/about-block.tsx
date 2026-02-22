import StudioProfile from "@/components/segments/studio/profile";
import type { Studio } from "@/types/studio";

export default function StudioAboutBlock({
  studio,
}: {
  studio: Studio;
}) {
  const totalFonts = studio.typefaces.reduce(
    (sum, tf) => sum + tf.fonts.length,
    0
  );
  return (
    <StudioProfile
      image={
        studio.thumbnail ||
        studio.avatar ||
        "/placeholders/studio_image_placeholder.webp"
      }
      families={studio.typefaces.length}
      fonts={totalFonts}
      description={studio.description || ""}
      designers={studio.designers}
    />
  );
}

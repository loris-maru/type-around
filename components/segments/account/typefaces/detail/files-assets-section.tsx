"use client";

import type { FilesAssetsSectionProps } from "@/types/components";
import AssetsSection from "./assets-section";
import EulaSection from "./eula-section";
import SpecimenSection from "./specimen-section";

export default function FilesAssetsSection({
  studioId,
  typefaceSlug,
  heroLetter,
  specimen,
  eula,
  variableFontFile,
  galleryImages,
  onFileChange,
  onGalleryImagesChange,
  onOpenEulaGenerator,
}: FilesAssetsSectionProps) {
  return (
    <>
      <SpecimenSection
        studioId={studioId}
        typefaceSlug={typefaceSlug}
        specimen={specimen}
        onSpecimenChange={onFileChange("specimen")}
      />
      <EulaSection
        studioId={studioId}
        eula={eula}
        onEulaChange={onFileChange("eula")}
        onOpenEulaGenerator={onOpenEulaGenerator}
      />
      <AssetsSection
        studioId={studioId}
        heroLetter={heroLetter}
        variableFontFile={variableFontFile}
        galleryImages={galleryImages}
        onHeroLetterChange={onFileChange("heroLetter")}
        onVariableFontFileChange={onFileChange(
          "variableFontFile"
        )}
        onGalleryImagesChange={onGalleryImagesChange}
      />
    </>
  );
}

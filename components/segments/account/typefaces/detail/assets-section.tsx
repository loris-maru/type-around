"use client";

import CollapsibleSection from "@/components/global/collapsible-section";
import type { AssetsSectionProps } from "@/types/components";
import GalleryImagesBlock from "./assets/gallery-images-block";
import HeroLetterBlock from "./assets/hero-letter-block";
import VariableFontFileBlock from "./assets/variable-font-file-block";

export default function AssetsSection({
  studioId,
  heroLetter,
  variableFontFile,
  galleryImages,
  onHeroLetterChange,
  onVariableFontFileChange,
  onGalleryImagesChange,
}: AssetsSectionProps) {
  return (
    <CollapsibleSection
      id="assets"
      title="Assets"
    >
      <div className="flex flex-col gap-10">
        <div className="flex flex-row gap-8">
          <div className="flex-1">
            <HeroLetterBlock
              value={heroLetter}
              onChange={onHeroLetterChange}
              studioId={studioId}
            />
          </div>
          <VariableFontFileBlock
            value={variableFontFile}
            onChange={onVariableFontFileChange}
            studioId={studioId}
          />
        </div>

        <GalleryImagesBlock
          studioId={studioId}
          images={galleryImages}
          onChange={onGalleryImagesChange}
        />
      </div>
    </CollapsibleSection>
  );
}

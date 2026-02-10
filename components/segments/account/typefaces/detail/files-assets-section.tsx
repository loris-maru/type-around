"use client";

import CollapsibleSection from "@/components/global/collapsible-section";
import FileDropZone from "@/components/global/file-drop-zone";
import type { FilesAssetsSectionProps } from "@/types/components";
import GalleryUploader from "./gallery-uploader";

export default function FilesAssetsSection({
  studioId,
  heroLetter,
  specimen,
  eula,
  variableFontFile,
  galleryImages,
  onFileChange,
  onGalleryImagesChange,
}: FilesAssetsSectionProps) {
  return (
    <CollapsibleSection
      id="assets"
      title="Assets"
    >
      <div className="flex flex-col gap-10">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <FileDropZone
              label="Single hero letter (SVG)"
              accept=".svg"
              value={heroLetter}
              onChange={onFileChange("heroLetter")}
              description="Put a SVG of your typeface favorite letter. This will be used with an effect."
              icon="image"
              studioId={studioId}
              folder="icons"
            />
          </div>

          <FileDropZone
            label="Specimen (PDF)"
            accept=".pdf"
            value={specimen}
            onChange={onFileChange("specimen")}
            description=".pdf"
            studioId={studioId}
            folder="documents"
          />

          <FileDropZone
            label="EULA (PDF)"
            accept=".pdf"
            value={eula}
            onChange={onFileChange("eula")}
            description=".pdf"
            studioId={studioId}
            folder="documents"
          />

          <FileDropZone
            label="Variable Font File"
            accept=".ttf,.otf,.woff,.woff2"
            value={variableFontFile}
            onChange={onFileChange("variableFontFile")}
            description=".ttf, .otf, .woff, .woff2"
            instruction="If available, add the variable font file. This will be used to display the variable font in the browser."
            studioId={studioId}
            folder="fonts"
          />
        </div>

        <div>
          <h4 className="mb-3 font-medium text-sm">
            Gallery images
          </h4>
          <GalleryUploader
            studioId={studioId}
            images={galleryImages}
            onChange={onGalleryImagesChange}
          />
        </div>
      </div>
    </CollapsibleSection>
  );
}

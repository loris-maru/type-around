"use client";

import FileDropZone from "@/components/global/file-drop-zone";
import CollapsibleSection from "@/components/global/collapsible-section";
import { FilesAssetsSectionProps } from "@/types/components";

export default function FilesAssetsSection({
  studioId,
  headerImage,
  heroLetter,
  specimen,
  eula,
  variableFontFile,
  onFileChange,
}: FilesAssetsSectionProps) {
  return (
    <CollapsibleSection
      id="assets"
      title="Assets"
    >
      <div className="grid grid-cols-2 gap-4">
        <FileDropZone
          label="Header Image"
          accept=".jpg,.jpeg,.png,.webp,.svg"
          value={headerImage}
          onChange={onFileChange("headerImage")}
          description=".jpg, .png, .webp, .svg"
          icon="image"
          studioId={studioId}
          folder="images"
        />

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
          studioId={studioId}
          folder="fonts"
        />
      </div>
    </CollapsibleSection>
  );
}

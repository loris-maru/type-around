"use client";

import FileDropZone from "@/components/global/file-drop-zone";
import CollapsibleSection from "@/components/global/collapsible-section";

interface FilesAssetsSectionProps {
  headerImage: string;
  specimen: string;
  eula: string;
  variableFontFile: string;
  onFileChange: (field: string) => (value: string) => void;
}

export default function FilesAssetsSection({
  headerImage,
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
        />

        <FileDropZone
          label="Specimen (PDF)"
          accept=".pdf"
          value={specimen}
          onChange={onFileChange("specimen")}
          description=".pdf"
        />

        <FileDropZone
          label="EULA (PDF)"
          accept=".pdf"
          value={eula}
          onChange={onFileChange("eula")}
          description=".pdf"
        />

        <FileDropZone
          label="Variable Font File"
          accept=".ttf,.otf,.woff,.woff2"
          value={variableFontFile}
          onChange={onFileChange("variableFontFile")}
          description=".ttf, .otf, .woff, .woff2"
        />
      </div>
    </CollapsibleSection>
  );
}

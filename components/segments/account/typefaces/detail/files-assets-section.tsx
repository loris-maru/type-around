"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStudio } from "@/hooks/use-studio";
import {
  RiFileAddLine,
  RiInformation2Line,
  RiSparklingLine,
} from "react-icons/ri";
import CollapsibleSection from "@/components/global/collapsible-section";
import FileDropZone from "@/components/global/file-drop-zone";
import type { FilesAssetsSectionProps } from "@/types/components";
import { createSpecimenId } from "@/utils/create-specimen-id";
import { generateUUID } from "@/utils/generate-uuid";
import GalleryUploader from "./gallery-uploader";

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
  const router = useRouter();
  const { addSpecimen } = useStudio();
  const [showEulaTooltip, setShowEulaTooltip] =
    useState(false);
  const [
    showVariableFontDropzone,
    setShowVariableFontDropzone,
  ] = useState(true);

  return (
    <CollapsibleSection
      id="assets"
      title="Assets"
    >
      <div className="flex flex-col gap-10">
        {/* Row 1: Hero letter + Variable Font File */}
        <div className="flex flex-row gap-8">
          <div className="flex-1">
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
          <div className="flex flex-1 flex-col gap-y-2">
            <div className="flex flex-row items-center justify-between">
              <span className="font-semibold text-black text-sm">
                Variable Font File
              </span>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={showVariableFontDropzone}
                  onChange={(e) =>
                    setShowVariableFontDropzone(
                      e.target.checked
                    )
                  }
                  className="rounded border-neutral-300"
                />
                <span className="font-whisper text-neutral-600 text-sm">
                  Show
                </span>
              </label>
            </div>
            {showVariableFontDropzone && (
              <FileDropZone
                label=""
                accept=".ttf,.otf,.woff,.woff2"
                value={variableFontFile}
                onChange={onFileChange("variableFontFile")}
                description=".ttf, .otf, .woff, .woff2"
                instruction="If available, add the variable font file. This will be used to display the variable font in the browser."
                studioId={studioId}
                folder="fonts"
              />
            )}
          </div>
        </div>

        {/* Row 2: Specimen PDF + Create Specimen */}
        <div className="flex flex-col gap-y-2">
          <span className="font-semibold text-black text-sm">
            Specimen PDF
          </span>
          <div className="grid grid-cols-2 items-stretch gap-8">
            <FileDropZone
              label=""
              accept=".pdf"
              value={specimen}
              onChange={onFileChange("specimen")}
              description=".pdf"
              studioId={studioId}
              folder="documents"
            />
            <button
              type="button"
              onClick={async () => {
                const specimenId =
                  createSpecimenId(typefaceSlug);
                await addSpecimen({
                  id: specimenId,
                  name: typefaceSlug,
                  typefaceSlug,
                  createdAt: new Date().toISOString(),
                  format: "A4",
                  orientation: "portrait",
                  pages: [
                    { id: generateUUID(), name: "Page 1" },
                  ],
                });
                router.push(
                  `/account/${studioId}/specimen/${specimenId}`
                );
              }}
              className="flex flex-col items-center justify-center rounded-lg border border-neutral-300 px-4 font-medium font-whisper text-black text-sm transition-colors hover:border-black hover:bg-white hover:shadow-button"
            >
              <RiFileAddLine className="mb-2 h-8 w-8 text-neutral-400" />
              <div>Create Specimen</div>
            </button>
          </div>
        </div>

        {/* ── EULA section ──────────────────────────────────────── */}
        <div className="flex flex-col gap-y-3">
          {/* Title with info tooltip */}
          <div className="flex items-center gap-x-2">
            <span className="font-semibold text-black text-sm">
              E.U.L.A.
            </span>
            <button
              type="button"
              aria-label="E.U.L.A. info tooltip"
              className="relative border-none bg-transparent p-0"
              onMouseEnter={() => setShowEulaTooltip(true)}
              onMouseLeave={() => setShowEulaTooltip(false)}
            >
              <RiInformation2Line className="h-4 w-4 cursor-help text-neutral-400" />
              {showEulaTooltip && (
                <div className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-neutral-200 bg-black px-3 py-1.5 text-white text-xs shadow-lg">
                  EULA: End User License Agreement
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" />
                </div>
              )}
            </button>
          </div>

          {/* Two columns: Upload | or | Generate */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-6">
            {/* Labels row */}
            <span className="font-whisper text-neutral-600 text-sm">
              Upload your PDF
            </span>
            <div />
            <span className="font-whisper text-neutral-600 text-sm">
              You don&apos;t have a PDF?
            </span>

            {/* Drop zone | or | Generate button */}
            <FileDropZone
              label=""
              accept=".pdf"
              value={eula}
              onChange={onFileChange("eula")}
              description=".pdf"
              studioId={studioId}
              folder="documents"
            />
            <div className="flex items-center justify-center">
              <span className="font-whisper text-neutral-400 text-xs">
                or
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenEulaGenerator}
              className="flex h-full min-h-0 flex-col items-center justify-center gap-2 rounded-lg border-2 border-neutral-300 p-6 transition-all duration-200 hover:border-black hover:bg-white hover:shadow-button"
            >
              <RiSparklingLine className="h-8 w-8 text-neutral-400" />
              <span className="font-medium font-whisper text-black text-sm">
                Generate EULA
              </span>
              <span className="font-whisper text-neutral-400 text-xs">
                Answer a few questions and we&apos;ll create
                a professional EULA for you.
              </span>
            </button>
          </div>
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

"use client";

import { useRouter } from "next/navigation";
import { RiFileAddLine } from "react-icons/ri";
import CollapsibleSection from "@/components/global/collapsible-section";
import FileDropZone from "@/components/global/file-drop-zone";
import { SpecimenCard } from "@/components/molecules/cards";
import { useStudio } from "@/hooks/use-studio";
import type { SpecimenSectionProps } from "@/types/components";
import { createSpecimenId } from "@/utils/create-specimen-id";
import { generateUUID } from "@/utils/generate-uuid";

export default function SpecimenSection({
  studioId,
  typefaceSlug,
  specimen,
  onSpecimenChange,
}: SpecimenSectionProps) {
  const router = useRouter();
  const { studio, addSpecimen } = useStudio();
  const typefaceSpecimens =
    studio?.specimens?.filter(
      (s) => s.typefaceSlug === typefaceSlug
    ) ?? [];

  const handleCreateSpecimen = async () => {
    const specimenId = createSpecimenId(typefaceSlug);
    await addSpecimen({
      id: specimenId,
      name: typefaceSlug,
      typefaceSlug,
      createdAt: new Date().toISOString(),
      format: "A4",
      orientation: "portrait",
      pages: [{ id: generateUUID(), name: "Page 1" }],
    });
    router.push(
      `/account/${studioId}/specimen/${specimenId}`
    );
  };

  return (
    <CollapsibleSection
      id="specimen"
      title="Specimen"
    >
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-y-2">
          <span className="font-semibold text-black text-sm">
            Specimen PDF
          </span>
          <div className="grid grid-cols-2 items-stretch gap-8">
            <FileDropZone
              label=""
              accept=".pdf"
              value={specimen}
              onChange={onSpecimenChange}
              description=".pdf"
              studioId={studioId}
              folder="documents"
            />
            <button
              type="button"
              onClick={handleCreateSpecimen}
              className="flex flex-col items-center justify-center rounded-lg border border-neutral-300 px-4 font-medium font-whisper text-black text-sm transition-colors hover:border-black hover:bg-white hover:shadow-button"
            >
              <RiFileAddLine className="mb-2 h-8 w-8 text-neutral-400" />
              <div>Create Specimen</div>
            </button>
          </div>
        </div>

        {typefaceSpecimens.length > 0 && (
          <div>
            <header>
              <div className="font-semibold text-black text-sm">
                Specimens
              </div>
              <div className="font-whisper text-neutral-600 text-sm">
                View and manage your specimen PDFs.
              </div>
            </header>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {typefaceSpecimens.map((s) => (
                <SpecimenCard
                  key={s.id}
                  specimen={s}
                  studioId={studioId}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { useStudio } from "@/hooks/use-studio";
import { generateUUID } from "@/utils/generate-uuid";

type TypefaceSpecimenPageProps = {
  specimenId: string;
};

export default function TypefaceSpecimenPage({
  specimenId,
}: TypefaceSpecimenPageProps) {
  const { studio, addSpecimen } = useStudio();
  const typefaceSlug = specimenId.slice(0, -37);
  const hasTriedAdd = useRef(false);

  useEffect(() => {
    if (!studio?.id || hasTriedAdd.current) return;
    const exists = studio.specimens?.some(
      (s) => s.id === specimenId
    );
    if (!exists) {
      hasTriedAdd.current = true;
      addSpecimen({
        id: specimenId,
        name: typefaceSlug,
        typefaceSlug,
        createdAt: new Date().toISOString(),
        format: "A4",
        orientation: "portrait",
        pages: [{ id: generateUUID(), name: "Page 1" }],
      });
    }
  }, [
    studio?.id,
    studio?.specimens,
    specimenId,
    typefaceSlug,
    addSpecimen,
  ]);

  return (
    <div className="flex min-h-[400px] flex-col rounded-lg border border-neutral-200 bg-white p-6">
      <p className="font-whisper text-neutral-600 text-sm">
        Specimen editor for {specimenId}
      </p>
    </div>
  );
}

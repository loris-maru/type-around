"use client";

import { useEffect, useRef } from "react";
import SpecimenPageWorkspace from "@/components/segments/account/specimen/specimen-page-workspace";
import { useStudio } from "@/hooks/use-studio";
import type { TypefaceSpecimenPageProps } from "@/types/specimen";
import { generateUUID } from "@/utils/generate-uuid";

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

  return <SpecimenPageWorkspace specimenId={specimenId} />;
}

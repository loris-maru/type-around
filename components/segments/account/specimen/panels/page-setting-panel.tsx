"use client";

import { useCallback, useMemo, useState } from "react";
import { useSpecimenPage } from "@/contexts/specimen-page-context";
import { useStudio } from "@/hooks/use-studio";
import type {
  ExpandedBlockId,
  PageSettingPanelProps,
} from "@/types/specimen";
import type {
  SpecimenPage,
  SpecimenPageBackground,
  SpecimenPageGrid,
  SpecimenPageMargins,
} from "@/types/studio";
import BackgroundParameterBlock from "./background-parameter-block";
import GridParameterBlock from "./grid-parameter-block";
import MarginsParameterBlock from "./margins-parameter-block";

const DEFAULT_MARGINS: SpecimenPageMargins = {
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
};

export default function PageSettingPanel({
  specimenId,
  studioId,
}: PageSettingPanelProps) {
  const { selectedPageId } = useSpecimenPage();
  const [expandedBlockId, setExpandedBlockId] =
    useState<ExpandedBlockId>("margins");
  const { studio, updateSpecimen } = useStudio();

  const specimen = useMemo(
    () =>
      studio?.specimens?.find((s) => s.id === specimenId),
    [studio?.specimens, specimenId]
  );

  const selectedPage = useMemo(
    () =>
      specimen?.pages?.find(
        (p) => p.id === selectedPageId
      ) ?? (null as SpecimenPage | null),
    [specimen?.pages, selectedPageId]
  );

  const effectivePages = useMemo<SpecimenPage[]>(() => {
    const pages = specimen?.pages ?? [];
    return pages.length > 0
      ? pages
      : [
          {
            id: "placeholder",
            name: "Page 1",
            margins: DEFAULT_MARGINS,
          },
        ];
  }, [specimen?.pages]);

  const selectedPageNumber = useMemo(() => {
    if (
      !selectedPageId ||
      selectedPageId === "placeholder" ||
      effectivePages.some((p) => p.id === "placeholder")
    )
      return null;
    const index = effectivePages.findIndex(
      (p) => p.id === selectedPageId
    );
    return index >= 0 ? index + 1 : null;
  }, [effectivePages, selectedPageId]);

  const handleMarginChange = useCallback(
    (
      pageId: string,
      field: keyof SpecimenPageMargins,
      value: number
    ) => {
      if (pageId === "placeholder") return;
      const page = effectivePages.find(
        (p) => p.id === pageId
      );
      if (!page) return;
      const currentMargins =
        page.margins ?? DEFAULT_MARGINS;
      const updatedPages = effectivePages.map((p) =>
        p.id === pageId
          ? {
              ...p,
              margins: {
                ...currentMargins,
                [field]: value,
              },
            }
          : p
      );
      updateSpecimen(specimenId, { pages: updatedPages });
    },
    [effectivePages, specimenId, updateSpecimen]
  );

  const handleBackgroundChange = useCallback(
    (
      pageId: string,
      background: SpecimenPageBackground
    ) => {
      if (pageId === "placeholder") return;
      const updatedPages = effectivePages.map((p) =>
        p.id === pageId ? { ...p, background } : p
      );
      updateSpecimen(specimenId, { pages: updatedPages });
    },
    [effectivePages, specimenId, updateSpecimen]
  );

  const handleGridChange = useCallback(
    (pageId: string, grid: SpecimenPageGrid) => {
      if (pageId === "placeholder") return;
      const updatedPages = effectivePages.map((p) =>
        p.id === pageId ? { ...p, grid } : p
      );
      updateSpecimen(specimenId, { pages: updatedPages });
    },
    [effectivePages, specimenId, updateSpecimen]
  );

  return (
    <div className="relative z-20 flex h-full min-h-0 w-[300px] shrink-0 flex-col overflow-y-auto rounded-lg border border-neutral-300 bg-white p-4">
      <div className="mb-4 flex w-full flex-row justify-between border-neutral-200 border-b pb-2 font-whisper text-sm">
        <div className="font-bold text-neutral-800">
          Settings
        </div>
        {selectedPageNumber != null && (
          <div className="font-normal text-neutral-500">
            Page {selectedPageNumber}
          </div>
        )}
      </div>

      {!selectedPage ||
      selectedPage.id === "placeholder" ? (
        <p className="font-whisper text-neutral-500 text-sm">
          Select a page to edit its parameters
        </p>
      ) : (
        <div className="flex flex-col">
          <MarginsParameterBlock
            page={selectedPage}
            onMarginChange={(field, value) =>
              handleMarginChange(
                selectedPage.id,
                field,
                value
              )
            }
            expanded={expandedBlockId === "margins"}
            onToggle={() =>
              setExpandedBlockId((prev) =>
                prev === "margins" ? null : "margins"
              )
            }
          />
          <BackgroundParameterBlock
            page={selectedPage}
            studioId={studioId}
            onChange={(background) =>
              handleBackgroundChange(
                selectedPage.id,
                background
              )
            }
            expanded={expandedBlockId === "background"}
            onToggle={() =>
              setExpandedBlockId((prev) =>
                prev === "background" ? null : "background"
              )
            }
          />
          <GridParameterBlock
            page={selectedPage}
            onGridChange={(grid) =>
              handleGridChange(selectedPage.id, grid)
            }
            expanded={expandedBlockId === "grid"}
            onToggle={() =>
              setExpandedBlockId((prev) =>
                prev === "grid" ? null : "grid"
              )
            }
          />
        </div>
      )}
    </div>
  );
}

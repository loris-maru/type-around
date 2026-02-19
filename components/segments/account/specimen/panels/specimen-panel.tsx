"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { RiCheckboxCircleFill } from "react-icons/ri";
import AddFontModal from "@/components/segments/account/typefaces/add-font-modal";
import { useSpecimenPage } from "@/contexts/specimen-page-context";
import { useStudio } from "@/hooks/use-studio";
import type { SpecimenPanelProps } from "@/types/components";
import type { Font, SpecimenPage } from "@/types/studio";
import { generateUUID } from "@/utils/generate-uuid";
import FontsParameterBlock from "./fonts-parameter-block";
import FormatParameterBlock from "./format-parameter-block";
import PagesParameterBlock from "./pages-parameter-block";

export default function SpecimenPanel({
  specimenId,
  typefaceSlug,
}: SpecimenPanelProps) {
  const { studio, updateSpecimen, updateTypeface } =
    useStudio();
  const {
    selectedPageId,
    setSelectedPageId,
    requestCenterOnPage,
  } = useSpecimenPage();
  const typeface = useMemo(
    () =>
      studio?.typefaces?.find(
        (t) => t.slug === typefaceSlug
      ),
    [studio?.typefaces, typefaceSlug]
  );
  const specimen = useMemo(
    () =>
      studio?.specimens?.find((s) => s.id === specimenId),
    [studio?.specimens, specimenId]
  );
  const specimenName = specimen?.name ?? typefaceSlug;
  const format = specimen?.format ?? "A4";
  const orientation = specimen?.orientation ?? "portrait";
  const pages = specimen?.pages ?? [];
  const effectivePages =
    pages.length > 0
      ? pages
      : [{ id: "placeholder", name: "Page 1" }];

  // Ensure at least 1 page for legacy specimens (empty or undefined pages)
  useEffect(() => {
    if (
      specimen &&
      specimenId &&
      (!specimen.pages || specimen.pages.length === 0)
    ) {
      updateSpecimen(specimenId, {
        pages: [{ id: generateUUID(), name: "Page 1" }],
      });
    }
  }, [specimen, specimenId, updateSpecimen]);

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(specimenName);
  const [isFontModalOpen, setIsFontModalOpen] =
    useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSaveFont = useCallback(
    (font: Font) => {
      if (!typeface) return;
      const existingFonts = typeface.fonts || [];
      const existingIndex = existingFonts.findIndex(
        (f) => f.id === font.id
      );
      const updatedFonts =
        existingIndex >= 0
          ? existingFonts.map((f) =>
              f.id === font.id ? font : f
            )
          : [...existingFonts, font];
      updateTypeface(typeface.id, { fonts: updatedFonts });
    },
    [typeface, updateTypeface]
  );

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(specimenName);
  };

  const handleValidate = async () => {
    if (editValue.trim()) {
      await updateSpecimen(specimenId, {
        name: editValue.trim(),
      });
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleValidate();
    if (e.key === "Escape") {
      setEditValue(specimenName);
      setIsEditing(false);
    }
  };

  const handleFormatChange = (value: string) => {
    updateSpecimen(specimenId, {
      format: value as "A4" | "Letter",
    });
  };

  const handleOrientationChange = (
    value: "portrait" | "landscape"
  ) => {
    updateSpecimen(specimenId, { orientation: value });
  };

  const hasPlaceholder = effectivePages.some(
    (p) => p.id === "placeholder"
  );

  const handlePagesReorder = (newPages: SpecimenPage[]) => {
    if (hasPlaceholder) return;
    updateSpecimen(specimenId, { pages: newPages });
  };

  const handleAddPage = () => {
    const basePages = hasPlaceholder
      ? [{ id: generateUUID(), name: "Page 1" }]
      : effectivePages;
    const newPage: SpecimenPage = {
      id: generateUUID(),
      name: `Page ${basePages.length + 1}`,
    };
    updateSpecimen(specimenId, {
      pages: [...basePages, newPage],
    });
  };

  const handlePageNameSave = (
    pageId: string,
    name: string
  ) => {
    if (pageId === "placeholder") {
      updateSpecimen(specimenId, {
        pages: [{ id: generateUUID(), name }],
      });
      return;
    }
    const updated = effectivePages.map((p) =>
      p.id === pageId ? { ...p, name } : p
    );
    updateSpecimen(specimenId, { pages: updated });
  };

  const handleDeletePage = (pageId: string) => {
    if (pageId === "placeholder") return;
    const updated = effectivePages.filter(
      (p) => p.id !== pageId
    );
    updateSpecimen(specimenId, { pages: updated });
    if (selectedPageId === pageId) setSelectedPageId(null);
  };

  const handlePageSelect = useCallback(
    (pageId: string) => {
      setSelectedPageId(pageId);
      requestCenterOnPage(pageId);
    },
    [setSelectedPageId, requestCenterOnPage]
  );

  return (
    <div className="relative z-20 flex h-full min-h-0 w-[300px] shrink-0 flex-col overflow-y-auto rounded-lg border border-neutral-300 bg-white p-4">
      <div className="mb-4 font-whisper text-neutral-600 text-sm">
        Specimen
      </div>
      {isEditing ? (
        <div className="mb-6 flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 rounded border border-neutral-300 px-3 py-2 font-whisper text-sm outline-none focus:border-black"
          />
          <button
            type="button"
            onClick={handleValidate}
            aria-label="Validate specimen name"
            className="shrink-0 text-green-600 transition-colors hover:text-green-700"
          >
            <RiCheckboxCircleFill size={24} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onDoubleClick={handleDoubleClick}
          className="mb-6 block w-full cursor-pointer rounded px-2 py-1 text-left font-whisper text-sm transition-colors hover:bg-neutral-50"
        >
          {specimenName}
        </button>
      )}

      <FontsParameterBlock
        fonts={typeface?.fonts ?? []}
        onAddFont={() => setIsFontModalOpen(true)}
      />

      <FormatParameterBlock
        format={format}
        orientation={orientation}
        onFormatChange={handleFormatChange}
        onOrientationChange={handleOrientationChange}
      />

      <PagesParameterBlock
        pages={effectivePages}
        selectedPageId={selectedPageId}
        onPageSelect={handlePageSelect}
        onReorder={handlePagesReorder}
        onAddPage={handleAddPage}
        onPageNameSave={handlePageNameSave}
        onDeletePage={handleDeletePage}
      />

      <AddFontModal
        isOpen={isFontModalOpen}
        onClose={() => setIsFontModalOpen(false)}
        onSave={handleSaveFont}
        studioId={studio?.id ?? ""}
      />
    </div>
  );
}

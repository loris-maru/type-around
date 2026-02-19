"use client";

import { useCallback, useMemo } from "react";
import {
  RiLayoutBottom2Line,
  RiLayoutLeft2Line,
  RiLayoutRight2Line,
  RiLayoutTop2Line,
} from "react-icons/ri";
import ColorPicker from "@/components/molecules/color-picker";
import {
  getTemplateByTitle,
  getTemplateGradient,
} from "@/constant/specimen-templates";
import type { SpecimenTemplate } from "@/constant/specimen-templates/schema";
import { useSpecimenPage } from "@/contexts/specimen-page-context";
import { useStudio } from "@/hooks/use-studio";
import type { PageSettingPanelProps } from "@/types/specimen";
import type {
  SpecimenPage,
  SpecimenPageBackground,
  SpecimenPageGrid,
  SpecimenPageMargins,
} from "@/types/studio";

const DEFAULT_GRID: SpecimenPageGrid = {
  columns: 2,
  rows: 2,
  gap: 8,
  showGrid: false,
};

const DEFAULT_MARGINS: SpecimenPageMargins = {
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
};

function getTemplatePreviewCells(
  template: SpecimenTemplate
): { id: string; background: string | null }[] {
  const cells: { id: string; background: string | null }[] =
    [];
  let slotIndex = 0;
  for (const cell of template.cells) {
    const span = (cell.colSpan ?? 1) * (cell.rowSpan ?? 1);
    for (let i = 0; i < span; i++) {
      cells.push({
        id: `${cell.uuid}-${i}`,
        background: cell.background,
      });
      slotIndex++;
    }
  }
  const totalSlots =
    template.grid.columns * template.grid.rows;
  while (cells.length < totalSlots) {
    cells.push({
      id: `empty-${slotIndex}`,
      background: null,
    });
    slotIndex++;
  }
  return cells;
}

export default function PageSettingPanel({
  specimenId,
}: PageSettingPanelProps) {
  const {
    selectedPageId,
    setTemplatePickerOpen,
    setSelectedCell,
    requestCenterOnPage,
  } = useSpecimenPage();
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

  const selectedTemplate = useMemo(() => {
    const templateId = selectedPage?.templateId;
    if (!templateId) return null;
    return getTemplateByTitle(templateId) ?? null;
  }, [selectedPage?.templateId]);

  const selectedPageNumber = useMemo(() => {
    if (!selectedPageId || selectedPageId === "placeholder")
      return null;
    const pages = specimen?.pages ?? [];
    if (pages.some((p) => p.id === "placeholder"))
      return null;
    const index = pages.findIndex(
      (p) => p.id === selectedPageId
    );
    return index >= 0 ? index + 1 : null;
  }, [specimen?.pages, selectedPageId]);

  const handleTemplateCellClick = useCallback(
    (pageId: string, cellIndex: number) => {
      setSelectedCell({ pageId, cellIndex });
      requestCenterOnPage(pageId);
    },
    [setSelectedCell, requestCenterOnPage]
  );

  const effectivePages = useMemo(() => {
    const pages = specimen?.pages ?? [];
    return pages.length > 0 ? pages : [];
  }, [specimen?.pages]);

  const handleGridChange = useCallback(
    (grid: SpecimenPageGrid) => {
      if (selectedPage?.id === "placeholder") return;
      const updatedPages = effectivePages.map((p) =>
        p.id === selectedPage?.id ? { ...p, grid } : p
      );
      updateSpecimen(specimenId, { pages: updatedPages });
    },
    [
      effectivePages,
      selectedPage?.id,
      specimenId,
      updateSpecimen,
    ]
  );

  const handleMarginsChange = useCallback(
    (margins: SpecimenPageMargins) => {
      if (selectedPage?.id === "placeholder") return;
      const updatedPages = effectivePages.map((p) =>
        p.id === selectedPage?.id ? { ...p, margins } : p
      );
      updateSpecimen(specimenId, { pages: updatedPages });
    },
    [
      effectivePages,
      selectedPage?.id,
      specimenId,
      updateSpecimen,
    ]
  );

  const handleBackgroundChange = useCallback(
    (background: SpecimenPageBackground) => {
      if (selectedPage?.id === "placeholder") return;
      const updatedPages = effectivePages.map((p) =>
        p.id === selectedPage?.id ? { ...p, background } : p
      );
      updateSpecimen(specimenId, { pages: updatedPages });
    },
    [
      effectivePages,
      selectedPage?.id,
      specimenId,
      updateSpecimen,
    ]
  );

  const handleFontColorChange = useCallback(
    (textColor: string) => {
      if (selectedPage?.id === "placeholder") return;
      const cells = selectedPage?.cells ?? [];
      const updatedCells = cells.map((c) => ({
        ...c,
        textColor,
      }));
      const updatedPages = effectivePages.map((p) =>
        p.id === selectedPage?.id
          ? { ...p, cells: updatedCells }
          : p
      );
      updateSpecimen(specimenId, { pages: updatedPages });
    },
    [
      effectivePages,
      selectedPage?.id,
      selectedPage?.cells,
      specimenId,
      updateSpecimen,
    ]
  );

  if (!selectedPage || selectedPage.id === "placeholder") {
    return (
      <div className="relative z-20 flex h-full min-h-0 w-[300px] shrink-0 flex-col overflow-y-auto rounded-lg border border-neutral-300 bg-white p-4">
        <div className="mb-4 flex w-full flex-row justify-between border-neutral-200 border-b pb-2 font-whisper text-sm">
          <div className="font-bold text-neutral-800">
            Settings
          </div>
        </div>
        <p className="font-whisper text-neutral-500 text-sm">
          Select a page to edit its parameters
        </p>
      </div>
    );
  }

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

      <div className="flex flex-col gap-4">
        {selectedTemplate ? (
          <>
            <SelectedTemplateCard
              template={selectedTemplate}
              page={selectedPage}
              onCellClick={(cellIndex) =>
                handleTemplateCellClick(
                  selectedPage.id,
                  cellIndex
                )
              }
              onGridChange={handleGridChange}
              onMarginsChange={handleMarginsChange}
              onBackgroundChange={handleBackgroundChange}
              onFontColorChange={handleFontColorChange}
            />
            <button
              type="button"
              onClick={() => setTemplatePickerOpen(true)}
              className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2 font-whisper text-neutral-600 text-sm transition-colors hover:border-neutral-300 hover:bg-neutral-50"
            >
              Change template
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setTemplatePickerOpen(true)}
            className="w-full rounded-lg border border-neutral-300 border-dashed bg-neutral-50 px-4 py-6 font-whisper text-neutral-500 text-sm transition-colors hover:border-neutral-400 hover:bg-neutral-100"
          >
            Choose template
          </button>
        )}
      </div>
    </div>
  );
}

function SelectedTemplateCard({
  template,
  page,
  onCellClick,
  onGridChange,
  onMarginsChange,
  onBackgroundChange,
  onFontColorChange,
}: {
  template: SpecimenTemplate;
  page: SpecimenPage;
  onCellClick: (cellIndex: number) => void;
  onGridChange: (grid: SpecimenPageGrid) => void;
  onMarginsChange: (margins: SpecimenPageMargins) => void;
  onBackgroundChange: (
    background: SpecimenPageBackground
  ) => void;
  onFontColorChange: (textColor: string) => void;
}) {
  const gradient = getTemplateGradient(template.title);
  const grid = page.grid ?? DEFAULT_GRID;
  const margins = page.margins ?? DEFAULT_MARGINS;
  const background = useMemo(
    () =>
      page.background ?? {
        type: "color" as const,
        color: "#ffffff",
        image: "",
      },
    [page.background]
  );
  const defaultFontColor =
    page.cells?.[0]?.textColor ??
    template.fontColor ??
    "#000000";

  const previewCells = useMemo(
    () => getTemplatePreviewCells(template),
    [template]
  );

  const handleGridFieldChange = useCallback(
    (field: "columns" | "rows" | "gap", value: number) => {
      onGridChange({ ...grid, [field]: value });
    },
    [grid, onGridChange]
  );

  const handleMarginChange = useCallback(
    (field: keyof SpecimenPageMargins, value: number) => {
      onMarginsChange({ ...margins, [field]: value });
    },
    [margins, onMarginsChange]
  );

  const handleBackgroundColorChange = useCallback(
    (color: string) => {
      onBackgroundChange({
        type: "color",
        color,
        image: "",
      });
    },
    [onBackgroundChange]
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-3">
        <div
          className="h-12 w-12 shrink-0 rounded-full"
          style={{ background: gradient }}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium font-whisper text-neutral-800 text-sm">
            {template.title}
          </div>
          <div className="font-whisper text-neutral-500 text-xs">
            {grid.columns} × {grid.rows}
          </div>
        </div>
      </div>
      <div
        className="grid w-full gap-1 rounded border border-neutral-200 bg-neutral-100 p-2"
        style={{
          gridTemplateColumns: `repeat(${grid.columns}, 1fr)`,
          gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
          aspectRatio: `${grid.columns} / ${grid.rows}`,
        }}
      >
        {previewCells.map((cell, i) => (
          <button
            key={`${page.id}-${cell.id}`}
            type="button"
            onClick={() => onCellClick(i)}
            className="rounded-sm border border-neutral-200 bg-white transition-colors hover:border-neutral-400 hover:bg-neutral-50"
            style={{
              backgroundColor: cell.background ?? undefined,
            }}
            aria-label={`Edit cell ${i + 1}`}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2 font-whisper text-neutral-600 text-xs">
        <div className="grid grid-cols-3 gap-2">
          <label className="flex flex-col gap-0.5">
            <span className="text-neutral-500">
              Columns
            </span>
            <input
              type="number"
              min={1}
              value={grid.columns}
              onChange={(e) =>
                handleGridFieldChange(
                  "columns",
                  Math.max(1, Number(e.target.value) || 1)
                )
              }
              className="rounded border border-neutral-300 px-2 py-1 text-sm outline-none focus:border-black"
            />
          </label>
          <label className="flex flex-col gap-0.5">
            <span className="text-neutral-500">Rows</span>
            <input
              type="number"
              min={1}
              value={grid.rows}
              onChange={(e) =>
                handleGridFieldChange(
                  "rows",
                  Math.max(1, Number(e.target.value) || 1)
                )
              }
              className="rounded border border-neutral-300 px-2 py-1 text-sm outline-none focus:border-black"
            />
          </label>
          <label className="flex flex-col gap-0.5">
            <span className="text-neutral-500">Gap</span>
            <input
              type="number"
              min={0}
              value={grid.gap}
              onChange={(e) =>
                handleGridFieldChange(
                  "gap",
                  Math.max(0, Number(e.target.value) || 0)
                )
              }
              className="rounded border border-neutral-300 px-2 py-1 text-sm outline-none focus:border-black"
            />
          </label>
        </div>
        <div className="my-2 h-px w-full bg-neutral-300" />
        <div className="flex flex-col gap-2">
          <span className="font-whisper text-neutral-500 text-xs">
            Margin
          </span>
          <div className="grid grid-cols-2 gap-2">
            <label
              htmlFor={`margin-left-${page.id}`}
              className="flex items-center gap-2 font-whisper text-neutral-600 text-xs"
            >
              <RiLayoutLeft2Line className="h-4 w-4 shrink-0" />
              <input
                id={`margin-left-${page.id}`}
                type="number"
                min={0}
                value={margins.left}
                onChange={(e) =>
                  handleMarginChange(
                    "left",
                    Math.max(0, Number(e.target.value) || 0)
                  )
                }
                className="w-full rounded border border-neutral-300 px-2 py-1 text-sm outline-none focus:border-black"
              />
            </label>
            <label
              htmlFor={`margin-top-${page.id}`}
              className="flex items-center gap-2 font-whisper text-neutral-600 text-xs"
            >
              <RiLayoutTop2Line className="h-4 w-4 shrink-0" />
              <input
                id={`margin-top-${page.id}`}
                type="number"
                min={0}
                value={margins.top}
                onChange={(e) =>
                  handleMarginChange(
                    "top",
                    Math.max(0, Number(e.target.value) || 0)
                  )
                }
                className="w-full rounded border border-neutral-300 px-2 py-1 text-sm outline-none focus:border-black"
              />
            </label>
            <label
              htmlFor={`margin-right-${page.id}`}
              className="flex items-center gap-2 font-whisper text-neutral-600 text-xs"
            >
              <RiLayoutRight2Line className="h-4 w-4 shrink-0" />
              <input
                id={`margin-right-${page.id}`}
                type="number"
                min={0}
                value={margins.right}
                onChange={(e) =>
                  handleMarginChange(
                    "right",
                    Math.max(0, Number(e.target.value) || 0)
                  )
                }
                className="w-full rounded border border-neutral-300 px-2 py-1 text-sm outline-none focus:border-black"
              />
            </label>
            <label
              htmlFor={`margin-bottom-${page.id}`}
              className="flex items-center gap-2 font-whisper text-neutral-600 text-xs"
            >
              <RiLayoutBottom2Line className="h-4 w-4 shrink-0" />
              <input
                id={`margin-bottom-${page.id}`}
                type="number"
                min={0}
                value={margins.bottom}
                onChange={(e) =>
                  handleMarginChange(
                    "bottom",
                    Math.max(0, Number(e.target.value) || 0)
                  )
                }
                className="w-full rounded border border-neutral-300 px-2 py-1 text-sm outline-none focus:border-black"
              />
            </label>
          </div>
        </div>
        <div className="my-2 h-px w-full bg-neutral-300" />
        <div className="flex flex-col gap-2">
          <span className="font-whisper text-neutral-500 text-xs">
            Colors
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-whisper text-neutral-500 text-xs">
                Background
              </span>
              <ColorPicker
                id={`page-bg-${page.id}`}
                value={
                  background.type === "color"
                    ? (background.color ?? "#ffffff")
                    : "#ffffff"
                }
                onChange={handleBackgroundColorChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-whisper text-neutral-500 text-xs">
                Font
              </span>
              <ColorPicker
                id={`page-font-${page.id}`}
                value={defaultFontColor}
                onChange={onFontColorChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import {
  RiAlignItemBottomLine,
  RiAlignItemTopLine,
  RiAlignItemVerticalCenterLine,
  RiAlignJustify,
  RiAlignLeft,
  RiAlignRight,
  RiArrowLeftLine,
  RiLayoutBottom2Line,
  RiLayoutLeft2Line,
  RiLayoutRight2Line,
  RiLayoutTop2Line,
} from "react-icons/ri";
import CustomSelect from "@/components/global/custom-select";
import FileDropZone from "@/components/global/file-drop-zone";
import { FontDropdown } from "@/components/global/typetester/parameters";
import ColorPicker from "@/components/molecules/color-picker";
import { useSpecimenPage } from "@/contexts/specimen-page-context";
import { useStudio } from "@/hooks/use-studio";
import type { CellSettingPanelProps } from "@/types/specimen";
import {
  DEFAULT_SPECIMEN_PAGE_CELL,
  type SpecimenPage,
  type SpecimenPageCell,
  type SpecimenPageCellBackground,
  type SpecimenPageCellPadding,
} from "@/types/studio";
import { cn } from "@/utils/class-names";
import ParameterBlock from "./parameter-block";

const BACKGROUND_TYPE_OPTIONS = [
  { value: "color", label: "Color" },
  { value: "gradient", label: "Gradient" },
  { value: "image", label: "Image" },
];

const DEFAULT_CELL_BG: SpecimenPageCellBackground = {
  type: "color",
  color: "#ffffff",
  gradient: { from: "#FFF8E8", to: "#F2F2F2" },
  image: "",
};

const DEFAULT_PADDING: SpecimenPageCellPadding = {
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
};

function getCellBackground(
  cell: SpecimenPageCell | undefined
): SpecimenPageCellBackground {
  return cell?.background ?? DEFAULT_CELL_BG;
}

function getCellPadding(
  cell: SpecimenPageCell | undefined
): SpecimenPageCellPadding {
  return cell?.padding ?? DEFAULT_PADDING;
}

function handleHexChange(
  value: string,
  setter: (v: string) => void
): void {
  let v = value;
  if (!v.startsWith("#")) v = `#${v}`;
  if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) setter(v);
}

function CellPaddingBlock({
  padding,
  pageId,
  cellIndex,
  effectivePages,
  specimenId,
  updateSpecimen,
}: {
  padding: SpecimenPageCellPadding;
  pageId: string;
  cellIndex: number;
  effectivePages: SpecimenPage[];
  specimenId: string;
  updateSpecimen: (
    id: string,
    u: { pages: SpecimenPage[] }
  ) => void;
}) {
  const [localPadding, setLocalPadding] = useState({
    left: String(padding.left),
    top: String(padding.top),
    right: String(padding.right),
    bottom: String(padding.bottom),
  });

  const handleApplyPadding = useCallback(() => {
    const parsed = {
      left: Math.max(0, Number(localPadding.left) || 0),
      top: Math.max(0, Number(localPadding.top) || 0),
      right: Math.max(0, Number(localPadding.right) || 0),
      bottom: Math.max(0, Number(localPadding.bottom) || 0),
    };
    const cells = [
      ...(effectivePages.find((p) => p.id === pageId)
        ?.cells ?? []),
    ];
    while (cells.length <= cellIndex) {
      cells.push({ ...DEFAULT_SPECIMEN_PAGE_CELL });
    }
    cells[cellIndex] = {
      ...cells[cellIndex],
      padding: parsed,
    };
    const updatedPages = effectivePages.map((p) =>
      p.id === pageId ? { ...p, cells } : p
    );
    updateSpecimen(specimenId, { pages: updatedPages });
    setLocalPadding({
      left: String(parsed.left),
      top: String(parsed.top),
      right: String(parsed.right),
      bottom: String(parsed.bottom),
    });
  }, [
    effectivePages,
    pageId,
    cellIndex,
    specimenId,
    updateSpecimen,
    localPadding,
  ]);

  const hasUnsavedPadding = useMemo(() => {
    const parsed = {
      left: Math.max(0, Number(localPadding.left) || 0),
      top: Math.max(0, Number(localPadding.top) || 0),
      right: Math.max(0, Number(localPadding.right) || 0),
      bottom: Math.max(0, Number(localPadding.bottom) || 0),
    };
    return (
      parsed.left !== padding.left ||
      parsed.top !== padding.top ||
      parsed.right !== padding.right ||
      parsed.bottom !== padding.bottom
    );
  }, [
    localPadding.left,
    localPadding.top,
    localPadding.right,
    localPadding.bottom,
    padding.left,
    padding.top,
    padding.right,
    padding.bottom,
  ]);

  return (
    <ParameterBlock title="Padding">
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <label
            htmlFor={`pad-left-${pageId}-${cellIndex}`}
            className="flex items-center gap-2 font-whisper text-neutral-600 text-sm"
          >
            <RiLayoutLeft2Line className="h-4 w-4 shrink-0" />
            <PaddingInput
              id={`pad-left-${pageId}-${cellIndex}`}
              value={localPadding.left}
              onChange={(v) =>
                setLocalPadding((prev) => ({
                  ...prev,
                  left: v,
                }))
              }
            />
          </label>
          <label
            htmlFor={`pad-top-${pageId}-${cellIndex}`}
            className="flex items-center gap-2 font-whisper text-neutral-600 text-sm"
          >
            <RiLayoutTop2Line className="h-4 w-4 shrink-0" />
            <PaddingInput
              id={`pad-top-${pageId}-${cellIndex}`}
              value={localPadding.top}
              onChange={(v) =>
                setLocalPadding((prev) => ({
                  ...prev,
                  top: v,
                }))
              }
            />
          </label>
          <label
            htmlFor={`pad-right-${pageId}-${cellIndex}`}
            className="flex items-center gap-2 font-whisper text-neutral-600 text-sm"
          >
            <RiLayoutRight2Line className="h-4 w-4 shrink-0" />
            <PaddingInput
              id={`pad-right-${pageId}-${cellIndex}`}
              value={localPadding.right}
              onChange={(v) =>
                setLocalPadding((prev) => ({
                  ...prev,
                  right: v,
                }))
              }
            />
          </label>
          <label
            htmlFor={`pad-bottom-${pageId}-${cellIndex}`}
            className="flex items-center gap-2 font-whisper text-neutral-600 text-sm"
          >
            <RiLayoutBottom2Line className="h-4 w-4 shrink-0" />
            <PaddingInput
              id={`pad-bottom-${pageId}-${cellIndex}`}
              value={localPadding.bottom}
              onChange={(v) =>
                setLocalPadding((prev) => ({
                  ...prev,
                  bottom: v,
                }))
              }
            />
          </label>
        </div>
        <AnimatePresence initial={false}>
          {hasUnsavedPadding && (
            <motion.button
              type="button"
              onClick={handleApplyPadding}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              className="w-full rounded-lg border border-neutral-300 py-2 font-whisper text-neutral-600 text-sm transition-colors hover:border-black hover:bg-neutral-50"
            >
              Apply
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </ParameterBlock>
  );
}

function PaddingInput({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      id={id}
      type="number"
      min={0}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-w-0 flex-1 rounded border border-neutral-300 px-2 py-1.5 font-whisper text-sm outline-none focus:border-black"
    />
  );
}

function parseFontSizePx(
  value: string | null | undefined
): number {
  if (!value) return 24;
  const match = value.match(/^(\d+(?:\.\d+)?)px$/);
  return match ? Number(match[1]) : 24;
}

export default function CellSettingPanel({
  specimenId,
  studioId,
  pageId,
  cellIndex,
  typefaceSlug,
}: CellSettingPanelProps) {
  const { studio, updateSpecimen } = useStudio();
  const {
    setSelectedCell,
    activeEditor,
    selectionAttributes,
    storedSelectionRange,
    setStoredSelectionRange,
    saveActiveCellContent,
  } = useSpecimenPage();
  const hasSelection = !!selectionAttributes;

  const handlePanelMouseDown = useCallback(() => {
    const editor = activeEditor as {
      state: {
        selection: {
          from: number;
          to: number;
          empty: boolean;
        };
      };
    } | null;
    if (!editor) return;
    const sel = editor.state.selection;
    if (!sel.empty) {
      setStoredSelectionRange({
        from: sel.from,
        to: sel.to,
      });
    }
  }, [activeEditor, setStoredSelectionRange]);

  const typefaceFonts = useMemo(() => {
    const tf = studio?.typefaces?.find(
      (t) => t.slug === typefaceSlug
    );
    return (tf?.fonts ?? []).filter((f) => f.file);
  }, [studio?.typefaces, typefaceSlug]);

  const cell = useMemo(() => {
    const specimen = studio?.specimens?.find(
      (s) => s.id === specimenId
    );
    const page = specimen?.pages?.find(
      (p) => p.id === pageId
    );
    const cells = page?.cells ?? [];
    return (
      cells[cellIndex] ?? { ...DEFAULT_SPECIMEN_PAGE_CELL }
    );
  }, [studio?.specimens, specimenId, pageId, cellIndex]);

  const effectivePages = useMemo(() => {
    const specimen = studio?.specimens?.find(
      (s) => s.id === specimenId
    );
    const p = specimen?.pages ?? [];
    return p.length > 0 ? p : [];
  }, [studio?.specimens, specimenId]);

  const padding = getCellPadding(cell);
  const background = getCellBackground(cell);

  const handleBackgroundChange = useCallback(
    (bg: SpecimenPageCellBackground) => {
      const cells = [
        ...(effectivePages.find((p) => p.id === pageId)
          ?.cells ?? []),
      ];
      while (cells.length <= cellIndex) {
        cells.push({ ...DEFAULT_SPECIMEN_PAGE_CELL });
      }
      cells[cellIndex] = {
        ...cells[cellIndex],
        background: bg,
      };
      const updatedPages = effectivePages.map((p) =>
        p.id === pageId ? { ...p, cells } : p
      );
      updateSpecimen(specimenId, { pages: updatedPages });
    },
    [
      effectivePages,
      pageId,
      cellIndex,
      specimenId,
      updateSpecimen,
    ]
  );

  const handleTextColorChange = useCallback(
    (color: string) => {
      const editor = activeEditor as {
        chain: () => {
          focus: () => {
            setTextSelection: (r: {
              from: number;
              to: number;
            }) => { run: () => boolean };
            setColor: (v: string) => { run: () => boolean };
          };
        };
      } | null;
      if (hasSelection && editor) {
        editor.chain().focus().setColor(color).run();
        saveActiveCellContent?.();
        return;
      }
      if (storedSelectionRange && editor) {
        editor
          .chain()
          .focus()
          .setTextSelection(storedSelectionRange)
          .run();
        editor.chain().focus().setColor(color).run();
        setStoredSelectionRange(null);
        saveActiveCellContent?.();
        return;
      }
      const cells = [
        ...(effectivePages.find((p) => p.id === pageId)
          ?.cells ?? []),
      ];
      while (cells.length <= cellIndex) {
        cells.push({ ...DEFAULT_SPECIMEN_PAGE_CELL });
      }
      cells[cellIndex] = {
        ...cells[cellIndex],
        textColor: color,
      };
      const updatedPages = effectivePages.map((p) =>
        p.id === pageId ? { ...p, cells } : p
      );
      updateSpecimen(specimenId, { pages: updatedPages });
    },
    [
      activeEditor,
      hasSelection,
      storedSelectionRange,
      setStoredSelectionRange,
      saveActiveCellContent,
      effectivePages,
      pageId,
      cellIndex,
      specimenId,
      updateSpecimen,
    ]
  );

  const handleFontIdChange = useCallback(
    (fontId: string) => {
      const fontFamily = typefaceFonts.find(
        (f) => f.id === fontId
      )
        ? `specimen-font-${fontId}`
        : "";
      const editor = activeEditor as {
        chain: () => {
          focus: () => {
            setTextSelection: (r: {
              from: number;
              to: number;
            }) => { run: () => boolean };
            setFontFamily: (v: string) => {
              run: () => boolean;
            };
          };
        };
      } | null;
      if (hasSelection && editor && fontFamily) {
        editor
          .chain()
          .focus()
          .setFontFamily(fontFamily)
          .run();
        saveActiveCellContent?.();
        return;
      }
      if (storedSelectionRange && editor && fontFamily) {
        editor
          .chain()
          .focus()
          .setTextSelection(storedSelectionRange)
          .run();
        editor
          .chain()
          .focus()
          .setFontFamily(fontFamily)
          .run();
        setStoredSelectionRange(null);
        saveActiveCellContent?.();
        return;
      }
      const cells = [
        ...(effectivePages.find((p) => p.id === pageId)
          ?.cells ?? []),
      ];
      while (cells.length <= cellIndex) {
        cells.push({ ...DEFAULT_SPECIMEN_PAGE_CELL });
      }
      cells[cellIndex] = { ...cells[cellIndex], fontId };
      const updatedPages = effectivePages.map((p) =>
        p.id === pageId ? { ...p, cells } : p
      );
      updateSpecimen(specimenId, { pages: updatedPages });
    },
    [
      activeEditor,
      hasSelection,
      storedSelectionRange,
      setStoredSelectionRange,
      saveActiveCellContent,
      typefaceFonts,
      effectivePages,
      pageId,
      cellIndex,
      specimenId,
      updateSpecimen,
    ]
  );

  const handleFontSizeChange = useCallback(
    (fontSize: number) => {
      const editor = activeEditor as {
        chain: () => {
          focus: () => {
            setTextSelection: (r: {
              from: number;
              to: number;
            }) => { run: () => boolean };
            setFontSize: (v: string) => {
              run: () => boolean;
            };
          };
        };
      } | null;
      if (hasSelection && editor) {
        editor
          .chain()
          .focus()
          .setFontSize(`${fontSize}px`)
          .run();
        saveActiveCellContent?.();
        return;
      }
      if (storedSelectionRange && editor) {
        editor
          .chain()
          .focus()
          .setTextSelection(storedSelectionRange)
          .run();
        editor
          .chain()
          .focus()
          .setFontSize(`${fontSize}px`)
          .run();
        setStoredSelectionRange(null);
        saveActiveCellContent?.();
        return;
      }
      const cells = [
        ...(effectivePages.find((p) => p.id === pageId)
          ?.cells ?? []),
      ];
      while (cells.length <= cellIndex) {
        cells.push({ ...DEFAULT_SPECIMEN_PAGE_CELL });
      }
      cells[cellIndex] = { ...cells[cellIndex], fontSize };
      const updatedPages = effectivePages.map((p) =>
        p.id === pageId ? { ...p, cells } : p
      );
      updateSpecimen(specimenId, { pages: updatedPages });
    },
    [
      activeEditor,
      hasSelection,
      storedSelectionRange,
      setStoredSelectionRange,
      saveActiveCellContent,
      effectivePages,
      pageId,
      cellIndex,
      specimenId,
      updateSpecimen,
    ]
  );

  const handleLineHeightChange = useCallback(
    (lineHeight: number) => {
      const editor = activeEditor as {
        chain: () => {
          focus: () => {
            setTextSelection: (r: {
              from: number;
              to: number;
            }) => { run: () => boolean };
            setLineHeight: (v: string) => {
              run: () => boolean;
            };
          };
        };
      } | null;
      if (hasSelection && editor) {
        editor
          .chain()
          .focus()
          .setLineHeight(String(lineHeight))
          .run();
        saveActiveCellContent?.();
        return;
      }
      if (storedSelectionRange && editor) {
        editor
          .chain()
          .focus()
          .setTextSelection(storedSelectionRange)
          .run();
        editor
          .chain()
          .focus()
          .setLineHeight(String(lineHeight))
          .run();
        setStoredSelectionRange(null);
        saveActiveCellContent?.();
        return;
      }
      const cells = [
        ...(effectivePages.find((p) => p.id === pageId)
          ?.cells ?? []),
      ];
      while (cells.length <= cellIndex) {
        cells.push({ ...DEFAULT_SPECIMEN_PAGE_CELL });
      }
      cells[cellIndex] = {
        ...cells[cellIndex],
        lineHeight,
      };
      const updatedPages = effectivePages.map((p) =>
        p.id === pageId ? { ...p, cells } : p
      );
      updateSpecimen(specimenId, { pages: updatedPages });
    },
    [
      activeEditor,
      hasSelection,
      storedSelectionRange,
      setStoredSelectionRange,
      saveActiveCellContent,
      effectivePages,
      pageId,
      cellIndex,
      specimenId,
      updateSpecimen,
    ]
  );

  const handleSelectionBackgroundColorChange = useCallback(
    (color: string) => {
      const editor = activeEditor as {
        chain: () => {
          focus: () => {
            setTextSelection: (r: {
              from: number;
              to: number;
            }) => { run: () => boolean };
            setBackgroundColor: (v: string) => {
              run: () => boolean;
            };
          };
        };
      } | null;
      if (hasSelection && editor) {
        editor
          .chain()
          .focus()
          .setBackgroundColor(color)
          .run();
        saveActiveCellContent?.();
        return;
      }
      if (storedSelectionRange && editor) {
        editor
          .chain()
          .focus()
          .setTextSelection(storedSelectionRange)
          .run();
        editor
          .chain()
          .focus()
          .setBackgroundColor(color)
          .run();
        setStoredSelectionRange(null);
        saveActiveCellContent?.();
        return;
      }
      const cells = [
        ...(effectivePages.find((p) => p.id === pageId)
          ?.cells ?? []),
      ];
      while (cells.length <= cellIndex) {
        cells.push({ ...DEFAULT_SPECIMEN_PAGE_CELL });
      }
      cells[cellIndex] = {
        ...cells[cellIndex],
        selectionBackgroundColor: color,
      };
      const updatedPages = effectivePages.map((p) =>
        p.id === pageId ? { ...p, cells } : p
      );
      updateSpecimen(specimenId, { pages: updatedPages });
    },
    [
      activeEditor,
      hasSelection,
      storedSelectionRange,
      setStoredSelectionRange,
      saveActiveCellContent,
      effectivePages,
      pageId,
      cellIndex,
      specimenId,
      updateSpecimen,
    ]
  );

  const handleTextAlignChange = useCallback(
    (
      textAlign: "left" | "center" | "right" | "justify"
    ) => {
      const cells = [
        ...(effectivePages.find((p) => p.id === pageId)
          ?.cells ?? []),
      ];
      while (cells.length <= cellIndex) {
        cells.push({ ...DEFAULT_SPECIMEN_PAGE_CELL });
      }
      cells[cellIndex] = { ...cells[cellIndex], textAlign };
      const updatedPages = effectivePages.map((p) =>
        p.id === pageId ? { ...p, cells } : p
      );
      updateSpecimen(specimenId, { pages: updatedPages });
    },
    [
      effectivePages,
      pageId,
      cellIndex,
      specimenId,
      updateSpecimen,
    ]
  );

  const handleVerticalAlignChange = useCallback(
    (verticalAlign: "top" | "center" | "bottom") => {
      const cells = [
        ...(effectivePages.find((p) => p.id === pageId)
          ?.cells ?? []),
      ];
      while (cells.length <= cellIndex) {
        cells.push({ ...DEFAULT_SPECIMEN_PAGE_CELL });
      }
      cells[cellIndex] = {
        ...cells[cellIndex],
        verticalAlign,
      };
      const updatedPages = effectivePages.map((p) =>
        p.id === pageId ? { ...p, cells } : p
      );
      updateSpecimen(specimenId, { pages: updatedPages });
    },
    [
      effectivePages,
      pageId,
      cellIndex,
      specimenId,
      updateSpecimen,
    ]
  );

  const handleBack = useCallback(() => {
    setSelectedCell(null);
  }, [setSelectedCell]);

  return (
    <>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: mousedown captures selection before blur when clicking panel controls */}
      <div
        className="flex h-full min-h-0 w-[300px] shrink-0 flex-col overflow-y-auto rounded-lg border border-neutral-300 bg-white p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onMouseDown={handlePanelMouseDown}
      >
        <div className="mb-4 flex w-full flex-row items-center justify-between border-neutral-200 border-b pb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBack}
              className="rounded p-1 transition-colors hover:bg-neutral-100"
              aria-label="Back to page settings"
            >
              <RiArrowLeftLine className="h-5 w-5" />
            </button>
            <div className="font-bold font-whisper text-neutral-800 text-sm">
              Cell settings
            </div>
          </div>
          <div className="font-whisper text-neutral-600 text-sm">
            {cellIndex + 1}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {typefaceFonts.length > 0 && (
            <ParameterBlock title="Font">
              <div className="rounded border border-neutral-300">
                <FontDropdown
                  fonts={typefaceFonts}
                  selectedId={
                    hasSelection &&
                    selectionAttributes?.fontFamily
                      ? (typefaceFonts.find((f) =>
                          selectionAttributes.fontFamily?.includes(
                            f.id
                          )
                        )?.id ??
                        cell.fontId ??
                        typefaceFonts[0]?.id ??
                        "")
                      : (cell.fontId ??
                        typefaceFonts[0]?.id ??
                        "")
                  }
                  onChange={handleFontIdChange}
                />
              </div>
            </ParameterBlock>
          )}

          <div className="grid grid-cols-2 gap-4">
            <ParameterBlock title="Font size">
              <input
                type="number"
                min={1}
                value={
                  hasSelection
                    ? parseFontSizePx(
                        selectionAttributes?.fontSize
                      )
                    : (cell.fontSize ?? 24)
                }
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (!Number.isNaN(v) && v >= 1)
                    handleFontSizeChange(v);
                }}
                className="w-full min-w-0 rounded border border-neutral-300 px-2 py-1.5 font-whisper text-sm outline-none focus:border-black"
              />
            </ParameterBlock>

            <ParameterBlock title="Line height">
              <input
                type="number"
                min={0.5}
                step={0.1}
                value={
                  hasSelection &&
                  selectionAttributes?.lineHeight
                    ? Number(
                        selectionAttributes.lineHeight
                      ) || 1.2
                    : (cell.lineHeight ?? 1.2)
                }
                onChange={(e) => {
                  const v = Number(e.target.value);
                  if (!Number.isNaN(v) && v >= 0.5)
                    handleLineHeightChange(v);
                }}
                className="w-full min-w-0 rounded border border-neutral-300 px-2 py-1.5 font-whisper text-sm outline-none focus:border-black"
              />
            </ParameterBlock>
          </div>

          <ParameterBlock title="Selection background">
            <div className="flex items-center gap-2">
              <ColorPicker
                id={`cell-sel-bg-${pageId}-${cellIndex}`}
                value={
                  hasSelection &&
                  selectionAttributes?.backgroundColor
                    ? selectionAttributes.backgroundColor
                    : (cell.selectionBackgroundColor ??
                      "#b4d5fe")
                }
                onChange={
                  handleSelectionBackgroundColorChange
                }
              />
              <input
                type="text"
                value={
                  hasSelection &&
                  selectionAttributes?.backgroundColor
                    ? selectionAttributes.backgroundColor
                    : (cell.selectionBackgroundColor ??
                      "#b4d5fe")
                }
                onChange={(e) =>
                  handleHexChange(
                    e.target.value,
                    handleSelectionBackgroundColorChange
                  )
                }
                maxLength={7}
                className="min-w-0 flex-1 rounded border border-neutral-300 px-2 py-1.5 font-whisper text-sm uppercase outline-none focus:border-black"
                placeholder="#b4d5fe"
              />
            </div>
          </ParameterBlock>

          <ParameterBlock title="Text color">
            <div className="flex items-center gap-2">
              <ColorPicker
                id={`cell-text-${pageId}-${cellIndex}`}
                value={
                  hasSelection && selectionAttributes?.color
                    ? selectionAttributes.color
                    : (cell.textColor ?? "#000000")
                }
                onChange={handleTextColorChange}
              />
              <input
                type="text"
                value={
                  hasSelection && selectionAttributes?.color
                    ? selectionAttributes.color
                    : (cell.textColor ?? "#000000")
                }
                onChange={(e) =>
                  handleHexChange(
                    e.target.value,
                    handleTextColorChange
                  )
                }
                maxLength={7}
                className="min-w-0 flex-1 rounded border border-neutral-300 px-2 py-1.5 font-whisper text-sm uppercase outline-none focus:border-black"
                placeholder="#000000"
              />
            </div>
          </ParameterBlock>

          <ParameterBlock title="Cell background">
            <div className="flex flex-col gap-3">
              <CustomSelect
                value={background.type}
                options={BACKGROUND_TYPE_OPTIONS}
                onChange={(v) =>
                  handleBackgroundChange({
                    ...background,
                    type: v as
                      | "color"
                      | "gradient"
                      | "image",
                  })
                }
              />

              {background.type === "color" && (
                <div className="flex items-center gap-2">
                  <ColorPicker
                    id={`cell-bg-color-${pageId}-${cellIndex}`}
                    value={
                      background.color ?? "transparent"
                    }
                    onChange={(v) =>
                      handleBackgroundChange({
                        ...background,
                        color: v,
                      })
                    }
                  />
                  <input
                    type="text"
                    value={
                      background.color ?? "transparent"
                    }
                    onChange={(e) =>
                      handleHexChange(e.target.value, (v) =>
                        handleBackgroundChange({
                          ...background,
                          color: v,
                        })
                      )
                    }
                    maxLength={9}
                    className="min-w-0 flex-1 rounded border border-neutral-300 px-2 py-1.5 font-whisper text-sm uppercase outline-none focus:border-black"
                    placeholder="transparent"
                  />
                </div>
              )}

              {background.type === "gradient" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-whisper text-neutral-600 text-sm">
                      From
                    </span>
                    <div className="flex items-center gap-2">
                      <ColorPicker
                        id={`cell-bg-from-${pageId}-${cellIndex}`}
                        value={
                          background.gradient?.from ??
                          "#FFF8E8"
                        }
                        onChange={(v) =>
                          handleBackgroundChange({
                            ...background,
                            gradient: {
                              from: v,
                              to:
                                background.gradient?.to ??
                                "#F2F2F2",
                            },
                          })
                        }
                      />
                      <input
                        type="text"
                        value={
                          background.gradient?.from ??
                          "#FFF8E8"
                        }
                        onChange={(e) =>
                          handleHexChange(
                            e.target.value,
                            (v) =>
                              handleBackgroundChange({
                                ...background,
                                gradient: {
                                  from: v,
                                  to:
                                    background.gradient
                                      ?.to ?? "#F2F2F2",
                                },
                              })
                          )
                        }
                        maxLength={7}
                        className="min-w-0 flex-1 rounded border border-neutral-300 px-2 py-1.5 font-whisper text-sm uppercase outline-none focus:border-black"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-whisper text-neutral-600 text-sm">
                      To
                    </span>
                    <div className="flex items-center gap-2">
                      <ColorPicker
                        id={`cell-bg-to-${pageId}-${cellIndex}`}
                        value={
                          background.gradient?.to ??
                          "#F2F2F2"
                        }
                        onChange={(v) =>
                          handleBackgroundChange({
                            ...background,
                            gradient: {
                              from:
                                background.gradient?.from ??
                                "#FFF8E8",
                              to: v,
                            },
                          })
                        }
                      />
                      <input
                        type="text"
                        value={
                          background.gradient?.to ??
                          "#F2F2F2"
                        }
                        onChange={(e) =>
                          handleHexChange(
                            e.target.value,
                            (v) =>
                              handleBackgroundChange({
                                ...background,
                                gradient: {
                                  from:
                                    background.gradient
                                      ?.from ?? "#FFF8E8",
                                  to: v,
                                },
                              })
                          )
                        }
                        maxLength={7}
                        className="min-w-0 flex-1 rounded border border-neutral-300 px-2 py-1.5 font-whisper text-sm uppercase outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>
              )}

              {background.type === "image" && studioId && (
                <FileDropZone
                  label=""
                  accept="image/*"
                  value={background.image ?? ""}
                  onChange={(v) =>
                    handleBackgroundChange({
                      ...background,
                      image: v,
                    })
                  }
                  description=".jpg, .png, .webp"
                  studioId={studioId}
                  folder="images"
                  icon="image"
                />
              )}
            </div>
          </ParameterBlock>

          <CellPaddingBlock
            key={`${pageId}-${cellIndex}`}
            padding={padding}
            pageId={pageId}
            cellIndex={cellIndex}
            effectivePages={effectivePages}
            specimenId={specimenId}
            updateSpecimen={updateSpecimen}
          />

          <div className="grid grid-cols-2 gap-4">
            <ParameterBlock title="Text align">
              <div className="flex gap-1">
                {(
                  [
                    {
                      value: "left" as const,
                      Icon: RiAlignLeft,
                    },
                    {
                      value: "justify" as const,
                      Icon: RiAlignJustify,
                    },
                    {
                      value: "right" as const,
                      Icon: RiAlignRight,
                    },
                  ] as const
                ).map(({ value, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      handleTextAlignChange(value)
                    }
                    className={cn(
                      "rounded border p-1 transition-colors",
                      cell.textAlign === value
                        ? "border-black bg-neutral-100"
                        : "border-neutral-300 hover:border-neutral-400"
                    )}
                    aria-label={`Align ${value}`}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </ParameterBlock>

            <ParameterBlock title="Vertical">
              <div className="flex gap-1">
                {(
                  [
                    {
                      value: "top" as const,
                      Icon: RiAlignItemTopLine,
                    },
                    {
                      value: "center" as const,
                      Icon: RiAlignItemVerticalCenterLine,
                    },
                    {
                      value: "bottom" as const,
                      Icon: RiAlignItemBottomLine,
                    },
                  ] as const
                ).map(({ value, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      handleVerticalAlignChange(value)
                    }
                    className={cn(
                      "rounded border p-1 transition-colors",
                      cell.verticalAlign === value
                        ? "border-black bg-neutral-100"
                        : "border-neutral-300 hover:border-neutral-400"
                    )}
                    aria-label={`Align ${value}`}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </ParameterBlock>
          </div>
        </div>
      </div>
    </>
  );
}

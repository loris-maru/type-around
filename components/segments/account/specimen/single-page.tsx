"use client";

import { useCallback, useEffect, useMemo } from "react";
import {
  SPECIMEN_FONT_PREFIX,
  SPECIMEN_TEXT_ALIGN_MAP,
  SPECIMEN_VERTICAL_ALIGN_MAP,
} from "@/constant/SPECIMEN_OPTIONS";
import { getPageDimensions } from "@/constant/SPECIMEN_PAGE_DIMENSIONS";
import { useSpecimenPage } from "@/contexts/specimen-page-context";
import { useStudio } from "@/hooks/use-studio";
import type { SinglePageProps } from "@/types/specimen";
import {
  DEFAULT_SPECIMEN_PAGE_CELL,
  type Font,
  type SpecimenPageCell,
} from "@/types/studio";
import { cn } from "@/utils/class-names";
import {
  getCell,
  getCellBackgroundStyle,
  getCellFontFamily,
  getPageBackgroundStyle,
  getPageGrid,
  getPageMargins,
} from "@/utils/specimen-utils";

function useSpecimenFont(font: Font | undefined) {
  useEffect(() => {
    if (!font?.file) return;
    const familyName = `${SPECIMEN_FONT_PREFIX}-${font.id}`;
    const existing = Array.from(document.fonts).find(
      (f) => f.family === familyName
    );
    if (existing) return;
    let cancelled = false;
    const face = new FontFace(
      familyName,
      `url(${font.file})`,
      {
        weight: String(font.weight),
        style: font.isItalic ? "italic" : "normal",
      }
    );
    face
      .load()
      .then((loaded) => {
        if (!cancelled) document.fonts.add(loaded);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [font?.id, font?.file, font?.weight, font?.isItalic]);
}

import TiptapCellEditor from "./tiptap-cell-editor";

export default function SinglePage({
  page,
  format,
  orientation,
  className,
  specimenId,
  typefaceSlug,
  workspaceScale = 1,
}: SinglePageProps) {
  const { setSelectedCell, selectedCell } =
    useSpecimenPage();
  const { studio, updateSpecimen } = useStudio();

  const typefaceFonts = useMemo(() => {
    const tf = studio?.typefaces?.find(
      (t) => t.slug === typefaceSlug
    );
    return (tf?.fonts ?? []).filter((f) => f.file);
  }, [studio?.typefaces, typefaceSlug]);

  const effectivePages = useMemo(() => {
    const specimen = studio?.specimens?.find(
      (s) => s.id === specimenId
    );
    const p = specimen?.pages ?? [];
    return p.length > 0
      ? p
      : [{ id: "placeholder", name: "Page 1" }];
  }, [studio?.specimens, specimenId]);

  const handleCellClick = useCallback(
    (pageId: string, cellIndex: number) => {
      setSelectedCell({ pageId, cellIndex });
    },
    [setSelectedCell]
  );

  const handleCellContentBlur = useCallback(
    (
      pageId: string,
      cellIndex: number,
      newContent: string
    ) => {
      if (pageId === "placeholder") return;
      const pageData = effectivePages.find(
        (p) => p.id === pageId
      );
      if (!pageData) return;
      const cells = pageData.cells ?? [];
      const current = cells[cellIndex];
      const updated = [...cells];
      while (updated.length <= cellIndex) {
        updated.push({ ...DEFAULT_SPECIMEN_PAGE_CELL });
      }
      updated[cellIndex] = {
        ...(current ?? { ...DEFAULT_SPECIMEN_PAGE_CELL }),
        content: newContent,
      };
      const updatedPages = effectivePages.map((p) =>
        p.id === pageId ? { ...p, cells: updated } : p
      );
      updateSpecimen(specimenId, { pages: updatedPages });
    },
    [effectivePages, specimenId, updateSpecimen]
  );

  const { width, height } = getPageDimensions(
    format,
    orientation
  );
  const style: React.CSSProperties = {
    width,
    height,
    ...getPageBackgroundStyle(page),
  };
  const grid = getPageGrid(page);
  const margins = getPageMargins(page);
  const scaleInverse =
    workspaceScale > 0 ? 1 / workspaceScale : 1;

  return (
    <div
      className={cn(
        "relative shrink-0 rounded-sm border border-neutral-300 shadow-md",
        className
      )}
      style={style}
      data-page-id={page.id}
    >
      <div
        className="absolute grid p-0"
        style={{
          top: margins.top,
          left: margins.left,
          right: margins.right,
          bottom: margins.bottom,
          gridTemplateColumns: `repeat(${grid.columns}, 1fr)`,
          gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
          gap: `${grid.gap}px`,
        }}
        aria-hidden
      >
        {Array.from(
          { length: grid.columns * grid.rows },
          (_, i) => {
            const cell = getCell(page, i);
            const effectiveFontId =
              cell.fontId ?? typefaceFonts[0]?.id ?? "";
            const effectiveFont =
              typefaceFonts.find(
                (f) => f.id === effectiveFontId
              ) ?? typefaceFonts[0];
            const isSelected =
              selectedCell?.pageId === page.id &&
              selectedCell?.cellIndex === i;
            const justifyContent =
              SPECIMEN_TEXT_ALIGN_MAP[
                cell.textAlign ?? "left"
              ];
            const alignItems =
              SPECIMEN_VERTICAL_ALIGN_MAP[
                cell.verticalAlign ?? "top"
              ];
            const padding = cell.padding ?? {
              left: 0,
              top: 0,
              right: 0,
              bottom: 0,
            };
            const cellStyle = {
              fontFamily: getCellFontFamily(effectiveFont),
              fontSize: cell.fontSize ?? 24,
              lineHeight: cell.lineHeight ?? 1.2,
              color: cell.textColor ?? "#000000",
              selectionBackgroundColor:
                cell.selectionBackgroundColor ?? "#b4d5fe",
            };

            return (
              <CellWithFont
                key={`grid-cell-${grid.columns}-${grid.rows}-${i}`}
                font={effectiveFont}
                cell={cell}
                pageId={page.id}
                cellIndex={i}
                isSelected={isSelected}
                justifyContent={justifyContent}
                alignItems={alignItems}
                padding={padding}
                gridShowGrid={!!grid.showGrid}
                cellStyle={cellStyle}
                scaleInverse={scaleInverse}
                handleCellClick={handleCellClick}
                handleCellContentBlur={
                  handleCellContentBlur
                }
                getCellBackgroundStyle={
                  getCellBackgroundStyle
                }
              />
            );
          }
        )}
      </div>
    </div>
  );
}

function CellWithFont({
  font,
  cell,
  pageId,
  cellIndex,
  isSelected,
  justifyContent,
  alignItems,
  padding,
  gridShowGrid,
  cellStyle,
  scaleInverse,
  handleCellClick,
  handleCellContentBlur,
  getCellBackgroundStyle,
}: {
  font: Font | undefined;
  cell: SpecimenPageCell;
  pageId: string;
  cellIndex: number;
  isSelected: boolean;
  justifyContent: string;
  alignItems: string;
  padding: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  gridShowGrid: boolean;
  cellStyle: {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
    color: string;
    selectionBackgroundColor: string;
  };
  scaleInverse: number;
  handleCellClick: (
    pageId: string,
    cellIndex: number
  ) => void;
  handleCellContentBlur: (
    pageId: string,
    cellIndex: number,
    content: string
  ) => void;
  getCellBackgroundStyle: (
    cell: SpecimenPageCell | undefined
  ) => React.CSSProperties;
}) {
  useSpecimenFont(font);

  return (
    <button
      type="button"
      onClick={() => handleCellClick(pageId, cellIndex)}
      className={cn(
        "group relative flex min-h-0 min-w-0 cursor-pointer overflow-hidden border-0 p-0 text-left transition-colors duration-150",
        isSelected && "ring-2 ring-red-500 ring-inset"
      )}
      style={{
        ...(gridShowGrid
          ? { backgroundColor: "rgba(0, 72, 255, 0.2)" }
          : getCellBackgroundStyle(cell)),
        justifyContent,
        alignItems,
        paddingLeft: padding.left,
        paddingRight: padding.right,
        paddingTop: padding.top,
        paddingBottom: padding.bottom,
      }}
    >
      {isSelected ? (
        <TiptapCellEditor
          cell={cell}
          pageId={pageId}
          cellIndex={cellIndex}
          onBlur={handleCellContentBlur}
          cellStyle={cellStyle}
        />
      ) : cell.content ? (
        <span
          className="specimen-cell-content w-full overflow-hidden text-ellipsis"
          style={
            {
              fontFamily: cellStyle.fontFamily || undefined,
              fontSize: cellStyle.fontSize,
              lineHeight: cellStyle.lineHeight,
              color: cellStyle.color,
              textAlign: cell.textAlign ?? "left",
              "--selection-bg":
                cellStyle.selectionBackgroundColor,
            } as React.CSSProperties
          }
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Cell content is HTML from our TipTap editor, stored in our data
          dangerouslySetInnerHTML={{
            __html: cell.content,
          }}
        />
      ) : (
        <span
          className="pointer-events-none absolute inset-0 flex items-center justify-center font-whisper text-neutral-600 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          style={{
            fontSize: "2.25rem",
            transform: `scale(${scaleInverse})`,
            transformOrigin: "center center",
          }}
        >
          Click to edit
        </span>
      )}
      {!isSelected && (
        <span
          className="pointer-events-none absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          aria-hidden
        />
      )}
    </button>
  );
}

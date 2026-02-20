import { SPECIMEN_FONT_PREFIX } from "@/constant/SPECIMEN_OPTIONS";
import type { SpecimenTemplate } from "@/constant/specimen-templates/schema";
import {
  DEFAULT_SPECIMEN_PAGE_CELL,
  type Font,
  type SpecimenPage,
  type SpecimenPageBackground,
  type SpecimenPageCell,
  type SpecimenPageCellBackground,
  type SpecimenPageCellPadding,
  type SpecimenPageGrid,
  type SpecimenPageMargins,
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

const DEFAULT_BACKGROUND: SpecimenPageBackground = {
  type: "color",
  color: "#ffffff",
  gradient: { from: "#FFF8E8", to: "#F2F2F2" },
  image: "",
};

const DEFAULT_CELL_BG: SpecimenPageCellBackground = {
  type: "color",
  color: "#ffffff",
  gradient: { from: "#FFF8E8", to: "#F2F2F2" },
  image: "",
};

export function getPageGrid(
  page: SpecimenPage
): SpecimenPageGrid {
  return page.grid ?? DEFAULT_GRID;
}

export function getPageMargins(
  page: SpecimenPage
): SpecimenPageMargins {
  return page.margins ?? DEFAULT_MARGINS;
}

export function getPageBackground(
  page: SpecimenPage
): SpecimenPageBackground {
  return page.background ?? DEFAULT_BACKGROUND;
}

export function getPageBackgroundStyle(
  page: SpecimenPage
): React.CSSProperties {
  const bg = page.background ?? DEFAULT_BACKGROUND;
  if (bg.type === "color") {
    return { backgroundColor: bg.color ?? "#ffffff" };
  }
  if (bg.type === "gradient") {
    return {
      background: `linear-gradient(180deg, ${bg.gradient?.from ?? "#FFF8E8"} 0%, ${bg.gradient?.to ?? "#F2F2F2"} 100%)`,
    };
  }
  if (bg.type === "image" && bg.image) {
    return {
      backgroundImage: `url(${bg.image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return { backgroundColor: "#ffffff" };
}

export function getCell(
  page: SpecimenPage,
  cellIndex: number
): SpecimenPageCell {
  const cells = page.cells ?? [];
  return (
    cells[cellIndex] ?? { ...DEFAULT_SPECIMEN_PAGE_CELL }
  );
}

const DEFAULT_PADDING: SpecimenPageCellPadding = {
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
};

export function getCellPadding(
  cell: SpecimenPageCell | undefined
): SpecimenPageCellPadding {
  return cell?.padding ?? DEFAULT_PADDING;
}

export function getCellBackground(
  cell: SpecimenPageCell | undefined
): SpecimenPageCellBackground {
  return cell?.background ?? DEFAULT_CELL_BG;
}

export function getCellBackgroundStyle(
  cell: SpecimenPageCell | undefined
): React.CSSProperties {
  const bg = cell?.background ?? DEFAULT_CELL_BG;
  if (bg.type === "color") {
    return { backgroundColor: bg.color ?? "#ffffff" };
  }
  if (bg.type === "gradient") {
    return {
      background: `linear-gradient(180deg, ${bg.gradient?.from ?? "#FFF8E8"} 0%, ${bg.gradient?.to ?? "#F2F2F2"} 100%)`,
    };
  }
  if (bg.type === "image" && bg.image) {
    return {
      backgroundImage: `url(${bg.image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return { backgroundColor: "#ffffff" };
}

export function getCellFontFamily(
  font: Font | undefined
): string {
  if (!font?.file) return "";
  return `${SPECIMEN_FONT_PREFIX}-${font.id}`;
}

export function getTemplatePreviewCells(
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

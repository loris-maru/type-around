import type { SpecimenTemplate } from "./schema";
import type {
  SpecimenPage,
  SpecimenPageBackground,
  SpecimenPageCell,
  SpecimenPageGrid,
  SpecimenPageMargins,
} from "@/types/studio";

/**
 * Converts a specimen template to page fields (margins, background, grid, cells).
 * Preserves page id and name.
 */
export function templateToPageFields(
  template: SpecimenTemplate,
  pageId: string,
  pageName: string
): Pick<
  SpecimenPage,
  | "id"
  | "name"
  | "margins"
  | "background"
  | "grid"
  | "cells"
  | "templateId"
> {
  const [marginLeft, marginTop, marginRight, marginBottom] =
    template.margin;

  const margins: SpecimenPageMargins = {
    left: marginLeft,
    top: marginTop,
    right: marginRight,
    bottom: marginBottom,
  };

  const backgroundType = template.backgroundType ?? "color";
  const background: SpecimenPageBackground =
    backgroundType === "gradient" && template.gradient
      ? {
          type: "gradient",
          color: "#ffffff",
          image: "",
          gradient: template.gradient,
        }
      : backgroundType === "image" && template.image
        ? {
            type: "image",
            color: "#ffffff",
            image: template.image,
          }
        : {
            type: "color",
            color: template.backgroundColor,
            image: "",
          };

  const grid: SpecimenPageGrid = {
    columns: template.grid.columns,
    rows: template.grid.rows,
    gap: template.grid.gap,
    showGrid: false,
  };

  const cells: SpecimenPageCell[] = [];
  for (const cell of template.cells) {
    const span = (cell.colSpan ?? 1) * (cell.rowSpan ?? 1);
    const specimenCell: SpecimenPageCell = {
      content: cell.content,
      textColor: cell.fontColor ?? "#000000",
      textAlign:
        (cell.textAlign as
          | "left"
          | "center"
          | "right"
          | "justify") ?? "left",
      verticalAlign:
        (cell.verticalAlign as
          | "top"
          | "center"
          | "bottom") ?? "top",
      padding: {
        left: cell.padding[0],
        top: cell.padding[1],
        right: cell.padding[2],
        bottom: cell.padding[3],
      },
      background: cell.background
        ? {
            type: "color",
            color: cell.background,
            image: "",
          }
        : undefined,
    };
    for (let i = 0; i < span; i++) {
      cells.push(specimenCell);
    }
  }

  const totalSlots =
    template.grid.columns * template.grid.rows;
  while (cells.length < totalSlots) {
    cells.push({
      content: "",
      textColor: template.fontColor,
      textAlign: "left",
      verticalAlign: "top",
      padding: { left: 16, top: 16, right: 16, bottom: 16 },
    });
  }

  return {
    id: pageId,
    name: pageName,
    margins,
    background,
    grid,
    cells,
    templateId: template.title,
  };
}

/**
 * Specimen template schema for predefined page layouts
 */

export type SpecimenTemplateMargin = [
  number,
  number,
  number,
  number,
]; // [left, top, right, bottom]

export type SpecimenTemplateGrid = {
  columns: number;
  rows: number;
  gap: number;
};

export type SpecimenTemplateCell = {
  uuid: string;
  colSpan: number;
  rowSpan: number;
  padding: [number, number, number, number]; // [left, top, right, bottom]
  background: string | null;
  fontColor: string | null;
  textAlign: string;
  verticalAlign: string;
  content: string; // markdown
};

export type SpecimenTemplate = {
  title: string;
  description: string;
  backgroundColor: string;
  fontColor: string;
  /** "color" | "gradient" | "image" - for display; color uses backgroundColor */
  backgroundType?: "color" | "gradient" | "image";
  gradient?: { from: string; to: string };
  image?: string;
  margin: SpecimenTemplateMargin;
  grid: SpecimenTemplateGrid;
  cells: SpecimenTemplateCell[];
};

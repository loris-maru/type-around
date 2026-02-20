import type { CustomSelectOption } from "@/types/components";

export const SPECIMEN_TEXT_ALIGN_MAP = {
  left: "flex-start",
  center: "center",
  right: "flex-end",
  justify: "center",
} as const;

export const SPECIMEN_VERTICAL_ALIGN_MAP = {
  top: "flex-start",
  center: "center",
  bottom: "flex-end",
} as const;

export const SPECIMEN_FONT_PREFIX = "specimen-font";

export const SPECIMEN_BACKGROUND_TYPE_OPTIONS: CustomSelectOption[] =
  [
    { value: "color", label: "Color" },
    { value: "gradient", label: "Gradient" },
    { value: "image", label: "Image" },
  ];

export const SPECIMEN_FORMAT_OPTIONS: CustomSelectOption[] =
  [
    { value: "A4", label: "A4" },
    { value: "Letter", label: "Letter" },
  ];

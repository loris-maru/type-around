import type {
  AlignmentOption,
  MarginOption,
  SizeOption,
  SpacerSizeOption,
} from "@/types/layout";

export const ALIGNMENT_OPTIONS: AlignmentOption[] = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
];

export const MARGIN_OPTIONS: MarginOption[] = [
  { value: "none", label: "None" },
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
  { value: "xl", label: "XL" },
];

export const SIZE_OPTIONS: SizeOption[] = [
  { value: "full", label: "Full" },
  { value: "20", label: "20%" },
  { value: "40", label: "40%" },
  { value: "50", label: "50%" },
  { value: "60", label: "60%" },
  { value: "80", label: "80%" },
];

export const SPACER_SIZE_OPTIONS: SpacerSizeOption[] = [
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
  { value: "xl", label: "XL" },
];

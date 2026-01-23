export type TypeStatusItem = {
  label: string;
  value: number;
  max: number;
};

export const TYPE_STATUS: TypeStatusItem[] = [
  {
    label: "Glyphs",
    value: 1240,
    max: 2800,
  },
  {
    label: "Weights",
    value: 2,
    max: 6,
  },
  {
    label: "Styles",
    value: 1,
    max: 2,
  },
];

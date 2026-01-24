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

export const TYPE_UPDATES = [
  {
    title: "Black Weight",
    image: "/mock/typefaces/update_thumbnail_img-1.webp",
    date: new Date("2024-01-01"),
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "Vertical Alignment",
    image: "/mock/typefaces/update_thumbnail_img-2.webp",
    date: new Date("2024-01-01"),
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "Hangeul punctuation",
    image: "/mock/typefaces/update_thumbnail_img-3.webp",
    date: new Date("2024-01-01"),
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "Full width numbers",
    image: "/mock/typefaces/update_thumbnail_img-4.webp",
    date: new Date("2024-01-01"),
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "Vertical alignment",
    image: "/mock/typefaces/update_thumbnail_img-5.webp",
    date: new Date("2024-01-01"),
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
  {
    title: "Weighing",
    image: "/mock/typefaces/update_thumbnail_img-6.webp",
    date: new Date("2024-01-01"),
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  },
];

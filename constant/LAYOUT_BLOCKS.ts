import type { LayoutBlock } from "@/types/layout";

export const LAYOUT_BLOCKS: LayoutBlock[] = [
  { id: "about", label: "About", unique: true },
  { id: "type-tester", label: "Type tester", unique: true },
  {
    id: "typeface-list",
    label: "Typeface list",
    unique: true,
  },
  { id: "gallery", label: "Gallery", unique: false },
  { id: "image", label: "Image", unique: false },
  { id: "video", label: "Video", unique: false },
  { id: "spacer", label: "Spacer", unique: false },
  { id: "store", label: "Store", unique: false },
  { id: "blog", label: "Blog", unique: false },
];

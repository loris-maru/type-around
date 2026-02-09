import type { LayoutItem } from "@/types/layout";

/**
 * Default page layout blocks for new studios.
 * Users can remove or reorder these in Account > Studio Page.
 */
export const DEFAULT_PAGE_LAYOUT: LayoutItem[] = [
  { blockId: "about", key: "default-about" },
  { blockId: "type-tester", key: "default-type-tester" },
  {
    blockId: "typeface-list",
    key: "default-typeface-list",
  },
  { blockId: "fonts-in-use", key: "default-fonts-in-use" },
];

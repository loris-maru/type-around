import type { TypefaceLayoutBlock } from "@/types/layout-typeface";

export const LAYOUT_BLOCKS_TYPEFACE: TypefaceLayoutBlock[] =
  [
    {
      id: "type-tester",
      label: "Type tester",
      unique: false,
    },
    { id: "shop", label: "Shop", unique: true },
    { id: "updates", label: "Updates", unique: true },
    { id: "about", label: "About", unique: true },
    { id: "download", label: "Download", unique: true },
    {
      id: "goodies-shop",
      label: "Goodies shop",
      unique: true,
    },
    { id: "image", label: "Image", unique: false },
    { id: "video", label: "Video", unique: false },
    { id: "gallery", label: "Gallery", unique: false },
    {
      id: "character-set",
      label: "Character set",
      unique: true,
    },
  ];

import type { TypefaceLayoutItem } from "./layout-typeface";
import type { Font } from "./typefaces";
import type { TypetesterFont } from "./typetester";

export type RawTypefaceForBlocks = {
  description?: string;
  specimen?: string;
  galleryImages?: string[];
  fonts: {
    id?: string;
    styleName?: string;
    weight?: number;
    isItalic?: boolean;
    file?: string;
    salesFiles?: string[];
  }[];
};

export type TypefacePageBlocksProps = {
  blocks: TypefaceLayoutItem[];
  rawTypeface: RawTypefaceForBlocks;
  typefaceName: string;
  typefaceSlug: string;
  studioId: string;
  studioSlug: string;
  typetesterFonts: TypetesterFont[];
  typefaceFonts: (Font & {
    id?: string;
    salesFiles?: string[];
  })[];
};

import type { TypefaceLayoutItem } from "./layout-typeface";
import type { Font, Studio } from "./typefaces";
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

export type MoreContentRawTypeface = {
  name: string;
  slug?: string;
  category?: string[];
  fonts: { id: string; file?: string }[];
  characters?: number;
  heroLetter?: string;
  headerImage?: string;
  icon?: string;
  published?: boolean;
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
  studio?: Studio;
  rawTypefaces?: MoreContentRawTypeface[];
  currentTypefaceSlug?: string;
  titleFontUrl?: string;
  textFontUrl?: string;
};

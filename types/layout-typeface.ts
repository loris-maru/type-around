import type {
  GalleryBlockData,
  ImageBlockData,
  VideoBlockData,
} from "./layout";

export type TypefaceLayoutBlockId =
  | "type-tester"
  | "shop"
  | "updates"
  | "about"
  | "download"
  | "goodies-shop"
  | "image"
  | "video"
  | "gallery"
  | "character-set";

export type CharacterSetBlockData = {
  sampleText?: string;
  backgroundColor?: string;
  fontColor?: string;
};

export type DownloadBlockData = {
  showTrialFonts?: boolean;
  showSpecimen?: boolean;
  backgroundColor?: string;
  textColor?: string;
};

export type TypeTesterBlockData = {
  backgroundColor?: string;
  foregroundColor?: string;
};

export type BlockMarginSize = "s" | "m" | "l" | "xl";

export type UpdatesBlockData = {
  backgroundColor?: string;
  textColor?: string;
  margin?: BlockMarginSize;
};

export type ShopBlockData = {
  backgroundColor?: string;
  textColor?: string;
  margin?: BlockMarginSize;
  /** Font IDs in display order (drag-and-drop order) */
  fontOrder?: string[];
};

export type AboutBlockTextAlign =
  | "left"
  | "center"
  | "right";
export type AboutBlockTextSize =
  | "s"
  | "m"
  | "l"
  | "xl"
  | "2xl";

export type AboutBlockData = {
  textAlign?: AboutBlockTextAlign;
  textSize?: AboutBlockTextSize;
  textColor?: string;
  backgroundColor?: string;
  /** Margin preset: S (16px), M (42px), L (10vw), XL (16vw) */
  margin?: BlockMarginSize;
};

export type TypefaceLayoutItemData =
  | GalleryBlockData
  | ImageBlockData
  | VideoBlockData
  | CharacterSetBlockData
  | AboutBlockData
  | DownloadBlockData
  | TypeTesterBlockData
  | UpdatesBlockData
  | ShopBlockData
  | import("./layout").StoreBlockData
  | undefined;

export type TypefaceLayoutItem = {
  blockId: TypefaceLayoutBlockId;
  key: string;
  data?: TypefaceLayoutItemData;
};

export type TypefaceLayoutBlock = {
  id: TypefaceLayoutBlockId;
  label: string;
  unique: boolean;
};

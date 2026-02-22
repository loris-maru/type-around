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

export type TypefaceLayoutItemData =
  | GalleryBlockData
  | ImageBlockData
  | VideoBlockData
  | CharacterSetBlockData
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

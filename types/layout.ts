export type LayoutBlockId =
  | "about"
  | "type-tester"
  | "typeface-list"
  | "gallery"
  | "image"
  | "video"
  | "spacer"
  | "store"
  | "blog";

export type LayoutBlock = {
  id: LayoutBlockId;
  label: string;
  unique: boolean;
};

// --- Block configuration data ---

export type BlockAlignment = "left" | "center" | "right";
export type BlockMargin = "s" | "m" | "l" | "xl";

export type GalleryImage = {
  key: string;
  url: string;
  title: string;
  description: string;
  showTitle: boolean;
  showDescription: boolean;
};

export type GalleryBlockData = {
  gap: number;
  images: GalleryImage[];
};

export type ImageBlockData = {
  url: string;
  title: string;
  description: string;
  alignment: BlockAlignment;
  margin: BlockMargin;
};

export type VideoBlockData = {
  url: string;
  title: string;
  description: string;
  alignment: BlockAlignment;
  margin: BlockMargin;
};

export type SpacerSize = "s" | "m" | "l" | "xl";

export type SpacerBlockData = {
  size: SpacerSize;
};

// --- Store block ---

export type StoreProduct = {
  key: string;
  name: string;
  description: string;
  images: string[];
  price: number;
};

export type StoreBlockData = {
  products: StoreProduct[];
};

// --- Blog block ---

export type BlogArticle = {
  key: string;
  name: string;
  introduction: string;
  content: string;
  authors: string[];
  keywords: string[];
};

export type BlogBlockData = {
  title: string;
  articles: BlogArticle[];
};

export type LayoutItemData =
  | GalleryBlockData
  | ImageBlockData
  | VideoBlockData
  | SpacerBlockData
  | StoreBlockData
  | BlogBlockData
  | undefined;

export type LayoutItem = {
  blockId: LayoutBlockId;
  key: string;
  data?: LayoutItemData;
};

// --- Option types for block settings ---

export type AlignmentOption = {
  value: BlockAlignment;
  label: string;
};

export type MarginOption = {
  value: BlockMargin;
  label: string;
};

export type SpacerSizeOption = {
  value: SpacerSize;
  label: string;
};

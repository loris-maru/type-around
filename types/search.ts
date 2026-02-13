export type SearchableItemType =
  | "typeface"
  | "studio"
  | "designer";

export type SearchableItem = {
  id: string;
  name: string;
  type: SearchableItemType;
  href: string;
  /** Extra context shown alongside the name */
  meta?: string;
  /** Searchable string for typeface vision (usage, contrast, width, playful) */
  searchMeta?: string;
};

export type SearchPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

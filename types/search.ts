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
};

export type SearchPanelProps = {
  isOpen: boolean;
  onClose: () => void;
};

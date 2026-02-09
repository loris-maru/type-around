import {
  RiFontSizeAi,
  RiHome5Line,
  RiUser3Line,
} from "react-icons/ri";
import type { SearchableItemType } from "@/types/search";

export const SEARCH_TYPE_ICON: Record<
  SearchableItemType,
  React.ReactNode
> = {
  typeface: (
    <RiFontSizeAi
      size={16}
      className="shrink-0"
    />
  ),
  designer: (
    <RiUser3Line
      size={16}
      className="shrink-0"
    />
  ),
  studio: (
    <RiHome5Line
      size={16}
      className="shrink-0"
    />
  ),
};

export const SEARCH_TYPE_LABEL: Record<
  SearchableItemType,
  string
> = {
  typeface: "Typeface",
  designer: "Designer",
  studio: "Studio",
};

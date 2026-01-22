import { Dispatch, SetStateAction } from "react";

export type NavigationItem = {
  label: string;
  href: string;
};

export type CategoryFilterProps = {
  selectedCategories: string[];
  setSelectedCategories: Dispatch<SetStateAction<string[]>>;
};

export type NavigationItem = {
  label: string;
  href: string;
};

export type CategoryFilterProps = {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<
    React.SetStateAction<string[]>
  >;
  studios?: Array<{
    typefaces: Array<{ category?: string[] }>;
  }>;
};

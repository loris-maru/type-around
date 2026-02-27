"use client";

import { useState } from "react";
import CategoryFilter from "@/components/segments/home/all-fonts/category-filter";

export default function HeaderAllFonts() {
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>([]);

  return (
    <CategoryFilter
      selectedCategories={selectedCategories}
      setSelectedCategories={setSelectedCategories}
    />
  );
}

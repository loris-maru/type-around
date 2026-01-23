"use client";

import STUDIOS from "@/mock-data/studios";
import { useState } from "react";
import CategoryFilter from "@/components/segments/home/all-fonts/category-filter";

export default function HeaderAllFonts() {
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>([]);

  const totalFonts = STUDIOS.reduce(
    (acc, studio) => acc + studio.typefaces.length,
    0
  );

  return (
    <div className="relative w-full flex flex-row gap-x-4 items-center px-8">
      <CategoryFilter
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
      <div className="font-whisper text-sm text-black">
        <span className="font-light">
          Total typefaces:{" "}
        </span>
        <span className="font-bold">{totalFonts}</span>
      </div>
    </div>
  );
}

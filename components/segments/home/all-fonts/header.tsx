"use client";

import { useState } from "react";
import CategoryFilter from "@/components/segments/home/all-fonts/category-filter";
import STUDIOS from "@/mock-data/studios";

export default function HeaderAllFonts() {
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>([]);

  const totalFonts = STUDIOS.reduce(
    (acc, studio) => acc + studio.typefaces.length,
    0
  );

  return (
    <div className="relative flex w-full flex-row items-center gap-x-4 px-8">
      <CategoryFilter
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
      <div className="font-whisper text-black text-sm">
        <span className="font-light">
          Total typefaces:{" "}
        </span>
        <span className="font-bold">{totalFonts}</span>
      </div>
    </div>
  );
}

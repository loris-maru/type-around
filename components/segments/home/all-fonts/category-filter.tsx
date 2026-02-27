"use client";

import type { CategoryFilterProps } from "@/types/Global";

export default function CategoryFilter({
  selectedCategories,
  setSelectedCategories,
  studios = [],
}: CategoryFilterProps) {
  const allCategories = studios.flatMap((studio) =>
    studio.typefaces.flatMap(
      (typeface) => typeface.category ?? []
    )
  );
  const fontCategories: string[] = Array.from(
    new Set(
      allCategories.filter(
        (c): c is string => typeof c === "string"
      )
    )
  );

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="flex flex-row gap-x-4 rounded-sm border border-medium-gray px-4 py-2 shadow-medium-gray">
      {fontCategories.map((category) => (
        <div
          key={category}
          className="flex flex-row gap-x-2 font-whisper text-sm"
        >
          <div className="flex flex-row items-center">
            <label
              htmlFor={category}
              className="font-light capitalize"
            >
              {category}{" "}
            </label>
            <span className="ml-1 font-bold">
              {
                studios
                  .flatMap((studio) =>
                    studio.typefaces.flatMap(
                      (typeface) => typeface.category ?? []
                    )
                  )
                  .filter((c) => c === category).length
              }
              :
            </span>
          </div>
          <input
            type="checkbox"
            id={category}
            checked={selectedCategories.includes(category)}
            onChange={() => handleCategoryToggle(category)}
            className="font-bold"
          />
        </div>
      ))}
    </div>
  );
}

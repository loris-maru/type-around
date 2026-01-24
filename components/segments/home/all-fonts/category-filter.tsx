"use client";

import STUDIOS from "@/mock-data/studios";
import { CategoryFilterProps } from "@/types/Global";

export default function CategoryFilter({
  selectedCategories,
  setSelectedCategories,
}: CategoryFilterProps) {
  const allCategories = STUDIOS.flatMap((studio) =>
    studio.typefaces.flatMap(
      (typeface) => typeface.category
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
    <div className="flex flex-row gap-x-4 border border-medium-gray shadow-medium-gray py-2 px-4 rounded-sm">
      {fontCategories.map((category) => (
        <div
          key={category}
          className="flex flex-row font-whisper text-sm gap-x-2"
        >
          <div className="flex flex-row items-center">
            <label
              htmlFor={category}
              className="font-light capitalize"
            >
              {category}{" "}
            </label>
            <span className="font-bold ml-1">
              {
                STUDIOS.flatMap((studio) =>
                  studio.typefaces.flatMap(
                    (typeface) => typeface.category
                  )
                ).filter((c) => c === category).length
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

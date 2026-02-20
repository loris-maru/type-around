"use client";

import { useMemo, useState } from "react";
import Footer from "@/components/global/footer";
import { TypefaceCard } from "@/components/molecules/cards";
import STUDIOS from "@/mock-data/studios";
import { Typeface } from "@/types/typefaces";
import TypefaceFilter from "@/components/segments/typeface/filter";

export default function AllTypefacesPage() {
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>([]);
  const [selectedStudios, setSelectedStudios] = useState<
    string[]
  >([]);

  const typefacesWithIds: Typeface[] = useMemo(
    () =>
      STUDIOS.flatMap((studio) =>
        studio.typefaces.map((typeface, index) => {
          const hash = studio.id
            .split("")
            .reduce(
              (acc, char) => acc + char.charCodeAt(0),
              0
            );
          return {
            ...typeface,
            id: hash + index,
            category: typeface.category || [],
            hangeulName:
              "hangeulName" in typeface &&
              typeof typeface.hangeulName === "string"
                ? typeface.hangeulName
                : "오흐탕크",
            gradient:
              "gradient" in typeface &&
              typeof typeface.gradient === "string"
                ? typeface.gradient
                : Array.isArray(studio.gradient)
                  ? studio.gradient[0]
                  : studio.gradient,
            fonts: typeface.fonts.map((font) => ({
              ...font,
              price:
                "price" in font
                  ? (font as { price: number }).price
                  : 0,
              text:
                "text" in font
                  ? (font as { text: string }).text
                  : font.fullName,
            })),
          } as Typeface;
        })
      ),
    []
  );

  const allCategories = useMemo(() => {
    const categories = STUDIOS.flatMap((studio) =>
      studio.typefaces.flatMap(
        (typeface) => typeface.category
      )
    );
    return Array.from(
      new Set(
        categories.filter(
          (c): c is string => typeof c === "string"
        )
      )
    );
  }, []);

  const allStudioNames = useMemo(() => {
    return Array.from(
      new Set(STUDIOS.map((studio) => studio.name))
    );
  }, []);

  const filteredTypefaces = useMemo(() => {
    return typefacesWithIds.filter((typeface) => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        typeface.category.some((cat) =>
          selectedCategories.includes(cat)
        );
      const matchesStudio =
        selectedStudios.length === 0 ||
        selectedStudios.includes(typeface.studio);
      return matchesCategory && matchesStudio;
    });
  }, [
    typefacesWithIds,
    selectedCategories,
    selectedStudios,
  ]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleStudioToggle = (studio: string) => {
    setSelectedStudios((prev) =>
      prev.includes(studio)
        ? prev.filter((s) => s !== studio)
        : [...prev, studio]
    );
  };

  return (
    <div className="relative w-full">
      <div className="relative w-full px-10 pt-32 flex flex-col">
        <header className="relative w-full flex flex-col gap-4 mb-12">
          <div className="relative w-full flex flex-row justify-between items-center pb-1">
            <h1 className="text-3xl font-black font-ortank">
              All Typefaces
            </h1>

            <TypefaceFilter
              allCategories={allCategories}
              selectedCategories={selectedCategories}
              handleCategoryToggle={handleCategoryToggle}
              allStudioNames={allStudioNames}
              selectedStudios={selectedStudios}
              handleStudioToggle={handleStudioToggle}
            />
          </div>
          <div className="font-whisper text-sm text-black pt-5 border-t border-medium-gray">
            Showing {filteredTypefaces.length} of{" "}
            {typefacesWithIds.length} typefaces
          </div>
        </header>
        <div className="relative w-full grid grid-cols-4 gap-4">
          {filteredTypefaces.map((typeface) => (
            <TypefaceCard
              key={typeface.id}
              studioName={typeface.studio}
              typeface={typeface}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

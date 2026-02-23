"use client";

import { useMemo, useState } from "react";
import Footer from "@/components/global/footer";
import { TypefaceCard } from "@/components/molecules/cards";
import TypefaceFilter from "@/components/segments/typeface/filter";
import STUDIOS from "@/mock-data/studios";
import type { Typeface } from "@/types/typefaces";

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
      <div className="relative flex w-full flex-col px-10 pt-32">
        <header className="relative mb-12 flex w-full flex-col gap-4">
          <div className="relative flex w-full flex-row items-center justify-between pb-1">
            <h1 className="font-black font-ortank text-3xl">
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
          <div className="border-medium-gray border-t pt-5 font-whisper text-black text-sm">
            Showing {filteredTypefaces.length} of{" "}
            {typefacesWithIds.length} typefaces
          </div>
        </header>
        <div className="relative grid w-full grid-cols-4 gap-4">
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

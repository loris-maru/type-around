"use client";

import { useMemo } from "react";
import type {
  Studio,
  TypefaceMeta,
  TypefaceWithMeta,
} from "@/types/typefaces";
import TypefaceLine from "../typeface/line";

export type TypefacesListProps = {
  studio: Studio;
  typefaceMeta?: TypefaceMeta[];
};

export default function TypefacesList({
  studio,
  typefaceMeta,
}: TypefacesListProps) {
  const typefacesWithIds: TypefaceWithMeta[] =
    useMemo(() => {
      return studio.typefaces.map((typeface, index) => {
        const hash = studio.id
          .split("")
          .reduce(
            (acc, char) => acc + char.charCodeAt(0),
            0
          );
        const meta = typefaceMeta?.find(
          (m) => m.slug === typeface.slug
        );
        return {
          ...typeface,
          id: hash + index,
          category: typeface.category || null,
          displayFontFile: meta?.displayFontFile || "",
          fontLineText: meta?.fontLineText || "",
        };
      }) as TypefaceWithMeta[];
    }, [studio, typefaceMeta]);

  return (
    <div
      className="flex w-full flex-col py-24"
      id="families"
    >
      <div className="relative mb-10 px-10 font-bold font-ortank text-xl">
        The Studio&lsquo;s Typefaces
      </div>
      <div className="relative flex w-full flex-col border-neutral-300 border-y">
        {typefacesWithIds.map((typeface, index) => {
          return (
            <div key={typeface.id}>
              <TypefaceLine
                studioName={studio.name}
                familyName={typeface.name}
                styles={typeface.fonts.length}
                fonts={typeface.fonts.length}
                fontFileUrl={typeface.displayFontFile}
                displayText={typeface.fontLineText}
              />
              {index !== typefacesWithIds.length - 1 && (
                <div className="relative h-px w-full bg-neutral-300" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
